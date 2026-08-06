const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Orders = sequelize.define("Order", {
        id_order: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id_user"
            },
            onDelete: "CASCADE"
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        subtotal: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true
      },
      discount_total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0
      },
        status: {
            type: DataTypes.ENUM("pending", "paid", "canceled"),
            allowNull: false,
            defaultValue: "pending"
        }
    }, {
        tableName: "orders",
        timestamps: false,
        freezeTableName: true 
    });

    return Orders;
};
