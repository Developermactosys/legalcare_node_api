// models/User.js
module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('user', {
  id: { 
    type: DataTypes.BIGINT,
    primaryKey: true, 
    autoIncrement: true
   },
  user_type:{
    type: DataTypes.ENUM,
    values: [ "student" , "teacher", "academy" ],
    allowNull: false,
    defaultValue: "student"
  }, 
  full_name:{
    type:DataTypes.STRING,
    allowNull:true
 },
 first_name:{
  type:DataTypes.STRING,
  allowNull:true
},
 last_name:{
  type:DataTypes.STRING,
  allowNull:true
},
 phone_no:{
  type: DataTypes.BIGINT,
  allowNull:false
},
  email_id: {
    type:DataTypes.STRING,
    allowNull:false
 },
  password:{
    type:DataTypes.STRING,
    allowNull:false
 },
 academy_name: {
  type:DataTypes.STRING,
},
address:{
  type:DataTypes.STRING,
},
wilaya: {
  type:DataTypes.STRING,
},
commune: {
  type:DataTypes.STRING,
},
zipcode: {
  type:DataTypes.STRING,
},
teach_on:{
  type:DataTypes.JSON
},
brief_intro: {
  type:DataTypes.STRING,
},
document_for_academy:{
  type:DataTypes.STRING,
},
document_for_tutor:{
  type:DataTypes.STRING,
},
profile_image:{
  type:DataTypes.STRING,
},
otp:{
  type:DataTypes.STRING,
},
otp_verify:{
  type: DataTypes.BOOLEAN,
  defaultValue: 0,
},
is_verify:{
  type: DataTypes.BOOLEAN,
  defaultValue:0
},
  status: {
    type: DataTypes.ENUM,
    values: [ "verified" , "rejected", "suspended" ],
    allowNull: false,
    defaultValue: "verified"
  }, 
  rating: {
    type:DataTypes.INTEGER,
  },
  login_from: DataTypes.STRING,
  device_token:DataTypes.STRING,
  follow_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  remember_token: {
    type:DataTypes.STRING,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
},
refreshToken_Expiration: {
    type: DataTypes.STRING,
    allowNull: true
},
  deleted_At: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
}
}, {
paranoid: true,
timestamps: true,
deletedAt: 'deleted_At'
}
);

return  User;
}