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

router.get('/getbyid/:id', async(req, res, next) => {
  const id = req.params.id;
  const log = await Logs.findOne({where: {id: id}});
  if(log == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Log not found"})
    return};
  res.status(StatusCodes.OK).json({log});
});

router.get('/getall', async(req, res, next) => {
  const logs = await Logs.findAll({where : isDeleted = false});
  if(logs.length == 0) {
    res.status(StatusCodes.NOT_FOUND).json({message: "No logs found"})
    return};
  res.status(StatusCodes.OK).json({logs});
});

router.delete('/delete/:id', async(req, res, next) => {
  const id = req.params.id;
  const log = await Logs.findOne({where: {id: id}});
  if(log == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Log not found"})
    return};
  if(log.isDeleted == true) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Log already deleted"})
    return};
  await Logs.update({isDeleted: true}, {where: {id: id}});
  res.status(StatusCodes.OK).json({message: "Log deleted"});
});

router.delete('/harddelete/:id', async(req, res, next) => {
  const id = req.params.id;
  const log = await Logs.findOne({where: {id: id}});
  if(log == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Log not found"})
    return};
  await Logs.destroy({where: {id: id}});
  res.status(StatusCodes.OK).json({message: "Log deleted from database"});
});

router.post('/create', async(req, res, next) => {
  if (Logs.incomingCorrectlyFilled(req.body.Logs) == false) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
    return
  }
  const createdLog = await create(req.body.Logs)
  res.status(StatusCodes.CREATED).json({createdLog, message: "Logs created"})
});

module.exports = router;