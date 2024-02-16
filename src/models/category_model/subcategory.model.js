module.exports = (sequelize, DataTypes) => {
    const subcategory = sequelize.define("subcategory",
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        subcategoryName: {
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        icon: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        color: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        subcategory_img: {
          type: DataTypes.STRING,
        },
        delete_At: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        paranoid: true,
        timestamps: true,
        deletedAt: "delete_At",
      }
    );
    return subcategory;
  };
  