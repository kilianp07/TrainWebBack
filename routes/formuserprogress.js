require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const FormUserProgress = require('../models/formuserprogress')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

router.get('/getbyid/:id', async(req, res, next) => {
  const id = req.params.id;
    const formuserprogress = await FormUserProgress.findOne({where: {id: id}});
    if(formuserprogress == null) {
        res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "FormUserProgress not found"})
        return};
    res.status(StatusCodes.StatusCodes.OK).json({formuserprogress});
});

router.get('/getall', async(req, res, next) => {
  const formuserprogresses = await FormUserProgress.findAll({where : {isDeleted: false}});
    if(formuserprogresses.length == 0) {
        res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "No FormUserProgresses found"})
        return};
    res.status(StatusCodes.StatusCodes.OK).json({formuserprogresses});
});

router.put('/update/:id', async(req, res, next) => {
  const id = req.params.id;
    const formuserprogress = await FormUserProgress.findOne({where: {id: id}});
    if(formuserprogress == null) {
        res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "FormUserProgress not found"})
        return};
    if(formuserprogress.isDeleted == true) {
        res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "FormUserProgress already deleted"})
        return};
    await FormUserProgress.update(req.body.form_user_progress, {where: {id: id}});
    res.status(StatusCodes.StatusCodes.OK).json({message: "FormUserProgress updated"});
});

router.delete('/delete/:id', async(req, res, next) => {
  const id = req.params.id;
    const formuserprogress = await FormUserProgress.findOne({where: {id: id}});
    if(formuserprogress == null) {
        res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "FormUserProgress not found"})
        return};
    if(formuserprogress.isDeleted == true) {
        res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "FormUserProgress already deleted"})
        return};
    await FormUserProgress.update({isDeleted: true}, {where: {id: id}});
    res.status(StatusCodes.StatusCodes.OK).json({message: "FormUserProgress deleted"});
});

router.delete('/harddelete/:id', async(req, res, next) => {
  const id = req.params.id;
    const formuserprogress = await FormUserProgress.findOne({where: {id: id}});
    if(formuserprogress == null) {
        res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "FormUserProgress not found"})
        return};
    await FormUserProgress.destroy({where: {id: id}});
    res.status(StatusCodes.StatusCodes.OK).json({message: "FormUserProgress deleted from database"});
});

router.post('/create', async(req, res, next) => {
  if(!FormUserProgress.incomingCorrectlyFilled(req.body.form_user_progress)){
        res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "FormUserProgress not correctly filled"});
        return;
    }
    const formuserprogress = await FormUserProgress.create(req.body.form_user_progress);
    res.status(StatusCodes.StatusCodes.OK).json({formuserprogress});
});

module.exports = router;