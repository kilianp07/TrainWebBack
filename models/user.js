'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Token)
      models.User.hasMany(models.Logs)
      models.User.hasMany(models.FormUserProgress)
      models.User.hasMany(models.Exercice)
      models.User.hasMany(models.Answer)
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    emailVerified: DataTypes.BOOLEAN,
    role: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });

  User.userExists = async function(valueToTest, keyToTest) {
    let user
    switch (keyToTest) {
      case "email":
        user = await User.findOne({ where: {email: valueToTest }})
        break
      case "username":
        user = await User.findOne({where: {username: valueToTest }})
        break
      case "id":
        user = await User.findOne({where: {id: valueToTest }})
        break
      default:
        return
    }
    return user != null
  }

  User.incomingCorrectlyFilled = function(incomingUser) {
    return incomingUser.email != null && incomingUser.username != null && incomingUser.password != null
  }

  User.updateUser = async function(incomingUser, userId) {
    // If email is already used
    User.findAll({ where: { email: incomingUser.email } }).then(users => {
      if (users.length > 1) {
        throw new Error("Email is already used")
      }
    })

    // If username is already used
    User.findAll({ where: { username:incomingUser.username } }).then(users => {
      if (users.length > 1) {
        throw new Error("Username is already used")
      }
    })

    // Update the user
    const salt = await bcrypt.genSalt(10);
    var userToUpdate = await User.findOne({ where: { id: userId } })
    if (userToUpdate == null) {
      throw new Error("User not found")
    }
    userToUpdate.email = incomingUser.email
    userToUpdate.username = incomingUser.username
    userToUpdate.password = await bcrypt.hash(incomingUser.password, salt)
    userToUpdate.role = incomingUser.role
    userToUpdate.save()

    return userToUpdate
  }

  return User;
};

