require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const Chapitre = require('../models/chapitre')(sequelize, Sequelize.DataTypes,Sequelize.Model);
const Exercice = require('../models/exercice')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

const create = async (chapter) => {
  try {
  const createdChapter = await Chapitre.create(chapter)
  } catch (error) {
  console.log(error)
  }
};

router.get('/getbyid/:id', async(req, res, next) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  res.status(StatusCodes.OK).json({chapitre});
});

router.get('/getall', async(req, res, next) => {
  const chapitres = await Chapitre.findAll({where : isDeleted = false});
  if(chapitres.length == 0) {
    res.status(StatusCodes.NOT_FOUND).json({message: "No chapters found"})
    return};
  res.status(StatusCodes.OK).json({chapitres});
});

router.get('/getallwithexercices', async(req, res, next) => {
  const chapitres = await Chapitre.findAll({where : isDeleted = false});
  if(chapitres.length == 0) {
    res.status(StatusCodes.NOT_FOUND).json({message: "No chapters found"})
    return};

  chapitresWithExercices = [];
  for(var chap of chapitres) {
    exercices = await Exercice.findAll({where: {idChapitre : chap.id, isDeleted : false}});
    chapitresWithExercices.push({"Chapitre": chap, "exercices": exercices});
  }
  res.status(StatusCodes.OK).json({chapitresWithExercices});
});

router.put('/update/:id', async(req, res, next) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  await Chapitre.update(req.body.Chapitre, {where: {id: id}});
  res.status(StatusCodes.OK).json({message: "Chapter updated"});
});

router.delete('/delete/:id', async(req, res, next) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  if(chapitre.isDeleted == true) {
    res.status(StatusCodes.OK).json({message: "Exercice already deleted"});
      return
  }
  await Chapitre.update({isDeleted : true},{where: {id: id}});
  res.status(StatusCodes.OK).json({message: "Chapter deleted"});
});

router.delete('/harddelete/:id', async(req, res, next) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  await Chapitre.destroy({where: {id: id}});
  res.status(StatusCodes.OK).json({message: "Chapter deleted"});
});

router.post('/create', async(req,res,next) => {
  if (Chapitre.incomingCorrectlyFilled(req.body.Chapitre) == false) {
     res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   const createdChapitre = await create(req.body.Chapitre)
   res.status(StatusCodes.CREATED).json({createdChapitre, message: "Chapter created"})
});

module.exports = router;