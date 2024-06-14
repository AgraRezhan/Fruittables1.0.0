'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            order.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user"
            })
            order.belongsTo(models.product, {
                foreignKey: "product_id",
                as: "product"
            })
        }
    }
    order.init({
        user_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        total_price: DataTypes.INTEGER,
        status: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'order',
        underscored: true,
    });
    return order;
};