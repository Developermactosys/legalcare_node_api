
module.exports = (sequelize, DataTypes) => {
    const theme_setting = sequelize.define('theme_setting', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull :false
      },
      favicon_img: {
        type: DataTypes.STRING,
      },
      logo_img : {
        type: DataTypes.STRING,
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
    return  theme_setting ;
  }