'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Answer.belongsTo(models.User)
      models.Answer.belongsTo(models.Exercice)
    }
  }
  Answer.init({
    idExercice: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    value: DataTypes.STRING,
    suspended: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Answer',
  });

  
  Answer.incomingCorrectlyFilled = function(incomingAnswer){
    return incomingAnswer.idExercice != null && 
    incomingAnswer.idUser != null && 
    incomingAnswer.value != null && 
    incomingAnswer.status != null && 
    incomingAnswer.suspended != null;
  }
  return Answer;
};