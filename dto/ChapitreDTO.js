const { Sequelize, Model, DataTypes, TimeoutError } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
  {
  dialect: 'mysql'
  }
)
const Exercice = require('../models/exercice')(sequelize, Sequelize.DataTypes,Sequelize.Model);

class ChapitreDTO{
    id;
    name;
    idFormation;
    isDeleted;
    exercices;

    constructor(Chapitre){
        this.id = Chapitre.id;
        this.name = Chapitre.name;
        this.idFormation = Chapitre.idFormation;
        this.isDeleted = Chapitre.isDeleted;
        this.exercices = [];
        Exercice.findAll({where: {idChapitre : this.id, isDeleted : false}}).then(exercices => {
            this.exercices.push(exercices);
        });
    }
}