// const db = require("../../config/connection");
// const User = db.User;

module.exports = (sequelize, DataTypes) => {
  const waiting_join_list = sequelize.define('waiting_join_list', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull : false
    },
    astro_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  
    join_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    waiting_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'chat',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    request_date: {
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
  return waiting_join_list;
};
