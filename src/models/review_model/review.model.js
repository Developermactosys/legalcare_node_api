
module.exports = (sequelize, DataTypes) => {
    const expert_review = sequelize.define('expert_review', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        expert_id: {
            type: DataTypes.INTEGER,
        },
        rating: {
            type: DataTypes.INTEGER,
        },
        review: {
            type: DataTypes.TEXT,
        },
        rply: {
            type: DataTypes.STRING(11),
        },
        review_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        review_time: {
            type: DataTypes.STRING(255),
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
    })
    
    return expert_review
    
    }
    