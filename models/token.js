'use strict';
const jwt = require('jsonwebtoken');
const fs = require('fs');
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
    idUser: DataTypes.INTEGER,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Token'
  });

  Token.verify = async function(token) {
    var privateKey = fs.readFileSync(process.env.SECRET_KEY);
    try {
      const decoded = jwt.decode(token, {complete: true});
      if (!decoded || !decoded.payload || !decoded.payload.exp) {
          console.log("Invalid token");
          return false;
      }
      const expirationTime = decoded.payload.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime >= expirationTime) {
          console.log("Token expired");
          Token.findOne({ where: { token: token } }).then(token => {
            token.isDeleted = true;
            token.save();
          })
          return false;
      }
      // Token is valid and not expired
      jwt.verify(token, privateKey);
      return true;
    } catch (err) {
      return false;
    }
  }

  Token.generate = async function(Userid) {
    var privateKey = fs.readFileSync(process.env.SECRET_KEY);
    var token = {
      token: jwt.sign({id: Userid}, privateKey, {expiresIn: process.env.TOKEN_DURABILITY}),
      expirationDate: Date.now() + Number(process.env.TOKEN_DURABILITY),
      idUser: Userid,
      isDeleted: false
    }
    return await Token.create(token)
  }

  Token.tokenExists = async function(token) {
    return await Token.findOne({ where: { token: token, isDeleted: false } }) != null
  }

  Token.deprecate = async function(token) {
    Token.findOne({ where: { token: token } }).then(token => {
      token.isDeleted = true;
      token.save();
    })
  }

  return Token;
};
