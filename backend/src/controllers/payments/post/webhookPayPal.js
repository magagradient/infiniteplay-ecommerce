const { Orders, OrdersProducts, Products, ProductImages, Users } = require("../../../database/indexModels");
const { sendPurchaseEmail, sendSaleNotification, sendErrorEmail } = require("../../../utils/mailer");

const webhookPayPal = async (req, res) => {
    try {
        const event = req.body;

        console.log("Webhook PayPal recibido:", event.event_type);

        if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
            return res.sendStatus(200);
        }

        const id_order = parseInt(event.resource.supplementary_data?.related_ids?.order_id || 0);

        if (!id_order) {
            console.log("No se encontró id_order en el webhook PayPal");
            return res.sendStatus(200);
        }

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
        console.error("Error en webhook PayPal:", error);
        const id_order = parseInt(req.body?.resource?.supplementary_data?.related_ids?.order_id || 0);
        const order = id_order ? await Orders.findByPk(id_order).catch(() => null) : null;
        const user = order ? await Users.findByPk(order.id_user).catch(() => null) : null;
        await sendErrorEmail("PayPal", error.message, user?.email || null);
        return res.sendStatus(500);
    }
};

module.exports = webhookPayPal;