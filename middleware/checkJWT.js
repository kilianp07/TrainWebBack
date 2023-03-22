const jwt = require('jsonwebtoken');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mysql'
});

const Token = require('../models/token')(sequelize, DataTypes, Model);

const StatusCodes = require('http-status-codes');

async function verifyTokenMiddleware(req, res, next) {
  const incomingToken = req.headers["authorization"] && req.headers["authorization"].split(' ')[1];

  if(!incomingToken) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Missing token"});
    return;
  }
    
  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"});
    return;
  }
  
  if(!await Token.verify(incomingToken)) {
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"});
    return;
  }
  
  // If token is valid, call next middleware or route handler
  next();
}

module.exports = verifyTokenMiddleware;
