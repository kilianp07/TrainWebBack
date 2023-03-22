require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize } = require("sequelize");
const ChapitreDTO = require('../dto/ChapitreDTO');
const checkToken = require('../middleware/checkJWT');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const Chapitre = require('../models/chapitre')(sequelize, Sequelize.DataTypes,Sequelize.Model);
const Token = require('../models/token')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

router.get('/getbyid/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  res.status(StatusCodes.StatusCodes.OK).json({chapitre});
});

router.get('/getall', checkToken, async(res) => {
  const chapitres = await Chapitre.findAll({where : isDeleted = false});
  if(chapitres.length == 0) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "No chapters found"})
    return};
  res.status(StatusCodes.StatusCodes.OK).json({chapitres});
});

router.put('/update/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  await Chapitre.update(req.body.Chapitre, {where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Chapter updated"});
});

router.delete('/delete/:id', checkToken, async(req, res) => {
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

router.delete('/harddelete/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  await Chapitre.destroy({where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Chapter deleted"});
});

router.post('/create', checkToken, async(req,res) => {
  if (Chapitre.incomingCorrectlyFilled(req.body.Chapitre) == false) {
     res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   try{
    const createdChapitre = await Chapitre.create(req.body.Chapitre)
    res.status(StatusCodes.StatusCodes.CREATED).json({createdChapitre, message: "Chapter created"})
   } catch (err) {
     res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Chapter not created"})
   }
});


router.get('/getallwithexercices', checkToken, async(res) => {
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