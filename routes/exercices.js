require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize } = require("sequelize");
const checkToken = require('../middleware/checkJWT');
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

router.get('/getbyid/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const exercice = await Exercice.findOne({where: {id: id}});
  if(exercice == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Exercice not found"})
    return};
  res.status(StatusCodes.StatusCodes.OK).json({exercice});
});

router.get('/getall', checkToken, async(res) => {
  const exercices = await Exercice.findAll({where : isDeleted = false});
  if(exercices.length == 0) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "No exercices found"})
    return};
  res.status(StatusCodes.StatusCodes.OK).json({exercices});
});

router.put('/update/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const exercice = await Exercice.findOne({where: {id: id}});
  if(exercice == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Exercice not found"})
    return};
  await Exercice.update(req.body.Exercice, {where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Exercice updated"});
});

router.delete('/delete/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const exercice = await Exercice.findOne({where: {id: id}});
  if(exercice == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Exercice not found"})
    return};
  if(exercice.isDeleted == true) {
  res.status(StatusCodes.StatusCodes.OK).json({message: "Exercice already deleted"});
    return
  }
  await Exercice.update({isDeleted : true}, {where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Exercice deleted"});
});

router.delete('/harddelete/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const exercice = await Exercice.findOne({where: {id: id}});
  if(exercice == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Exercice not found"})
    return};
  await Exercice.destroy({where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Exercice deleted from database"});
});

router.post('/create', checkToken, async(req,res) => {
  if (Exercice.incomingCorrectlyFilled(req.body.Exercice) == false) {
     res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   try{
    const createdExercice = await Exercice.create(req.body.Exercice)
    res.status(StatusCodes.StatusCodes.CREATED).json({createdExercice, message: "Exercice created"})
   } catch (error) {
     console.log(error)
     res.status(StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal server error"})
   }
});

module.exports = router;