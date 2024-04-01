// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_type:{
     type:DataTypes.STRING,
     allowNull:false
  },
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  email_id: {
    type:DataTypes.STRING,
    allowNull:false
 },
  phone_no:{
    type: DataTypes.BIGINT,
    allowNull:false
  },
  dob: DataTypes.DATEONLY,
  birth_time: DataTypes.STRING,
  birth_place: DataTypes.STRING,
  otp_verified_at: DataTypes.DATE,
  password:{
    type:DataTypes.STRING,
    allowNull:false
 },
  remember_token: DataTypes.STRING,
  user_expertise:{
    type:DataTypes.STRING,
    },
  user_experience: DataTypes.TEXT,
  user_language: DataTypes.STRING,
  user_rating: DataTypes.FLOAT,
  user_about: DataTypes.TEXT,
  user_availability: DataTypes.STRING,
  user_education: DataTypes.TEXT,
  profile_image: DataTypes.STRING,
  image_url: DataTypes.STRING, // Ensure this is calculated or managed appropriately
  otp: DataTypes.STRING,
  otp_verify:{
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  amount: DataTypes.FLOAT,
  per_minute: DataTypes.FLOAT,
  blood_group: DataTypes.STRING,
  gender: DataTypes.STRING,
  country: DataTypes.STRING,
  city: DataTypes.STRING,
  zipcode: DataTypes.STRING,
  live_astrologer_preference: DataTypes.STRING,
  token: DataTypes.STRING,
  web_device_id: DataTypes.STRING,
  connection_id: DataTypes.STRING,
  device_id: DataTypes.STRING,
  is_login: DataTypes.BOOLEAN,
  is_busy: DataTypes.BOOLEAN,
  chat_active: DataTypes.BOOLEAN,
  call_active: DataTypes.BOOLEAN,
  recommend: DataTypes.STRING,
  wait_time: DataTypes.INTEGER,
  kundli_id: DataTypes.INTEGER,
  user_status: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM,
    values: [ "verified" , "rejected", "suspended" ],
    allowNull: false,
    defaultValue: "verified"
  }, 
  is_delete: DataTypes.BOOLEAN,
  free_redeem: DataTypes.INTEGER,
  free_time: DataTypes.INTEGER,
  dial_code: DataTypes.STRING,
  is_verify: DataTypes.BOOLEAN,
  login_from: DataTypes.STRING,
  customer_id: DataTypes.INTEGER,
  expert_id : DataTypes.INTEGER,
  device_token:DataTypes.STRING,
  follow_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category_of_expert: {
    type: DataTypes.JSON,
  },
  category_of_lawyer: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  type_of_lawyer: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  case_type: {
    type: DataTypes.STRING,
    defaultValue: null
  },
 work_type: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  type_account :{
    type:DataTypes.STRING,
    defaultValue:null
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