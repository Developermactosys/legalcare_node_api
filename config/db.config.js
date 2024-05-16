require('dotenv').config()
const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    
})

try {
    sequelize.authenticate()
    console.log("Connection has been establised successfully with DataBase...!")
} catch (error) {
    console.error("Unable to connect to the database", error)
}

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({alter:true});

// Creating Table
db.user = require("../src/models/user_model/registration.model")(sequelize, DataTypes);

//User has One to Many relation with withdrawal_request table
// db.User.hasMany(db.withdrawal_request, {
//     forienKey : "UserId",
//     as : "withdrawal_request"
// })
// db.withdrawal_request.belongsTo(db.User, {
//     forienKey : "UserId",
//     as : "User" 
// })
module.exports = db;
