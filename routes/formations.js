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
const Formation = require('../models/formation')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

router.get('/getbyid/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const formation = await Formation.findOne({where: {id: id}});
  if(formation == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Formation not found"})
    return};
  res.status(StatusCodes.StatusCodes.OK).json({formation});
});


router.get('/getall', async(req, res) => {
    try{
      let formations = await Formation.findAll();
      if (formations.length == 0) {
        res.status(StatusCodes.StatusCodes.NO_CONTENT).json({message: "No formations exist."})
        return;
      }
      res.status(StatusCodes.StatusCodes.OK).json(formations)
    }catch(err){
      res.status(StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Unable to get Formations"})
    }
});

router.post('/create', checkToken, async(req,res) => {
  if (Formation.incomingCorrectlyFilled(req.body.Formation) == false) {
     res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
     return
   }
   try{
    const createdFormation = await Formation.create(req.body.Formation)
    res.status(StatusCodes.StatusCodes.CREATED).json({createdFormation, message: "Formation created"})
   } catch (error) {
      res.status(StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})
    }
});

router.delete('/delete/:id', checkToken, async(req, res) => {
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

router.delete('/harddelete/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const formation = await Formation.findOne({where: {id: id}});
  if(formation == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Formation not found"})
    return};
  await Formation.destroy({where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Formation deleted from database"});
});


router.put('/update/:id', checkToken, async(req, res) => {
  const id = req.params.id;
  const formation = await Formation.findOne({where: {id: id}});
  if(formation == null) {
    res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Formation not found"})
    return};
  await Formation.update(req.body.Formation, {where: {id: id}});
  res.status(StatusCodes.StatusCodes.OK).json({message: "Formation updated"});
});


module.exports = router;