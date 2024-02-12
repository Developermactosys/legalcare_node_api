require('dotenv').config()
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } = process.env
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
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

db.sequelize.sync();

// Creating Table
db.User = require("../src/models/user_model/userRegistration.model")(sequelize, DataTypes);
db.astro_availability =require("../src/models/astro_avalibility_model/astro_avalibility.model")(sequelize, DataTypes)
db.bank_details = require("../src/models/bank_model/bank_details.model")(sequelize, DataTypes);
db.call_details = require("../src/models/call_model/call_details.model")(sequelize, DataTypes);
db.call_in_queue = require("../src/models/call_model/call_in_queue.model")(sequelize, DataTypes);
db.chat = require("../src/models/chat_model/chat.model")(sequelize, DataTypes);
db.chat_history = require("../src/models/chat_model/chatHisroty.model")(sequelize, DataTypes);
db.chat_active_status = require("../src/models/chat_model/chat_active_status.model")(sequelize, DataTypes);
db.chat_request = require("../src/models/chat_model/chat_request.model")(sequelize, DataTypes);
db.feedback = require("../src/models/feedback_model/feedback.model")(sequelize, DataTypes);
db.waiting_join_list = require("../src/models/list_model/waitingList.model")(sequelize, DataTypes);
db.admin_query = require("../src/models/query_model/user_query.model")(sequelize, DataTypes);
db.business = require("../src/models/service_model/business.model")(sequelize, DataTypes);
db.service = require("../src/models/service_model/service.model")(sequelize, DataTypes);
db.service_image = require("../src/models/service_model/service_image.model")(sequelize, DataTypes);
db.static_data = require("../src/models/static_model/static_data.model")(sequelize, DataTypes);
db.transaction_history = require("../src/models/wallet_model/trancation_histroy.model")(sequelize, DataTypes);
db.wallet_system = require("../src/models/wallet_model/walletSystem.model")(sequelize, DataTypes);
db.add_category = require("../src/models/category_model/add_category.model")(sequelize, DataTypes);

//------Associations of tables--------//

//User has One to Many relation with chat_history
db.User.hasMany(db.chat_history, {
    forienKey : "UserId",
    as : "chat_history"
})
db.chat_history.belongsTo(db.User, {
    forienKey : "UserId",
    as : "User" 
})

//User has One to Many relation with call_details
db.User.hasMany(db.call_details, {
    forienKey : "UserId",
    as : "call_details"
})
db.call_details.belongsTo(db.User, {
    forienKey : "UserId",
    as : "User" 
})

//User has One to Many relation with waiting_join_list
db.User.hasMany(db.waiting_join_list, {
    forienKey : "UserId",
    as : "waiting_join_list"
})
db.waiting_join_list.belongsTo(db.User, {
    forienKey : "UserId",
    as : "User" 
})

//User and Wallet has One to One relationship
db.User.hasOne(db.wallet_system)
db.wallet_system.belongsTo(db.User)

//User and Transaction_details has One to Many relationship
db.User.hasMany(db.transaction_history, {
    forienKey : "UserId",
    as : "transaction_history"
})
db.transaction_history.belongsTo(db.User, {
    forienKey : "UserId",
    as : "User" 
})

//User and chat has One to Many relationship
db.User.hasMany(db.chat, {
    forienKey : "UserId",
    as : "chat"
})
db.chat.belongsTo(db.User, {
    forienKey : "UserId",
    as : "User" 
})

//User and chat_request One to Many relationship
db.User.hasMany(db.chat_request,{
    forienKey : "UserId",
    as : "chat_request" 
})
db.chat_request.belongsTo(db.User,{
    forienKey : "UserId",
    as : "User" 
})

// User and Astro Avalibility One to Many relationship
db.User.hasMany(db.astro_availability,{
    forienKey : "UserId",
    as : "astro_availability" 
})
db.astro_availability.belongsTo(db.User,{
    forienKey : "UserId",
    as : "User" 
})

module.exports = db;