
module.exports = (sequelize, DataTypes) => {
const add_category = sequelize.define('add_category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false 

      },
      categoryName: {
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
        allowNull: true
      },
      category_img : {
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
    
    return add_category
  }