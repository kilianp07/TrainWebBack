'use strict';
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RefreshToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.RefreshToken.belongsTo(models.User)
        }
    }
    RefreshToken.init({
        oldToken: DataTypes.STRING,
        newToken: DataTypes.STRING,
        expirationDate: DataTypes.DATE,
        idUser: DataTypes.INTEGER,
        isDeleted: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'RefreshToken'
    });

    RefreshToken.verify = async function(token) {
        var privateKey = fs.readFileSync(process.env.SECRET_KEY);
        try {
            const decoded = jwt.decode(token, {complete: true});
            if (!decoded || !decoded.payload || !decoded.payload.exp) {
                console.log("Invalid token");
                return false;
            }
            const expirationTime = decoded.payload.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime >= expirationTime) {
                console.log("RefreshToken expired");
                RefreshToken.findOne({ where: { token: token } }).then(token => {
                token.isDeleted = true;
                token.save();
                })
                return false;
            }
            // RefreshToken is valid and not expired
            jwt.verify(token, privateKey);
            return true;
        } catch (err) {
            return false;
        }
    }

    RefreshToken.refresh = async function(oldToken) {
        var privateKey = fs.readFileSync(process.env.SECRET_KEY);
        var token = {
            oldToken: oldToken,
            newToken: jwt.sign({id: Userid}, privateKey, {expiresIn: process.env.TOKEN_DURABILITY}),
            expirationDate: Date.now() + Number(process.env.REFRESH_TOKEN_DURABILITY),
            idUser: Userid,
            isDeleted: false
        }
        return await RefreshToken.create(token)
    }

    RefreshToken.refreshTokenExists = async function(oldToken) {
        return await RefreshToken.findOne({ where: { oldToken: oldToken } })
    }

    RefreshToken.deprecateToken = async function(oldToken) {
        RefreshToken.findOne({ where: { oldToken: oldToken } }).then(token => {
            token.isDeleted = true;
            token.save();
        })
    }

    return RefreshToken;
}