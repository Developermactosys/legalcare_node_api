

module.exports = (sequelize, DataTypes) => {
    const service = sequelize.define('service', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
          },
        english_name: {
            type: DataTypes.STRING,
          },
          category: {
            type: DataTypes.STRING,
          },
          service_description: {
            type: DataTypes.STRING,
          },
          service_main_image: {
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
    return  service ;
    }