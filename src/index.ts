const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    "TrainWeb", 
    "root", 
    "root", 
    {dialect: "mysql", host: "127.0.0.1"});


sequelize.authenticate();   
console.log('Connecté à la base de données MySQL!');
createUser();
getUsers();

function getUsers() {
    return sequelize.query("SELECT * FROM `Users`", { type: sequelize.QueryTypes.SELECT}).then((results) => {       
        console.log(results);     
    });
}

function createUser() {
    return sequelize.query("INSERT INTO `Users` (`id`, `email`, `password`, `username`) VALUES (NULL, 'kylian.peyron@ynov.com', 'Kylian_pyrn0912', 'Kylian Peyron');");
}