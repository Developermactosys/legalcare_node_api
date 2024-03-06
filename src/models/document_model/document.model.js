module.exports = (sequelize, DataTypes) => {

    const documnetSchema = sequelize.define('document', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
          },
        certificate_of_membership: {
            type: DataTypes.STRING,
        },
        certificate_of_practice: {
            type: DataTypes.STRING,
        },
        pan_card_image: {
            type: DataTypes.STRING,
        },
        adhar_card_image: {
            type: DataTypes.STRING,
        },
        passbook_image: {
            type: DataTypes.STRING,
        },
        document: {
            type: DataTypes.STRING
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

    return documnetSchema;
}