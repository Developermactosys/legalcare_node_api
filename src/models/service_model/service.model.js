const { service } = require("../../../config/db.config");


module.exports = (sequelize, DataTypes) => {
  const service = sequelize.define('service', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull :false
    },
    serviceName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue : true  
    },
    service_img : {
      type : DataTypes.STRING,
    },
    service_cost : {
      type : DataTypes.FLOAT
    },
    service_type: {
      type: DataTypes.ENUM,
      values: ["Top Services", "Other Services"],
      allowNull: false,
      defaultValue: "Top Services"
  },
  ca_fees :{
    type : DataTypes.FLOAT
  },
  GST :{
    type : DataTypes.FLOAT
  },
    deleted_At : {
      type : DataTypes.DATE,
      allowNull : true,
      defaultValue : null
    }
}, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deleted_At'
}
);
  return  service ;
}


