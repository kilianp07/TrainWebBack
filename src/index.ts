const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    "TrainWeb", 
    "root", 
    "root", 
    {dialect: "mysql", host: "127.0.0.1"});


sequelize.authenticate();   
console.log('Connecté à la base de données MySQL!');
sequelize.query("SELECT * FROM `Users`", { type: sequelize.QueryTypes.SELECT}).then((results) => {       
    console.log(results);     
});

