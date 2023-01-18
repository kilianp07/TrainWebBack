'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exercice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Exercice.belongsTo(models.Users)
      models.Exercice.belongsTo(models.Chapitre)
      models.Exercice.hasMany(models.Answer)
    }
  }
  Exercice.init({
    consigne: DataTypes.STRING,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    idChapitre: DataTypes.INTEGER,
    idCreateur: DataTypes.INTEGER,
    answer: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Exercice',
  });
  
  Exercice.incomingCorrectlyFilled = function(incomingExercise){
    return incomingExercise.name != null && 
    incomingExercise.consigne != null && 
    incomingExercise.type != null && 
    incomingExercise.answer != null && 
    incomingExercise.idCreateur != null && 
    incomingExercise.idChapitre != null;
  }

  return Exercice;
};