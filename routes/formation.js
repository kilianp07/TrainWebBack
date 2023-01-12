require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const Formation = require('../models/formation')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

router.get('/getall', async(req, res, next) => {
    const formations = await Formation.findAll();
    if (formations.length == 0) {
      res.status(StatusCodes.NO_CONTENT).json({message: "No formations exist."})
      return;
    }

    res.status(StatusCodes.OK).json(JSON.stringify(formations, null, 2))
    return formations;
});

module.exports = router;