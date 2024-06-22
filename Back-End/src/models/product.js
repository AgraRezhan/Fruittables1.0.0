'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            product.hasMany(models.cart, {
                foreignKey: "product_id",
                as: "cart"
            })
            product.hasMany(models.order_detail, {
                foreignKey: "product_id",
                as: "order_detail"
            })
            product.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user"
            })
        }
    }
    product.init({
        user_id: DataTypes.INTEGER,
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        price: DataTypes.INTEGER,
        stock: DataTypes.INTEGER,
        img_url: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'product',
        underscored: true,
    });
    return product;
};