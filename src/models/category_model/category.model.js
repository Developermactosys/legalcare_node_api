// models/User.js
module.exports = (sequelize, DataTypes) => {
    const category = sequelize.define('category', {
    id: { 
        type: DataTypes.BIGINT,
        primaryKey: true, 
        autoIncrement: true
    },
    category_name:{
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
    
    return  category;
    }