
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
      type_of_category: {
        type: DataTypes.ENUM,
        values: ["CS category", "Lawyer category", "CA category"],
        allowNull: true,
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