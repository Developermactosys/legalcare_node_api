// models/CallDetail.js
module.exports = (sequelize, DataTypes) => {
    const call_details = sequelize.define('call_details', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
      astro_id: {
        type: DataTypes.INTEGER,
      },
      to_number: {
        type: DataTypes.STRING,
      },
      from_number: {
        type: DataTypes.STRING,
      },
      call_data: {
        type: DataTypes.TEXT,
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
    return call_details;
  };
  