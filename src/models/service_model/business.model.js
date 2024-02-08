module.exports = (sequelize, DataTypes) => {

    const business = sequelize.define('business', {
        uni_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        BID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_main_phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        business_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_lat: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_lng: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_web_site: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        business_username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_owner: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_account_status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        business_bio: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        business_logo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_cover_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_country_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_main_activity_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_sub_activity_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        authentic_doc: {
            type: DataTypes.STRING,
            allowNull: true
        },
        doc_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        shelf_doc: {
            type: DataTypes.STRING,
            allowNull: true
        },
        business_creation_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        business_subscriptions_renew_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        business_exp_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        token_id: {
            type: DataTypes.STRING,
            allowNull: true
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
    
    return business;
    }