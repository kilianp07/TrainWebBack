require('dotenv').config()
var express = require('express');
const StatusCodes = require('http-status-codes');
const checkToken = require('../middleware/checkJWT')
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  {
  dialect: 'mysql'
  }
)
const User = require('../models/user')(sequelize, Sequelize.DataTypes,Sequelize.Model);
const Role = require('../models/role')(sequelize, Sequelize.DataTypes,Sequelize.Model);
const Token = require('../models/token')(sequelize, Sequelize.DataTypes,Sequelize.Model);


var router = express.Router();
sequelize.authenticate()


router.get('/get', checkToken, async(req,res) => {
  const incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  // If user related to token doesn't exists
  const token = await Token.findOne({ where: { token: incomingToken } })
  if (!await User.userExists(token.idUser, "id")) {
    res.status(StatusCodes.StatusCodes.NO_CONTENT).json({message: "User not found"})
    return
  }  

  let user
  try{
    user = await User.findOne({ where: { id: token.idUser } })
  }catch(err){
    res.status(StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    return
  }

  res.status(StatusCodes.StatusCodes.OK).json({user, message: "User found"})
});


router.post('/student/create', async(req,res) => {
   const salt = await bcrypt.genSalt(10);
   const incomingUser = req.body.user

   // Check if all parameters are filled
   if (!User.incomingCorrectlyFilled(incomingUser)) {
      res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
      return
    }
  
    // Check if user already exists
    if (await User.userExists(incomingUser.email, "email")) {
      res.status(StatusCodes.StatusCodes.CONFLICT).json({ message: "Email is already used"})
      return
    }
    if (await User.userExists(incomingUser.username, "username")) {
      res.status(StatusCodes.StatusCodes.CONFLICT).json({ message: "Username is already used"})
      return
    }
  
    const studentRole = await Role.findOne({ where: { value: "STUDENT" } })
    // Create user
    var usr = {
      email: incomingUser.email,
      username: incomingUser.username,
      password: await bcrypt.hash(incomingUser.password, salt),
      emailVerified: false,
      idRole: studentRole.id
    }
    const createdUser = await User.create(usr)
    res.status(StatusCodes.StatusCodes.CREATED).json({createdUser, message: "User created"})
});

router.post('/teacher/create', async(req,res) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if(!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.StatusCodes.UNAUTHORIZED).json({message: "You must be connected"})
    return
  }

  if(!await Token.verify(incomingToken)) {
    res.status(StatusCodes.StatusCodes.UNAUTHORIZED).json({message: "You must be connected"})
    return
  }
  
  let token = await Token.findOne({ where: { token: incomingToken } })
  if(!await User.userExists(token.idUser, "id")) {
    res.status(StatusCodes.StatusCodes.UNAUTHORIZED).json({message: "Unrecognized user"})
    return
  }

    const user = await User.findOne({ where: { id: token.idUser } })
    
    const teacherRole = await Role.findOne({ where: { value: "TEACHER" } })
    const adminRole = await Role.findOne({ where: { value: "ADMIN" } })

    if(user.idRole != adminRole.id || user.idRole != teacherRole.id) {
      res.status(StatusCodes.StatusCodes.FORBIDDEN).json({message: "You must be an admin or a teacher to create a teacher"})
      return
    }

    const salt = await bcrypt.genSalt(10);
    const incomingUser = req.body.user

    // Check if all parameters are filled
    if(!User.incomingCorrectlyFilled(incomingUser)) {
      res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
      return
    }

    // Check if user already exists
    if (await User.userExists(incomingUser.email, "email")) {
      res.status(StatusCodes.StatusCodes.CONFLICT).json({ message: "Email is already used"})
      return
    }
    if (await User.userExists(incomingUser.username, "username")) {
      res.status(StatusCodes.StatusCodes.CONFLICT).json({ message: "Username is already used"})
      return
    }

    // Create user
    var usr = {
      email: incomingUser.email,
      username: incomingUser.username,
      password: await bcrypt.hash(incomingUser.password, salt),
      emailVerified: false,
      idRole: teacherRole.id
    }
    const createdUser = await User.create(usr)
    res.status(StatusCodes.StatusCodes.CREATED).json({createdUser, message: "User created"})
});

router.post('/login', async(req,res) => {
  const incomingUser = req.body.user
  
  if(!await User.userExists(incomingUser.email, "email")) {
    res.status(StatusCodes.StatusCodes.NO_CONTENT).json({message: "User not found"})
    return
  }

  let user
  try{
    user = await User.findOne({ where: { email: incomingUser.email } })
  }catch(err){
    res.status(StatusCodes.StatusCodes.NO_CONTENT).json({message: err.message})
    return
  }
  
  // Check if password is correct
  const validPassword = await bcrypt.compare(incomingUser.password, user.password)
  if (!validPassword) {
    res.status(StatusCodes.StatusCodes.UNAUTHORIZED).json({message: "Invalid password"})
    return
  }

  // Create token
  const createdToken = await Token.generate(user.id)
  res.status(StatusCodes.StatusCodes.OK).json({createdToken, message: "User logged in"})
});

router.put('/update', checkToken, async(req,res) => {

  const incomingUser = req.body.user
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  if(!User.incomingCorrectlyFilled(incomingUser) && incomingUser.role == null) {
    res.status(StatusCodes.StatusCodes.BAD_REQUEST).json({message: "Missing parameters"})
    return
  }

  if (!await Token.tokenExists(incomingToken)) {
    res.status(StatusCodes.StatusCodes.NO_CONTENT).json({message: "Token not found"})
    return
  }

  if(!await Token.verify(incomingToken)){
    res.status(StatusCodes.StatusCodes.FORBIDDEN).json({message: "Invalid token"})
    return
  }
  
  // If user related to token doesn't exists
  const token = await Token.findOne({ where: { token: incomingToken } })
  if (!await User.userExists(token.idUser, "id")) {
    res.status(StatusCodes.StatusCodes.NO_CONTENT).json({message: "User not found"})
    return
  }  

  let updatedUser
  try{
    updatedUser = User.updateUser(incomingUser, token.idUser)
  }catch(err){
    res.status(StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    return
  }

  res.status(StatusCodes.StatusCodes.OK).json({user: await updatedUser, message: "User updated"})
});

router.post('/logout', checkToken, async(req,res) => {
  incomingToken = req.headers["authorization"]&& req.headers["authorization"].split(' ')[1]

  try{
    await Token.deprecate(incomingToken)
  }catch(err){
    res.status(StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message})
    return
  }
  res.status(StatusCodes.StatusCodes.OK).json({message: "User logged out"})
});
module.exports = router;
