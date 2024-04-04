// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User_demo = sequelize.define('landing_user', {
      id: { 
        type: DataTypes.BIGINT, 
        primaryKey: true, 
        autoIncrement: true 
    },
    first_name:{
         type:DataTypes.STRING,
         allowNull:true
      },
      last_name:{
        type:DataTypes.STRING,
        allowNull:true
     },
      email_id: {
        type:DataTypes.STRING,
        allowNull:false
     },
      phone_no:{
        type: DataTypes.BIGINT,
        allowNull:true
      },
      password:{
        type:DataTypes.STRING,
        allowNull:true
     },
     otp : {
      type:DataTypes.STRING,
    },
    otp_verify : {
      type:DataTypes.STRING,
    },
      refreshToken: {
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
    
    return  User_demo;
    }