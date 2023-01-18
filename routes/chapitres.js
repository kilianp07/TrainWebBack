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

Chapitre.incomingCorrectlyFilled = (incomingChapitre)=>{
  return incomingChapitre.name != null &&
  incomingChapitre.idFormation != null
}



// //Get all chapters along with their associated exercises
// router.get('/getbyformationid', async(req, res, next) => {
//     var reqIdFormation = req.params.idformation
//     const chapitres = await Chapitre.findAll({where : idFormation = reqIdFormation});
//     if (chapitres.length == 0) {
//       res.status(StatusCodes.NO_CONTENT).json({message: "No chapitres exist."})
//       return;
//     }

//     //couldnt manage to assign exercises to their respectives chapter here
//     chapitres.forEach(async chapter => {
//       const exercices = await Exercice.findAll({where : idChapitre = chapter.id});
//       const chapitreAssign = await Chapitre.assign
//       // chapter["exercices"] = exercices;
//       // console.log(chapter["exercices"], "exercice")
//     });
//     res.status(StatusCodes.OK).json(chapitres)
// });

router.post('/create', async(req,res,next) => {
  if (Chapitre.incomingCorrectlyFilled(req.body.Chapitre) == false) {
     res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   const createdChapitre = await create(req.body.Chapitre)
   res.status(StatusCodes.CREATED).json({createdChapitre, message: "Chapter created"})
});

module.exports = router;