

module.exports = (sequelize, DataTypes) => {
const chat_history = sequelize.define('chat_history', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull : false
  },
      start_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     
      astro_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deduction_amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      astro_earning_amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_request: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
     
      chat_date: {
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
return chat_history;
}