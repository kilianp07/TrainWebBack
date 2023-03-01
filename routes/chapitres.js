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
var router = express.Router();

const create = async (chapter) => {
  try {
  } catch (error) {
  console.log(error)
  }
};

router.get('/getbyid/:id', async(req, res, next) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  res.status(StatusCodes.OK).json({chapitre});
});

router.get('/getall', async(req, res, next) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
  const chapitres = await Chapitre.findAll({where : isDeleted = false});
  if(chapitres.length == 0) {
    res.status(StatusCodes.NOT_FOUND).json({message: "No chapters found"})
    return};
  res.status(StatusCodes.OK).json({chapitres});
});

router.put('/update/:id', async(req, res, next) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  await Chapitre.update(req.body.Chapitre, {where: {id: id}});
  res.status(StatusCodes.OK).json({message: "Chapter updated"});
});

router.delete('/delete/:id', async(req, res, next) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
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
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
  const id = req.params.id;
  const chapitre = await Chapitre.findOne({where: {id: id}});
  if(chapitre == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Chapter not found"})
    return};
  await Chapitre.destroy({where: {id: id}});
  res.status(StatusCodes.OK).json({message: "Chapter deleted"});
});

router.post('/create', async(req,res,next) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
  if (Chapitre.incomingCorrectlyFilled(req.body.Chapitre) == false) {
     res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   const createdChapitre = await create(req.body.Chapitre)
   res.status(StatusCodes.CREATED).json({createdChapitre, message: "Chapter created"})
});


router.get('/getallwithexercices', async(req, res, next) => {
  const chapitres = await Chapitre.findAll({where : isDeleted = false});
  if(chapitres.length == 0) {
    res.status(StatusCodes.NOT_FOUND).json({message: "No chapters found"})
    return
  };

  FoundChapitres = []
  for(i = 0; i < chapitres.length; i++) {
     FoundChapitres.push(new ChapitreDTO(chapitres[i]));
  }

  res.status(StatusCodes.OK).json({FoundChapitres});
});

module.exports = router;