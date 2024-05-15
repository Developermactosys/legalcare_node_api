
module.exports = (sequelize, DataTypes) => {
  const expertservice = sequelize.define('expertservice', {
    // id: {
    //   type: DataTypes.BIGINT,
    //   autoIncrement: true,
    //   primaryKey: true,
    //   allowNull :false
    // },
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
  return  expertservice ;
}


