module.exports = (sequelize, DataTypes) => {

    const astro_availability = sequelize.define('astro_availability', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
          },
        astro_id: {
            type: DataTypes.INTEGER,
        },
        days: {
            type: DataTypes.STRING,
        },
        start_time: {
            type: DataTypes.STRING,
        },
        end_time: {
            type: DataTypes.STRING,
        },
        deleted_At: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    },

        {
            paranoid: true,
            timestamps: true,
            deletedAt: 'deleted_At'
        }

    );

    return astro_availability;
}