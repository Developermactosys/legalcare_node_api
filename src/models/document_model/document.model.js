module.exports = (sequelize, DataTypes) => {

    const documnetSchema = sequelize.define('document', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
        aadhar_card_image: {
            type: DataTypes.STRING,
        },
        passbook_image: {
            type: DataTypes.STRING,
        },
        sender_id: {
            type: DataTypes.INTEGER
        },
        receiver_id: {
            type: DataTypes.INTEGER
        },
        document: {
            type: DataTypes.STRING
        },
        expert_id: {
            type: DataTypes.INTEGER
        },
        is_aadhar_card_verify: {
            type: DataTypes.ENUM,
        values: ["pending", "approved", "reject"],
        defaultValue: "pending"
        },
        is_passbook_verify: {
            type: DataTypes.ENUM,
            values: ["pending", "approved", "reject"],
            defaultValue: "pending"
        },
        is_certificate_of_membership_verify: {
            type: DataTypes.ENUM,
            values: ["pending", "approved", "reject"],
            defaultValue: "pending"
        },
        is_certificate_of_practice_verify: {
            type: DataTypes.ENUM,
            values: ["pending", "approved", "reject"],
            defaultValue: "pending"
        },
        is_document_verify: {
            type: DataTypes.ENUM,
            values: ["pending", "approved", "reject"],
            defaultValue: "pending"
        },
        is_pan_card_image_verify: {
            type: DataTypes.ENUM,
            values: ["pending", "approved", "reject"],
            defaultValue: "pending"
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
