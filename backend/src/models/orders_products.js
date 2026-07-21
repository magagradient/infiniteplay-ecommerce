const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const OrdersProducts = sequelize.define("OrdersProducts", {
        id_order: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "orders",
                key: "id_order"
            },
            onDelete: "CASCADE"
        },
        id_product: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "products",
                key: "id_product"
            },
            onDelete: "CASCADE"
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        artist_name: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        artist_bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        music_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        // --- Campos de personalización (cover/flyer a medida) ---
        custom_title: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        custom_artist_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        event_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        event_location: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        custom_notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fulfillment_status: {
            type: DataTypes.ENUM("not_applicable", "pending_customization", "ready"),
            allowNull: false,
            defaultValue: "not_applicable",
        },
        final_file_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        tableName: "orders_products",
        timestamps: false,
        freezeTableName: true
    },

    );

    return OrdersProducts;
};