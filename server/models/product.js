/**
 * Created by Anton on 3/19/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Product = sequelize.define("Product", {
        sku: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        qty: DataTypes.INTEGER,
        price: DataTypes.DECIMAL,
        size: DataTypes.STRING,
        color: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Product.belongsTo(models.Category)
            }
        }
    });

    return Product;
};
