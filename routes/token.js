require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const bcrypt = require("bcrypt");
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  {
  dialect: 'mysql'
  }
)
const Token = require('../models/token')(sequelize, Sequelize.DataTypes,Sequelize.Model);


var router = express.Router();
sequelize.authenticate()

router.put('/update', async function(req, res, next) {
    incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]
    
    Token.deprecate(incomingToken)
    // find which user is associated with the token
    const token = await Token.findOne({where: {token : incomingToken}})
    generatedToken = await Token.generate(token.idUser)
    res.status(StatusCodes.StatusCodes.OK).json({token: generatedToken, message: "Token updated"})

});

module.exports = router;