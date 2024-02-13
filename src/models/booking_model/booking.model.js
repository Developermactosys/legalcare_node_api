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
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "approved", "reject"],
        allowNull: false,
        defaultValue: "pending"
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
  