// models/WalletSystem.js


module.exports = (sequelize, DataTypes) => {
    const withdrawal_request = sequelize.define('withdrawal_request', {
      // Define your WalletSystem model fields here
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
    
      request_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      approve_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    
      payment_status: {
        type: DataTypes.STRING,
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
      status: {
      type: DataTypes.ENUM,
      values: ["pending", "approved","reject"],
      allowNull: false,
      defaultValue: "pending"
      },
      currents_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      device_id : {
        type: DataTypes.STRING,
      },
      total_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      outstanding_amount: {
        type: DataTypes.FLOAT,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reject_description : {
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
    
    return withdrawal_request;
    }