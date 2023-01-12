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

//Récupère tous les chapitres et leurs exos
router.get('/getallbyidformation', async(req, res, next) => {
    var reqIdFormation = req.body.idformation
    const chapitres = await Chapitre.findAll({where : idFormation = reqIdFormation});
    if (chapitres.length == 0) {
      res.status(StatusCodes.NO_CONTENT).json({message: "No chapitres exist."})
      return;
    }

    //a revoir, modifier chapitre model pour rajouter un objet exercice dans les champs?
    chapitres.forEach(async element => {
      const exercices = await Chapitre.findAll({where : idChapitre = element.id});
      element["exercices"] = exercices;
    });

    res.status(StatusCodes.OK).json(JSON.stringify(chapitres, null, 2))
    return chapitres;
});

module.exports = router;