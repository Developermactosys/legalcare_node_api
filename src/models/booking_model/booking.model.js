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
      cancellation_approved_amount :{
        type: DataTypes.FLOAT,
      },
      cancellation_demanding_Amount_by_customer:{
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
        values: ["pending", "approved", "reject","completed","cancel"],
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
booking_id: {
  type: DataTypes.STRING,
},
cancel_time: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
cancellation_approved_time: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
cancellation_accepted_time: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
cancellation_reason: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
cancellation_rejected_by_customer_time:{
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
reason_of_reject_cacellation_by_expert_side:{
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
reason_of_reject_cacellation_by_expert_side_time:{
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: null
},
is_cancel_status: {
  type: DataTypes.ENUM,
  values: ["cancellation_pending","cancellation_approved_by_expert","cancellation_reject","cancellation_accepted_by_customer" ],
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
    return booking_details;
  };
  