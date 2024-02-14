// models/ClientTestimonial.js

 module.exports = (sequelize, DataTypes) => {
    const client_testimonial = sequelize.define('client_testimonial', {
        // Define your ClientTestimonial model columns here
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        video_url: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        cover_img: {
            type: DataTypes.TEXT,
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
        deletedAt: 'deleted_At',
        tableName: 'client_testimonials' // Corrected table name
    });

    return client_testimonial;
};
