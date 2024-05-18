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
db.category = require("../src/models/category_model/category.model")(sequelize, DataTypes);
db.subject = require("../src/models/subject_model/subject.model")(sequelize, DataTypes);
db.topic = require("../src/models/topic_model/topic.model")(sequelize, DataTypes);
db.acedemic_tutor = require("../src/models/academic_tutor_model/academic_tutor.model")(sequelize, DataTypes);
db.relation_bw_tu_cat_sub_top = require("../src/models/many_to_many_model/relations_of_tu_cat_sub_top.model")(sequelize, DataTypes);

//<=======================Assosiactions=======================>//

// //acedemic_tutor has One to Many relation with category table
// db.acedemic_tutor.hasMany(db.category, {
//     forienKey : "acedemictutorId",
//     as : "category"
// })
// db.category.belongsTo(db.acedemic_tutor, {
//     forienKey : "acedemictutorId",
//     as : "acedemic_tutor" 
// })

//category has One to Many relation with subject table
db.category.hasMany(db.subject, {
    forienKey : "categoryId",
    as : "subject"
})
db.subject.belongsTo(db.category, {
    forienKey : "categoryId",
    as : "category" 
})

//subject has One to Many relation with topic table
db.subject.hasMany(db.topic, {
    forienKey : "subjectId",
    as : "topic"
})
db.topic.belongsTo(db.subject, {
    forienKey : "subjectId",
    as : "subject" 
})


// Many to Many b/w relation_bw_cat_sub_top and category, subject, topic
db.category.hasMany(db.relation_bw_tu_cat_sub_top, {
    forienKey : "categoryId",
    as : "relation_bw_tu_cat_sub_top"
})
db.relation_bw_tu_cat_sub_top.belongsTo(db.category, {
    forienKey : "categoryId",
    as : "category" 
})

db.subject.hasMany(db.relation_bw_tu_cat_sub_top, {
    forienKey : "subjectId",
    as : "relation_bw_tu_cat_sub_top"
})
db.relation_bw_tu_cat_sub_top.belongsTo(db.subject, {
    forienKey : "subjectId",
    as : "subject" 
})

db.topic.hasMany(db.relation_bw_tu_cat_sub_top, {
    forienKey : "topicId",
    as : "relation_bw_tu_cat_sub_top"
})
db.relation_bw_tu_cat_sub_top.belongsTo(db.topic, {
    forienKey : "topicId",
    as : "topic" 
})

db.acedemic_tutor.hasMany(db.relation_bw_tu_cat_sub_top, {
    forienKey : "acedemicTutorId",
    as : "relation_bw_tu_cat_sub_top"
})
db.relation_bw_tu_cat_sub_top.belongsTo(db.acedemic_tutor, {
    forienKey : "acedemicTutorId",
    as : "acedemic_tutor" 
})

module.exports = db;
