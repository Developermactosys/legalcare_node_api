
module.exports = (sequelize, DataTypes) => {
  const transaction_history = sequelize.define('transaction_history', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull : false
    },
    user_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
        request_amount: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        payment_status: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        transaction_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        approve_amount: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        request_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        approve_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        outstanding_amount: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        transaction_amount: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        currents_date: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        payment_method: {
          type: DataTypes.STRING,
        },
        device_id : {
          type: DataTypes.STRING,
        },
        amount_receiver_id : {
          type: DataTypes.INTEGER,
        },
        expert_id : {
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
  return transaction_history ;
  }