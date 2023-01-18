require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const bcrypt = require("bcrypt");
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize('database_development', process.env.DB_USER, process.env.DB_PASSWORD,
  {
  dialect: 'mysql'
  }
)
const Token = require('../models/token')(sequelize, Sequelize.DataTypes,Sequelize.Model);


var router = express.Router();
sequelize.authenticate()

router.put('/update', async function(req, res, next) {
    incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]
    if(!incomingToken){
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Token must be filled"})
        return
    }

    if(!await Token.tokenExists(incomingToken)) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: "You must be connected"})
        return
    }

    if(!await Token.verify(incomingToken)) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Token is not valid"})
        return
    }

    Token.deprecate(incomingToken)
    // find which user is associated with the token
    const token = await Token.findOne({where: {token : incomingToken}})
    generatedToken = await Token.generate(token.idUser)
    res.status(StatusCodes.OK).json({token: generatedToken, message: "Token updated"})

});

module.exports = router;