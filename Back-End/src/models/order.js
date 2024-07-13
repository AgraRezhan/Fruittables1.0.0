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
            order.hasMany(models.order_detail, {
                foreignKey: "order_id",
                as: "order_detail"
            })
            order.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user"
            })
            order.hasOne(models.shipping, {
                foreignKey: "order_id",
                as: "shipping"
            })
        }
    }
    order.init({
        user_id: DataTypes.INTEGER,
        order_date: DataTypes.DATE,
        address: DataTypes.STRING,
        total: DataTypes.DECIMAL,
        status: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'order',
        underscored: true,
    });
    return order;
};