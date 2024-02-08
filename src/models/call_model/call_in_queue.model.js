// models/CallDetail.js
module.exports = (sequelize, DataTypes) => {
    const call_in_queue = sequelize.define('call_in_queue', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          astro_id: {
            type: DataTypes.INTEGER,
          },
          mobile_no: {
            type: DataTypes.STRING,
          },
          start_time: {
            type: DataTypes.DATE,
          },
          end_time: {
            type: DataTypes.DATE,
          },
          call_status: {
            type: DataTypes.STRING,
          },
          current_date: {
            type: DataTypes.DATEONLY,
          },
          status: {
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
    return call_in_queue;
  };
  