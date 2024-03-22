// models/chat.js
module.exports = (sequelize, DataTypes) => {
    const follower_count = sequelize.define('follower_count', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      expert_id: {
        type: DataTypes.INTEGER,
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
    return follower_count;
  };
  