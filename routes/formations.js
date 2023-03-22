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
const Token = require('../models/token')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

const create = async (frm) => {
  try {
  const createdFormation = await Formation.create(frm)
  } catch (error) {
  console.log(error)
  }
};

router.get('/getbyid/:id', async(req, res, next) => {
  const id = req.params.id;
  const formation = await Formation.findOne({where: {id: id}});
  if(formation == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Formation not found"})
    return};
  res.status(StatusCodes.StatusCodes.OK).json({formation});
});


router.get('/getall', async(req, res, next) => {
    const formations = await Formation.findAll();
    if (formations.length == 0) {
      res.status(StatusCodes.StatusCodes.NO_CONTENT).json({message: "No formations exist."})
      return;
    }

    res.status(StatusCodes.StatusCodes.OK).json(formations)
});

router.post('/create', async(req,res,next) => {
  if (Formation.incomingCorrectlyFilled(req.body.Formation) == false) {
     res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   const createdFormation = await create(req.body.Formation)
   res.status(StatusCodes.StatusCodes.CREATED).json({createdFormation, message: "Formation created"})
});

router.delete('/delete/:id', async(req, res, next) => {
  const id = req.params.id;
  const formation = await Formation.findOne({where: {id: id}});
  if(formation == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Formation not found"})
    return};
  if(formation.isDeleted == true) {
  res.status(StatusCodes.StatusCodes.OK).json({message: "Formation already deleted"});
    return
  }
  await Formation.update({isDeleted : true}, {where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Formation deleted"});
});

router.delete('/harddelete/:id', async(req, res, next) => {
  const id = req.params.id;
  const formation = await Formation.findOne({where: {id: id}});
  if(formation == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Formation not found"})
    return};
  await Formation.destroy({where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Formation deleted from database"});
});


router.put('/update/:id', async(req, res, next) => {
  const id = req.params.id;
  const formation = await Formation.findOne({where: {id: id}});
  if(formation == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Formation not found"})
    return};
  await Formation.update(req.body.Formation, {where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Formation updated"});
});


module.exports = router;