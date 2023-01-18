require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const bcrypt = require("bcrypt");
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize('database_development', process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const User = require('../models/user')(sequelize, Sequelize.DataTypes,Sequelize.Model);
const Token = require('../models/token')(sequelize, Sequelize.DataTypes,Sequelize.Model);


var router = express.Router();
sequelize.authenticate()

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/student/create', async(req,res,next) => {
   const salt = await bcrypt.genSalt(10);
   const incomingUser = req.body.user

   // Check if all parameters are filled
   if (!User.incomingCorrectlyFilled(incomingUser)) {
      res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
      return
    }
  
    // Check if user already exists
    if (await User.userExists(incomingUser.email, "email")) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is already used"})
      return
    }
    if (await User.userExists(incomingUser.username, "username")) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is already used"})
      return
    }
  
    // Create user
    var usr = {
      email: incomingUser.email,
      username: incomingUser.username,
      password: await bcrypt.hash(incomingUser.password, salt),
      emailVerified: false,
      role: "STUDENT"
    }
    const createdUser = await User.create(usr)
    res.status(StatusCodes.CREATED).json({createdUser, message: "User created"})
});

router.post('/teacher/create', async(req,res,next) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if(!await Token.tokenExists(incomingToken)) {
  if(!Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: "You must be connected"})
    return
  }

  if(!await Token.verifyToken(incomingToken)) {
  if(!Token.verifyToken(incomingToken)) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: "You must be connected"})
    return
  }
  
  token = await Token.findOne({ where: { token: incomingToken } })
  if(!await User.userExists(token.idUser, "id")) {
  if(!User.userExists(token.idUser, "id")) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: "Unrecognized user"})
    return
  }

    const user = await User.findOne({ where: { id: token.idUser } })
    if(user.role != "ADMIN" || user.role != "TEACHER") {
      res.status(StatusCodes.UNAUTHORIZED).json({message: "You must be an admin or a teacher to create a teacher"})
      return
    }

    const salt = await bcrypt.genSalt(10);
    const incomingUser = req.body.user

    // Check if all parameters are filled
    if(!User.incomingCorrectlyFilled(incomingUser)) {
      res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
      return
    }

    // Check if user already exists
    if (await User.userExists(incomingUser.email, "email")) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is already used"})
      return
    }
    if (await User.userExists(incomingUser.username, "username")) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is already used"})
      return
    }

    // Create user
    var usr = {
      email: incomingUser.email,
      username: incomingUser.username,
      password: await bcrypt.hash(incomingUser.password, salt),
      emailVerified: false,
      role: "TEACHER"
    }
    const createdUser = await User.create(usr)
    res.status(StatusCodes.CREATED).json({createdUser, message: "User created"})
});

router.post('/login', async(req,res,next) => {
  const incomingUser = req.body.user
  
  if(!await User.userExists(incomingUser.email, "email") && !await User.userExists(incomingUser.username, "username")) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "User not found"})
    return
  }

  let user
  switch(true)  {
    case await User.userExists(incomingUser.email, "email") && incomingUser.password != null:
      user = await User.findOne({ where: { email: incomingUser.email } })
      break;
    case await User.userExists(incomingUser.username, "username") && incomingUser.password != null:
      user = await User.findOne({ where: { username: incomingUser.username } })
      break;
    default:
      res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid entry"})
      return
  }

  const validPassword = await bcrypt.compare(incomingUser.password, user.password)
  if (!validPassword) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid password"})
    return
  }

  // Create token
  const createdToken = await Token.generate(user.id)
  res.status(StatusCodes.OK).json({createdToken, message: "User logged in"})
});

router.put('/update', async(req,res,next) => {

  const incomingUser = req.body.user
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if (!await Token.tokenExists(incomingToken)) {
  if (!Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
  if(!Token.verify(incomingToken)){
    res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid token"})
    return
  }

  if(!User.incomingCorrectlyFilled(incomingUser) && incomingUser.role == null) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
    return
  }
  
  // If user related to token doesn't exists
  const token = await Token.findOne({ where: { token: incomingToken } })
  if (!await User.userExists(token.idUser, "id")) {
  if (!User.userExists(token.idUser, "id")) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "User not found"})
    return
  }  

  let updatedUser
  try{
    updatedUser = User.updateUser(incomingUser, token.idUser)
    console.log(updatedUser)
  }catch(err){
    res.status(StatusCodes.BAD_REQUEST).json({message: err.message})
    return
  }

  res.status(StatusCodes.OK).json({user: await updatedUser, message: "User updated"})
});
module.exports = router;