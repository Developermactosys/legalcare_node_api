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
        },
        aadhar_no: DataTypes.STRING,
        acc_no: DataTypes.STRING,
        acc_holder_name: DataTypes.STRING,
        ifsc_code: DataTypes.STRING,
        bank_name: DataTypes.STRING,
        pan_doc: DataTypes.STRING,
        aadhar_doc: DataTypes.STRING,
        passbook_img: DataTypes.STRING,
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
