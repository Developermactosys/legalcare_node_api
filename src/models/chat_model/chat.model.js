// models/chat.js
module.exports = (sequelize, DataTypes) => {
    const chat = sequelize.define('chat', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
      sender_id: {
        type: DataTypes.INTEGER,
      },
      receiver_id: {
        type: DataTypes.INTEGER,
      },
      request_id : {
        type: DataTypes.INTEGER,
      },
      message: {
        type: DataTypes.STRING,
      },
      sent_date: {
        type: DataTypes.DATEONLY,
      },
      sent_time: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.INTEGER, // Assuming status is an integer, you can adjust the type accordingly
        allowNull: true, // Modify as per your requirement
      },
      img_url: {
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
  