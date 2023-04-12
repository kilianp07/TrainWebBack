require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  {
  dialect: 'mysql'
  }
)
const RefreshToken = require('../models/refreshToken')(sequelize, Sequelize.DataTypes,Sequelize.Model);

var router = express.Router();
sequelize.authenticate()

router.put('/update', async function(req, res, next) {
    incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]
    if(!incomingToken){
        res.status(StatusCodes.StatusCodes.UNAUTHORIZED).json({message: "Token must be filled"})
        return
    }

    if(!await RefreshToken.tokenExists(incomingToken)) {
        res.status(StatusCodes.StatusCodes.UNAUTHORIZED).json({message: "You must be connected"})
        return
    }

    if(!await RefreshToken.verify(incomingToken)) {
        res.status(StatusCodes.StatusCodes.UNAUTHORIZED).json({message: "Token is not valid"})
        return
    }

    RefreshToken.deprecate(incomingToken)
    // find which user is associated with the token
    const token = await RefreshToken.findOne({where: {token : incomingToken}})
    generatedToken = await RefreshToken.refresh(incomingToken)
    res.status(StatusCodes.StatusCodes.OK).json({token: generatedToken, message: "Token updated"})

});

module.exports = router;