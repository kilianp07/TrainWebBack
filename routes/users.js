require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const bcrypt = require("bcrypt");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize('database_development', process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const User = require('../models/user')(sequelize, Sequelize.DataTypes,Sequelize.Model);
const Role = require('../models/role')(sequelize, Sequelize.DataTypes,Sequelize.Model);

var router = express.Router();
sequelize.authenticate()
const create = async (usr) => {
  try {
  const createdUser = await User.create(usr)
  } catch (error) {
  console.log(error)
  }
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', async(req,res,next) => {
   const salt = await bcrypt.genSalt(10);

   if (req.body.email == null || req.body.username == null || req.body.password == null) {
      res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
      console.log(req.body.email)
      return
    }
  
   var usr = {
      email: req.body.email,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, salt),
      emailVerified: false,
      role: "USER"
   }
    const createdUser = await create(usr)
    res.status(StatusCodes.CREATED).json({createdUser})
});

module.exports = router;