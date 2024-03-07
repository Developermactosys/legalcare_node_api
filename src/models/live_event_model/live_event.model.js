module.exports = (sequelize, DataTypes) => {
  
  const live_event = sequelize.define("live_event", 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,

      },
      video_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      event_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      event_status: {
        type: DataTypes.ENUM, 
        values: ["Active", "Inactive"],
        allowNull: false,
        defaultValue: "Active", 
      },
      event_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      event_type: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      page_type: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      banner_image: {
        type: DataTypes.STRING,
      },
      // Add more columns if needed
    },
    {
      tableName: "live_events",
      paranoid: true,
      timestamps: true,
      deletedAt: "deletedAt",
    }
  );

  return live_event; 
};
