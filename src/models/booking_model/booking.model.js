// models/Booking.js
module.exports = (sequelize, DataTypes) => {
    const booking_details = sequelize.define('booking_detail', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
      service_image: {
        type: DataTypes.STRING,
      },
      cosulting_fee: {
        type: DataTypes.FLOAT,
      },
      GST: {
        type: DataTypes.FLOAT,
      },
      service_tax: {
        type: DataTypes.FLOAT,
      },
      total_amount :{
        type: DataTypes.FLOAT,
      },
      discounted_amount :{
        type: DataTypes.FLOAT,
      },
      GST : {
        type : DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "approved", "reject","completed"],
        allowNull: false,
        defaultValue: "pending"
    },
    expert_id : {
      type : DataTypes.INTEGER,
    },
    payment_status: {
      type: DataTypes.ENUM,
      values: ["paid", "unpaid"],
      allowNull: false,
      defaultValue: "unpaid"
  },
  accepted_time: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
},
in_progress_time: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
completed_time: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
paid_time: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
rejected_time: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
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
    return booking_details;
  };
  