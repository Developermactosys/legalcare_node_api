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
db.admin_query = require("../src/models/query_model/admin_query.model")(sequelize, DataTypes);
db.business = require("../src/models/service_model/business.model")(sequelize, DataTypes);
db.service = require("../src/models/service_model/service.model")(sequelize, DataTypes);
// db.user_service = require("../src/models/service_model/user_service")(sequelize, DataTypes);
db.static_data = require("../src/models/static_model/static_data.model")(sequelize, DataTypes);
db.transaction_history = require("../src/models/wallet_model/trancation_histroy.model")(sequelize, DataTypes);
db.wallet_system = require("../src/models/wallet_model/walletSystem.model")(sequelize, DataTypes);
db.category = require("../src/models/category_model/category.model")(sequelize, DataTypes);
db.rating = require("../src/models/rating_model/rating.model")(sequelize, DataTypes);
db.booking_detail = require("../src/models/booking_model/booking.model")(sequelize, DataTypes);
db.subcategory = require("../src/models/category_model/subcategory.model")(sequelize,DataTypes);
db.client_testimonial= require("../src/models/testimonial_model/testimonial.model")(sequelize,DataTypes);
db.live_event = require("../src/models/live_event_model/live_event.model")(sequelize,DataTypes);
db.admin_query = require("../src/models/query_model/admin_query.model")(sequelize,DataTypes);
db.notification = require("../src/models/query_model/notification.model")(sequelize, DataTypes);
db.expert_review = require("../src/models/review_model/review.model")(sequelize,DataTypes);
db.chat_log = require("../src/models/chat_model/chat_log.model")(sequelize,DataTypes);
db.document =require("../src/models/document_model/document.model")(sequelize,DataTypes)
db.video = require("../src/models/video_model/video.model")(sequelize, DataTypes)
db.follower_count = require("../src/models/followers_model/follower.model")(sequelize, DataTypes);
db.expertservices = require('../src/models/expert_services_model/expert_services_model')(sequelize, DataTypes)
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

// User and Rating One to Many relationship
db.User.hasMany(db.rating,{
    forienKey : "UserId",
    as : "rating" 
})
db.rating.belongsTo(db.User,{
    forienKey : "UserId",
    as : "User" 
})

// Booking and services have One to Many relationship
db.service.hasMany(db.booking_detail,{
    forienKey : "serviceId",
    as : "booking_detail" 
})
db.booking_detail.belongsTo(db.service,{
    forienKey : "serviceId",
    as : "service" 
})

// category and subcategory relationship

db.category.hasMany(db.subcategory, {
    forienKey: "categoryId",
    as: "subcategory",
  });
  
  db.subcategory.belongsTo(db.category, {
    forienKey: "categoryId",
    as: "category",
  });

 // category and service have One to Many relationship

 db.category.hasMany(db.service,{
    forienKey : "categoryId",
    as : "service" 
})
db.service.belongsTo(db.category,{
    forienKey : "categoryId",
    as : "category" 
})

  // Booking and User have One to Many relationship
db.User.hasMany(db.booking_detail,{
    forienKey : "UserId",
    as : "booking_detail" 
})
db.booking_detail.belongsTo(db.User,{
    forienKey : "UserId",
    as : "User" 
})

// subcategory and service one to many relationship
db.subcategory.hasMany(db.service, {
    forienKey: "subcategoryId",
    as: "service",
  });
  
  db.service.belongsTo(db.subcategory, {
    forienKey: "subcategoryId",
    as: "subcategory",
  });

  // User and admin_query one to many relationship
db.User.hasMany(db.admin_query, {
    forienKey: "UserId",
    as: "admin_query",
  });
  
  db.admin_query.belongsTo(db.User, {
    forienKey: "UserId",
    as: "User",
  });

// User and expert_review one to many relationship
db.User.hasMany(db.expert_review, {
    forienKey: "UserId",
    as: "expert_review",
  });
  
  db.expert_review.belongsTo(db.User, {
    forienKey: "UserId",
    as: "User",
  });

// User and Service one to many relationship
db.User.hasMany(db.service, {
    forienKey: "UserId",
    as: "service",
  });
  
  db.service.belongsTo(db.User, {
    forienKey: "UserId",
    as: "User",
  });

// User and Document one to many relationship
db.User.hasMany(db.document, {
    forienKey : "UserId",
    as : "document"
})
db.document.belongsTo(db.User, {
    forienKey : "UserId",
    as : "User" 
})

// User and Video one to one relationship
db.User.hasMany(db.video, {
    forienKey : "UserId",
    as : "video"
})
db.video.belongsTo(db.User, {
    forienKey : "UserId",
    as : "User" 
})

  // User and notification one to many relationship
  db.User.hasMany(db.notification, {
    forienKey: "UserId",
    as: "notification",
  });
  
  db.notification.belongsTo(db.User, {
    forienKey: "UserId",
    as: "User",
  });

  // booking_detail and document one to many relationship
  db.booking_detail.hasMany(db.document, {
    forienKey : "UserId",
    as : "document"
})
db.document.belongsTo(db.booking_detail, {
    forienKey : "UserId",
    as : "booking_detail" 
})

//User and booking_detail one to many relationship
db.User.hasMany(db.bank_details, {
    forienKey: "UserId",
    as: "bank_details",
})
db.bank_details.belongsTo(db.User, {
    forienKey: "UserId",
    as: "User",
})



db.User.hasMany(db.category, {
    forienKey: "UserId",
    as: "category",
})
db.category.belongsTo(db.User, {
    forienKey: "UserId",
    as: "User",
})
// user and follower assosite
db.User.hasMany(db.follower_count, {
    forienKey: "UserId",
    as: "follower_count",
})
db.follower_count.belongsTo(db.User, {
    forienKey: "UserId",
    as: "User",
})

//User has One to Many relation with expert service table
db.User.hasMany(db.expertservices, {
    forienKey : "UserId",
    as : "expertservices"
})
db.expertservices.belongsTo(db.User, {
    forienKey : "UserId",
    as : "User" 
})

//Service has One to Many relation with expert service table
db.service.hasMany(db.expertservices, {
    forienKey : "serviceId",
    as : "expertservices"
})
db.expertservices.belongsTo(db.service, {
    forienKey : "serviceId",
    as : "service" 
})

module.exports = db;
