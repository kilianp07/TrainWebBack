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

Exercice.incomingCorrectlyFilled = (incomingExercise)=>{
  return incomingExercise.name != null && 
  incomingExercise.consigne != null && 
  incomingExercise.type != null && 
  incomingExercise.answer != null && 
  incomingExercise.idCreateur != null && 
  incomingExercise.idChapitre != null;
}


router.get('/getbyid/:id', async(req, res, next) => {
  const id = req.params.id;
  const exercice = await Exercice.findOne({where: {id: id}});
  if(exercice == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Exercice not found"})
    return};
  res.status(StatusCodes.OK).json({exercice});
});

router.get('/getall', async(req, res, next) => {
  const exercices = await Exercice.findAll();
  if(exercices.length == 0) {
    res.status(StatusCodes.NOT_FOUND).json({message: "No exercices found"})
    return};
  res.status(StatusCodes.OK).json({exercices});
});

router.post('/create', async(req,res,next) => {
  if (Exercice.incomingCorrectlyFilled(req.body.Exercice) == false) {
     res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   const createdExercice = await create(req.body.Exercice)
   res.status(StatusCodes.CREATED).json({createdExercice, message: "Exercice created"})
});

module.exports = router;