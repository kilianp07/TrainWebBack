require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const ChapitreDTO = require('../dto/ChapitreDTO');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const Chapitre = require('../models/chapitre')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

const create = async (chapter) => {
  try {
  } catch (error) {
  console.log(error)
  }
};

router.get('/getbyid/:id', async(req, res, next) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  res.status(StatusCodes.StatusCodes.OK).json({chapitre});
});

router.get('/getall', async(req, res, next) => {
  const chapitres = await Chapitre.findAll({where : isDeleted = false});
  if(chapitres.length == 0) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "No chapters found"})
    return};
  res.status(StatusCodes.StatusCodes.OK).json({chapitres});
});

router.put('/update/:id', async(req, res, next) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  await Chapitre.update(req.body.Chapitre, {where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Chapter updated"});
});

router.delete('/delete/:id', async(req, res, next) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  if(chapitre.isDeleted == true) {
    res.status(StatusCodes.StatusCodes.OK).json({message: "Exercice already deleted"});
      return
  }
  await Chapitre.update({isDeleted : true},{where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Chapter deleted"});
});

router.delete('/harddelete/:id', async(req, res, next) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  await Chapitre.destroy({where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Chapter deleted"});
});

router.post('/create', async(req,res,next) => {
  if (Chapitre.incomingCorrectlyFilled(req.body.Chapitre) == false) {
     res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   const createdChapitre = await create(req.body.Chapitre)
   res.status(StatusCodes.StatusCodes.CREATED).json({createdChapitre, message: "Chapter created"})
});


router.get('/getallwithexercices', async(req, res, next) => {
  const chapitres = await Chapitre.findAll({where : isDeleted = false});
  if(chapitres.length == 0) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "No chapters found"})
    return
  };

  FoundChapitres = []
  for(i = 0; i < chapitres.length; i++) {
      chaptDto = new ChapitreDTO(chapitres[i])
      await chaptDto.loadExercices(chapitres[i].id)
      FoundChapitres.push(chaptDto);
  }

  res.status(StatusCodes.StatusCodes.OK).json({FoundChapitres});
});

module.exports = router;