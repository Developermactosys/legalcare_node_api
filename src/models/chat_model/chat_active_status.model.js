// models/CallDetail.js
module.exports = (sequelize, DataTypes) => {
    const chat_active_status = sequelize.define('chat_active_status', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },  
      astro_id: {
            type: DataTypes.INTEGER,
          },
          mobile_no: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          start_time: {
            type: DataTypes.DATE,
          },
          end_time: {
            type: DataTypes.DATE,
          },
          chat_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
          },
          current_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
          },
          status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
    return chat_active_status;
  };
  