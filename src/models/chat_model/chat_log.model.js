// models/ChatRequest.js
module.exports = (sequelize, DataTypes) => {
    const chat_log= sequelize.define('chat_log', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
            
          },
          customer_id: {
            type: DataTypes.INTEGER,
          },
          export_id: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          start_time: {
            type: DataTypes.TIME,
            allowNull: true
          },
          type: {
            type: DataTypes.STRING,
            allowNull: true
          },
          start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
          },
          approve_time: {
            type: DataTypes.TIME,
            allowNull: true // Assuming this can be NULL
          },
          end_time: {
            type: DataTypes.TIME,
            allowNull: true // Assuming this can be NULL
          },
          comment: {
            type: DataTypes.TEXT,
            allowNull: true // Assuming this can be NULL
          },
          status: {
            type: DataTypes.STRING,
            allowNull: ture
          },
          duration: {
            type: DataTypes.INTEGER,
            allowNull: true // Assuming this can be NULL and represents duration in a specific unit like seconds
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

    return chat_log;
  };
  