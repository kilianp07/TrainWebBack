'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Role.hasMany(models.User)
    }
  }
  Role.init({
    value: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Role',
  });
  
  Role.incomingCorrectlyFilled = function(incomingRole){
    return incomingRole.value != null;
  }
  return Role;
};