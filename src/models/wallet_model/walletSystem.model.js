// models/WalletSystem.js


module.exports = (sequelize, DataTypes) => {
const wallet_system = sequelize.define('wallet_system', {
  // Define your WalletSystem model fields here
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull : false
  },

  request_amount: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trancation_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  wallet_amount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue:0
  },
  approve_amount: {
    type: DataTypes.FLOAT,
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
    defaultValue:0
  },
  total_amount: {
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
  device_id : {
    type: DataTypes.STRING,
  },
  description : {
    type: DataTypes.STRING,
  },
  // totalAdminEarnings : {
  //   type: DataTypes.FLOAT,
  // },
  // totalLawyerEarnings : {
  //   type: DataTypes.FLOAT,
  // },
  // totalCAEarnings : {
  //   type: DataTypes.FLOAT,
  // },
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

return wallet_system;
}