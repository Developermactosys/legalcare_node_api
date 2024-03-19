
module.exports = (sequelize, DataTypes) => {
const category = sequelize.define('category', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false 

      },
      category_name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
      category_image : {
        type : DataTypes.STRING,
      },
      delete_At : {
        type : DataTypes.DATE,
        allowNull : true,
        defaultValue : null
      }
     
    }, {
        paranoid : true,
        timestamps : true,
        deletedAt : 'delete_At'
   
    });
    
    return category
  }