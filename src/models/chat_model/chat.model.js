// models/chat.js
module.exports = (sequelize, DataTypes) => {
    const chat = sequelize.define('chat', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
      from_user_id: {
        type: DataTypes.INTEGER,
      },
      to_user_id: {
        type: DataTypes.INTEGER,
      },
      request_id : {
        type: DataTypes.INTEGER,
      },
      chat_message: {
        type: DataTypes.STRING,
      },
      message_date: {
        type: DataTypes.DATEONLY,
      },
      message_time: {
        type: DataTypes.STRING,
      },
      message_status: {
        type: DataTypes.INTEGER, // Assuming status is an integer, you can adjust the type accordingly
        allowNull: true, // Modify as per your requirement
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      device_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      unread_msg: {
        type: DataTypes.BOOLEAN,
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
    return chat;
  };
  