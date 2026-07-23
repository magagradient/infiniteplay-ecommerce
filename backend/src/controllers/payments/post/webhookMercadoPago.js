const { Orders, OrdersProducts, Products, ProductImages, Users } = require("../../../database/indexModels");
const { sendPurchaseEmail, sendSaleNotification, sendErrorEmail } = require("../../../utils/mailer");

const webhookMercadoPago = async (req, res) => {
    try {
        const { type, data } = req.body;

        console.log("Webhook MP recibido:", type, data);

        if (type !== "payment") {
            return res.sendStatus(200);
        }

        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
        });

        const payment = await mpRes.json();
        console.log("Pago MP:", payment.status, payment.external_reference);

        if (payment.status !== "approved") {
            return res.sendStatus(200);
        }

        const id_order = parseInt(payment.external_reference);

        const order = await Orders.findByPk(id_order);
        if (order) {
            order.status = "paid";
            await order.save();
        
            // actualizar acceso al studio — 15 días desde ahora
            const user = await Users.findByPk(order.id_user);
            if (user) {
                const expires = new Date();
                expires.setDate(expires.getDate() + 15);
                user.studio_expires_at = expires;
                await user.save();
            }
        }

        const orderProducts = await OrdersProducts.findAll({ where: { id_order } });
        const productsForEmail = [];

        for (const op of orderProducts) {
            const product = await Products.findByPk(op.id_product);
            if (product) {
                product.is_sold = true;
                await product.save();

                const images = await ProductImages.findAll({ where: { id_product: op.id_product } });
                productsForEmail.push({
                    title: product.title,
                    images: images.map(img => ({ image_url: img.image_url, image_type: img.image_type }))
                });
            }
        }

        if (order) {
            const user = await Users.findByPk(order.id_user);
            if (user) {
                await sendPurchaseEmail(user.email, productsForEmail);
                await sendSaleNotification(
                    productsForEmail.map(p => p.title),
                    id_order,
                    user.email
                );
            }
        }

        return res.sendStatus(200);

    } catch (error) {
        console.error("Error en webhook MP:", error);
        const order = await Orders.findByPk(parseInt(req.body?.data?.id)).catch(() => null);
        const user = order ? await Users.findByPk(order.id_user).catch(() => null) : null;
        await sendErrorEmail("MercadoPago", error.message, user?.email || null);
        return res.sendStatus(500);
    }
};

module.exports = webhookMercadoPago;