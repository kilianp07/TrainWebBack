require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const Role = require('../models/role')(sequelize, Sequelize.DataTypes,Sequelize.Model);
const Token = require('../models/token')(sequelize, Sequelize.DataTypes,Sequelize.Model);
var router = express.Router();

const create = async (role) => {
    try {
    const createdRole = await Role.create(role)
    } catch (error) {
    console.log(error)
    }
};

router.get('/getbyid/:id', async(req, res, next) => {
  const id = req.params.id;
    const role = await Role.findOne({where: {id: id}});
    if(role == null) {
      res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Role not found"})
      return};
    res.status(StatusCodes.StatusCodes.OK).json({role});
});

router.get('/getall', async(req, res, next) => {
  const roles = await Role.findAll({where : {isDeleted: false}});
    if(roles.length == 0) {
      res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "No roles found"})
      return};
    res.status(StatusCodes.StatusCodes.OK).json({roles});
});

router.delete('/delete/:id', async(req, res, next) => {
  const id = req.params.id;
    const role = await Role.findOne({where: {id: id}});
    if(role == null) {
      res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Role not found"})
      return};
    if(role.isDeleted == true) {
    res.status(StatusCodes.StatusCodes.OK).json({message: "Role already deleted"});
      return
    }
    await Role.update({isDeleted : true}, {where: {id: id}});
    res.status(StatusCodes.StatusCodes.OK).json({message: "Role deleted"});
  });
  
  router.delete('/harddelete/:id', async(req, res, next) => {
  const id = req.params.id;
    const role = await Role.findOne({where: {id: id}});
    if(role == null) {
      res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Role not found"})
      return};
    await Role.destroy({where: {id: id}});
    res.status(StatusCodes.StatusCodes.OK).json({message: "Role deleted from database"});
  });

  router.post('/create', async(req,res,next) => {
  if (Role.incomingCorrectlyFilled(req.body.Role) == false) {
       res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
       return
     }
     const createdRole = await create(req.body.Role)
     res.status(StatusCodes.StatusCodes.CREATED).json({createdRole, message: "Role created"})
  });

  router.put('/update/:id', async(req, res, next) => {
  const id = req.params.id;
    const role = await Role.findOne({where: {id: id}});
    if(role == null) {
      res.status(StatusCodes.StatusCodes.NOT_FOUND).json({message: "Role not found"})
      return};
    await Role.update(req.body.Role, {where: {id: id}});
    res.status(StatusCodes.StatusCodes.OK).json({message: "Role updated"});
  });
  
  module.exports = router;
