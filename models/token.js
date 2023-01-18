'use strict';
const jwt = require('jsonwebtoken');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Token.belongsTo(models.User)
    }
  }
  Token.init({
    token: DataTypes.STRING,
    expirationDate: DataTypes.DATE,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Token',
  });

  Token.verify = async function(token) {
    try{
      jwt.verify(token, process.env.SECRET_KEY)
    }catch(err){
      return false
    }
    return true
  }

  Token.generate = async function(Userid) {
    var token = {
      token: jwt.sign({id: Userid}, process.env.SECRET_KEY, {expiresIn: "1h"}),
      expirationDate: Date.now() + 36000,
      idUser: Userid
    }
    return await Token.create(token)
  }

  Token.tokenExists = async function(token) {
    return await Token.findOne({ where: { token: token } }) != null
  }

  return Token;
};
