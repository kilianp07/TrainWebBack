const { Sequelize } = require('sequelize');
const crypto = require('crypto'); 
const sequelize = new Sequelize(
    "TrainWeb", 
    "sammy", 
    "password", 
    {dialect: "mysql", host: "127.0.0.1"});


sequelize.authenticate();   
console.log('Connecté à la base de données MySQL!');
createUser("caca@jeanjean.laura", "123456", "jeanjean");
getUsers();

function getUsers() {
    return sequelize.query("SELECT * FROM `Users`", { type: sequelize.QueryTypes.SELECT}).then((results) => {       
        console.log(results);     
    });
}

function createUser(email, password, username) {
    password = hashPassword(password);
    return sequelize.query("INSERT INTO `Users` (`email`, `password`, `username`) VALUES ('" + email + "', '" + password + "', '" + username + "');");
}

function hashPassword(password) { 
     
    // Creating a unique salt for a particular user 
       let salt = crypto.randomBytes(16).toString('hex'); 
     
    // Hashing user's salt and password with 1000 iterations, 
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`); 
    return hash;
}; 