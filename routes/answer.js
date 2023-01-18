require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)

const Answer = require('../models/answer')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

const create = async (answer) => {
    try {
    const createdAnswer = await Answer.create(answer)
    } catch (error) {
    console.log(error)
    }
};

Answer.incomingCorrectlyFilled = (incomingAnswer)=>{
    return incomingAnswer.idExercice != null && 
    incomingAnswer.idUser != null && 
    incomingAnswer.value != null && 
    incomingAnswer.status != null && 
    incomingAnswer.suspended != null;
}

router.get('/getbyid/:id', async(req, res, next) => {
  const id = req.params.id;
  const answer = await Answer.findOne({where: {id: id}});
  if(answer == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Answer not found"})
    return};
  res.status(StatusCodes.OK).json({answer});
});

router.get('/getall', async(req, res, next) => {
  const answers = await Answer.findAll({where : {isDeleted: false}});
  if(answers.length == 0) {
    res.status(StatusCodes.NOT_FOUND).json({message: "No answers found"})
    return};
  res.status(StatusCodes.OK).json({answers});
});

router.post('/create', async(req,res,next) => {
    if (Answer.incomingCorrectlyFilled(req.body.Answer) == false) {
       res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
       return
     }
     const createdAnswer = await create(req.body.Answer)
     res.status(StatusCodes.CREATED).json({createdAnswer, message: "Answer created"})
});

router.delete('/delete/:id', async(req, res, next) => {
    const id = req.params.id;
    const answer = await Answer.findOne({where: {id: id}});
    if(answer == null) {
      res.status(StatusCodes.NOT_FOUND).json({message: "Answer not found"})
      return};
    if(answer.isDeleted == true) {
    res.status(StatusCodes.OK).json({message: "Answer already deleted"});
      return
    }
    await Answer.update({isDeleted : true}, {where: {id: id}});
    res.status(StatusCodes.OK).json({message: "Answer deleted"});
});
  
router.delete('/harddelete/:id', async(req, res, next) => {
    const id = req.params.id;
    const answer = await Answer.findOne({where: {id: id}});
    if(answer == null) {
      res.status(StatusCodes.NOT_FOUND).json({message: "Answer not found"})
      return};
    await Answer.destroy({where: {id: id}});
    res.status(StatusCodes.OK).json({message: "Answer deleted from database"});
});

router.put('/update/:id', async(req, res, next) => {
  const id = req.params.id;
  const answer = await Answer.findOne({where: {id: id}});
  if(answer == null) {
    res.status(StatusCodes.NOT_FOUND).json({message: "Answer not found"})
    return};
  await Answer.update(req.body.Answer, {where: {id: id}});
  res.status(StatusCodes.OK).json({message: "Answer updated"});
});

module.exports = router;
