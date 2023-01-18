require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const Logs = require('../models/logs')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

const create = async (log) => {
    try {
    const createdLog = await Logs.create(log)
    } catch (error) {
    console.log(error)
    }
  };


router.post('/create', async(req, res, next) => {
  if (Logs.incomingCorrectlyFilled(req.body.Logs) == false) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
    return
  }
  const createdLog = await create(req.body.Logs)
  res.status(StatusCodes.CREATED).json({createdLog, message: "Logs created"})
});

module.exports = router;