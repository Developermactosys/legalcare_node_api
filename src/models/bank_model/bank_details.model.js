// models/BankDetails.js
module.exports = (sequelize, DataTypes) => {
    const bank_details = sequelize.define('bank_details', {
        id: {
            type: DataTypes.BIGINT,
             primaryKey: true,
            autoIncrement: true,
            allowNull : true
          },
        astro_id: {
            type: DataTypes.INTEGER,
        },
        pan_card_no: {

            type: DataTypes.INTEGER,

            type: DataTypes.STRING
        },
        aadhar_no: {
            type:DataTypes.STRING
        },
        acc_no: {
            type: DataTypes.STRING
        },
        acc_holder_name: {
            type:DataTypes.STRING
        },
        ifsc_code: {
            type:DataTypes.STRING
        },
        bank_name: {
            type:DataTypes.STRING
        },
        pan_doc: {
            type:DataTypes.STRING
        },
        aadhar_doc: {
            type:DataTypes.STRING
        },
        passbook_img: {
            type:DataTypes.STRING
        },
        certificate_of_practice: {
            type:DataTypes.STRING
        },
        certificate_of_membership:  {
            type:DataTypes.STRING
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
    }, {
        paranoid: true,
        timestamps: true,
        deletedAt: 'deleted_At'
    }
    );

    return bank_details;
};
