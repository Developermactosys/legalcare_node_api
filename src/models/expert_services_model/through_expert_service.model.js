
module.exports = (sequelize, DataTypes) => {
    const expert_service = sequelize.define('expert_service', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull :false
      },
      status: {
        type: DataTypes.ENUM,
        values: ['pending', 'approved', 'reject'],
        allowNull: true,
        defaultValue : 'pending'  
      },
      service_type: {
        type: DataTypes.ENUM,
        values: ["Top Services", "Other Services"],
        allowNull: false,
        defaultValue: "Other Services"
    },
    expert_fees :{
      type : DataTypes.FLOAT
    },
    GST :{
      type : DataTypes.FLOAT
    },
    expert_service_active: {
      type:DataTypes.BOOLEAN,
      defaultValue:true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    return  expert_service ;
  }
  
  
  