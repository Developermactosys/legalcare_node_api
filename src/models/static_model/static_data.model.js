// models/chat.js
module.exports = (sequelize, DataTypes) => {
    const  static_data = sequelize.define('static_data', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },  
      keys: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          value: {
            type: DataTypes.STRING,
            allowNull: true,
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
  
    return  static_data;
  };
  