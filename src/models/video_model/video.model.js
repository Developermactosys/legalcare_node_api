// models/CallDetail.js
module.exports = (sequelize, DataTypes) => {
    const video_call_details = sequelize.define('video_call_details', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
      expert_id: {
        type: DataTypes.INTEGER,
      },
      senderName: {
        type: DataTypes.STRING,
      },
      receiverName: {
        type: DataTypes.STRING,
      },
      video_call_duration: {
        type: DataTypes.STRING,
      },
      current_used_bal: {
        type: DataTypes.FLOAT,
      },
      start_time: {
        type: DataTypes.STRING,
      },
      end_time: {
        type: DataTypes.STRING,
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
    return video_call_details;
  };
  