

module.exports = (sequelize, DataTypes) => {
    const feedback = sequelize.define('feedback', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },  
        email: { type: DataTypes.STRING, allowNull: true },
        phone_no: { type: DataTypes.BIGINT },
        review: { type: DataTypes.STRING },
        rating: { type: DataTypes.INTEGER },
        date: { type: DataTypes.DATE },
        name: { type: DataTypes.STRING },
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
    return feedback;
    }