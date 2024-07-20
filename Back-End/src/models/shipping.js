'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class shipping extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            shipping.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user"
            })
            shipping.belongsTo(models.order, {
                foreignKey: "order_id",
                as: "order"
            })
        }
    }
    shipping.init({
        user_id: DataTypes.INTEGER,
        order_id: DataTypes.INTEGER,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        company_name: DataTypes.STRING,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        postcode: DataTypes.INTEGER,
        mobile: DataTypes.STRING,
        email: DataTypes.STRING,
        img_payment: DataTypes.TEXT,
        note: DataTypes.STRING,
        payment_method: DataTypes.STRING,
        total: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: 'shipping',
        underscored: true,
    });
    return shipping;
};