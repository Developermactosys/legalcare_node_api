// models/User.js
module.exports = (sequelize, DataTypes) => {
    const acedemic_tutor = sequelize.define('acedemic_tutor', {
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
    email_id:{
      type:DataTypes.STRING,
      allowNull:true
    },
    phone_no:{
        type:DataTypes.STRING,
        allowNull:true
      },
    academic_tutor_image:{
        type:DataTypes.STRING,
    },
    brief_intro:{
        type:DataTypes.STRING,
    },     
    }, 
    );
    
    return  acedemic_tutor;
    }