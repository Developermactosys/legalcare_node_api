// models/User.js
module.exports = (sequelize, DataTypes) => {
    const topic = sequelize.define('topic', {
    id: { 
        type: DataTypes.BIGINT,
        primaryKey: true, 
        autoIncrement: true
    },
    topic_name:{
      type:DataTypes.STRING,
      allowNull:true
    },
    activated:{
      type:DataTypes.BOOLEAN,
      allowNull:true
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
    
    return  topic;
    }