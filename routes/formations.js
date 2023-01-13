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

const create = async (frm) => {
  try {
  const createdFormation = await Formation.create(frm)
  } catch (error) {
  console.log(error)
  }
};

router.get('/getall', async(req, res, next) => {
    const formations = await Formation.findAll();
    if (formations.length == 0) {
      res.status(StatusCodes.NO_CONTENT).json({message: "No formations exist."})
      return;
    }

    res.status(StatusCodes.OK).json(JSON.stringify(formations, null, 2))
    return formations;
});

router.post('/create', async(req,res,next) => {
  if (req.body.name == null) {
     res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
 
  var newFormation = {
     name: req.body.name,
     createdAt: Date.now(),
     updatedAt: Date.now()
  }
   const createdFormation = await create(newFormation)
   res.status(StatusCodes.CREATED).json({createdFormation, message: "Formation created"})
});


module.exports = router;