

module.exports = (sequelize, DataTypes) => {
    const service_image = sequelize.define('service_image', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },  
      service_image: {
            type: DataTypes.STRING,
            allowNull: true
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
    return service_image;
    }