require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const bcrypt = require("bcrypt");
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const jwt = require('jsonwebtoken');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const User = require('../models/user')(sequelize, Sequelize.DataTypes,Sequelize.Model);
const Token = require('../models/token')(sequelize, Sequelize.DataTypes,Sequelize.Model);


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

router.post('/student/create', async(req,res,next) => {
   const salt = await bcrypt.genSalt(10);

   if (req.body.email == null || req.body.username == null || req.body.password == null) {
      res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
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
    res.status(StatusCodes.CREATED).json({createdUser, message: "User created"})
});

router.post('/teacher/create', async(req,res,next) => {
    const salt = await bcrypt.genSalt(10);

    if (req.body.email == null || req.body.username == null || req.body.password == null) {
      res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
      return
    }

    var usr = {
      email: req.body.email,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, salt),
      emailVerified: false,
      role: "TEACHER"
    }
    const createdUser = await create(usr)
    res.status(StatusCodes.CREATED).json({createdUser, message: "User created"})
});

router.post('/login', async(req,res,next) => {
  if (req.body.username == null || req.body.password == null) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
    return
  }
  
  const user = await User.findOne({ where: { username: req.body.username } })
  if (user == null) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found"})
    return
  }
  
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (validPassword) {
    var token = {
      token: jwt.sign({id: user.id, email: user.email, username: user.username, role: user.role}, process.env.SECRET_KEY, {expiresIn: "1h"}),
      expirationDate: Date.now() + 3600000,
      idUser: user.id
    }
    const createdToken = await Token.create(token)
    res.status(StatusCodes.OK).json({createdToken})

    return
  }
  res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid password"})
});

module.exports = router;