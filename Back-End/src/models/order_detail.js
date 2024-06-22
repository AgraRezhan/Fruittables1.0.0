'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order_detail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            order_detail.belongsTo(models.order, {
                foreignKey: "order_id",
                as: "order"
            })
            order_detail.belongsTo(models.product, {
                foreignKey: "product_id",
                as: "product"
            })
        }
    }
    order_detail.init({
        order_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        price: DataTypes.DECIMAL,
        quantity: DataTypes.INTEGER,
        subtotal: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: 'order_detail',
        underscored: true,
    });
    return order_detail;
};