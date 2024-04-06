module.exports = (sequelize, DataTypes) => {
    const conatct_us = sequelize.define('contact_us', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull :false
      },
      email: {
        type: DataTypes.STRING,
    },
    whatapp_no: {
        type: DataTypes.BIGINT,
    },
    address : {
        type : DataTypes.STRING,
    },
    message : {
        type : DataTypes.STRING,
    },
    deleted_At: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    },
    {
        paranoid: true,
        timestamps: true,
        deletedAt: 'deleted_At'
    })
      return conatct_us
    }