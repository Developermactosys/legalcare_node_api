
module.exports = (sequelize, DataTypes) => {
    const transaction_history = sequelize.define('transaction_history', {
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
          payment_status: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          transaction_id: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          wallet_amount: {
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
          payment_method: {
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
    return transaction_history ;
    }