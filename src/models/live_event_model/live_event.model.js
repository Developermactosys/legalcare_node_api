module.exports = (sequelize, DataTypes) => {
  const live_event = sequelize.define(
    "live_event",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      video_url: {
        type: DataTypes.STRING,
        //allowNull: false,
      },
      event_url: {
        type: DataTypes.STRING,
      },
      event_name: {
        type: DataTypes.STRING,
      },
      event_status: {
        type: DataTypes.ENUM,
        values: ["Active", "Inactive"],
        allowNull: false,
        defaultValue: "Active"
        //allowNull: false,
      },
      event_date: {
        type: DataTypes.STRING,
        //allowNull: false,
      },
      event_type: {
        type: DataTypes.STRING,
        //allowNull: false,
      },
      page_type: {
        type: DataTypes.STRING,
        //allowNull: false,
      },
      banner_image: {
        type: DataTypes.STRING,
        allowNull: false,
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
