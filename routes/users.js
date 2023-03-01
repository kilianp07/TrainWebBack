require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const bcrypt = require("bcrypt");
const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
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

router.get('/get', async(req,res,next) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if(!incomingToken){
    res.status(StatusCodes.BAD_REQUEST).json({message: "Missing token"})
    return
  }
  
  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
  
  // If user related to token doesn't exists
  const token = await Token.findOne({ where: { token: incomingToken } })
  if (!await User.userExists(token.idUser, "id")) {
    res.status(StatusCodes.NO_CONTENT).json({message: "User not found"})
    return
  }  

  let user
  try{
    user = User.findOne({ where: { id: token.idUser } })
  }catch(err){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    return
  }

  res.status(StatusCodes.OK).json({user, message: "User found"})
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
      res.status(StatusCodes.CONFLICT).json({ message: "Email is already used"})
      return
    }
    if (await User.userExists(incomingUser.username, "username")) {
      res.status(StatusCodes.CONFLICT).json({ message: "Username is already used"})
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
    res.status(StatusCodes.UNAUTHORIZED).json({message: "You must be connected"})
    return
  }

  if(!await Token.verifyToken(incomingToken)) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: "You must be connected"})
    return
  }
  
  let token = await Token.findOne({ where: { token: incomingToken } })
  if(!await User.userExists(token.idUser, "id")) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: "Unrecognized user"})
    return
  }

    const user = await User.findOne({ where: { id: token.idUser } })
    if(user.role != "ADMIN" || user.role != "TEACHER") {
      res.status(StatusCodes.FORBIDDEN).json({message: "You must be an admin or a teacher to create a teacher"})
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
      res.status(StatusCodes.CONFLICT).json({ message: "Email is already used"})
      return
    }
    if (await User.userExists(incomingUser.username, "username")) {
      res.status(StatusCodes.CONFLICT).json({ message: "Username is already used"})
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
  
  if(!await User.userExists(incomingUser.email, "email")) {
    res.status(StatusCodes.NO_CONTENT).json({message: "User not found"})
    return
  }

  let user
  try{
     user = await User.findOne({ where: { email: incomingUser.email } })
  }catch(err){
    res.status(StatusCodes.NO_CONTENT).json({message: err.message})
    return
  }
  
  // Check if password is correct
  const validPassword = await bcrypt.compare(incomingUser.password, user.password)
  if (!validPassword) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid password"})
    return
  }

  // Create token
  const createdToken = await Token.generate(user.id)
  res.status(StatusCodes.OK).json({createdToken, message: "User logged in"})
});

router.put('/update', async(req,res,next) => {

  const incomingUser = req.body.user
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if(!User.incomingCorrectlyFilled(incomingUser) && incomingUser.role == null) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
    return
  }

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
  
  // If user related to token doesn't exists
  const token = await Token.findOne({ where: { token: incomingToken } })
  if (!await User.userExists(token.idUser, "id")) {
    res.status(StatusCodes.NO_CONTENT).json({message: "User not found"})
    return
  }  

  let updatedUser
  try{
    updatedUser = User.updateUser(incomingUser, token.idUser)
  }catch(err){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    return
  }

  res.status(StatusCodes.OK).json({user: await updatedUser, message: "User updated"})
});

router.post('/logout', async(req,res,next) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if(!incomingToken){
    res.status(StatusCodes.BAD_REQUEST).json({message: "Missing token"})
    return
  }

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  try{
    await Token.deprecate(incomingToken)
  }catch(err){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    return
  }
  res.status(StatusCodes.OK).json({message: "User logged out"})
});
module.exports = router;