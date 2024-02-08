// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');


module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_type: DataTypes.STRING,
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  email_id: DataTypes.STRING,
  phone_no: DataTypes.BIGINT,
  dob: DataTypes.DATEONLY,
  birth_time: DataTypes.STRING,
  birth_place: DataTypes.STRING,
  otp_verified_at: DataTypes.DATE,
  password: DataTypes.STRING,
  remember_token: DataTypes.STRING,
  user_expertise: DataTypes.TEXT,
  user_experience: DataTypes.TEXT,
  user_language: DataTypes.STRING,
  user_rating: DataTypes.FLOAT,
  user_about: DataTypes.TEXT,
  user_availability: DataTypes.STRING,
  user_education: DataTypes.TEXT,
  profile_image: DataTypes.STRING,
  image_url: DataTypes.STRING, // Ensure this is calculated or managed appropriately
  otp: DataTypes.STRING,
  otp_verify: DataTypes.BOOLEAN,
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
  recommend: DataTypes.BOOLEAN,
  wait_time: DataTypes.INTEGER,
  kundli_id: DataTypes.INTEGER,
  user_status: DataTypes.STRING,
  status: DataTypes.BOOLEAN,
  is_delete: DataTypes.BOOLEAN,
  free_redeem: DataTypes.INTEGER,
  free_time: DataTypes.INTEGER,
  dial_code: DataTypes.STRING,
  is_verify: DataTypes.BOOLEAN,
  login_from: DataTypes.STRING,
  device_token:DataTypes.STRING,
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