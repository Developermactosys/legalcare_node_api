
module.exports = (sequelize, DataTypes) => {

const notification = sequelize.define("notification", {
  message: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
  title: DataTypes.STRING,
  type: DataTypes.STRING,
});
return notification;
}