/**
 * Created by Anton on 3/18/2016.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Category = sequelize.define("Category", {
        name: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        createdBy: DataTypes.STRING,
        updatedBy: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                Category.hasMany(models.Product),
                    Category.hasMany(models.Category)
            }
        }
    });

    return Category;
};

