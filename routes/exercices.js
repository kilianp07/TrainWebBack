require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const Exercice = require('../models/exercice')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

const create = async (exo) => {
    try {
    const createdExo = await Exercice.create(exo)
    } catch (error) {
    console.log(error)
    }
  };


router.post('/create', async(req,res,next) => {
  if (req.body.name == null 
    || req.body.consigne == null 
    || req.body.type == null 
    || req.body.answer == null 
    || req.body.idcreateur == null 
    || req.body.idchapitre == null) {
     res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
 
  var newExercice = {
     name: req.body.name,
     consigne: req.body.consigne,
     type: req.body.type,
     answer: req.body.answer,
     idChapitre : req.body.idchapitre,
     idCreateur : req.body.idcreateur,
     createdAt: Date.now(),
     updatedAt: Date.now()
  }
   const createdExercice = await create(newExercice)
   res.status(StatusCodes.CREATED).json({createdExercice, message: "Exercice created"})
});

module.exports = router;