const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Coupons = sequelize.define('Coupons', {
        id_coupon: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        discount_type: {
            type: DataTypes.ENUM('fixed', 'percentage'),
            allowNull: false,
            defaultValue: 'fixed'
        },
        expiration_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        max_uses: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        current_uses: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        type: {
            type: DataTypes.ENUM('general', 'personalized'),
            allowNull: false
        }
    }, {
        tableName: 'coupons',
        timestamps: false,
        freezeTableName: true
    });

    return Coupons;
};