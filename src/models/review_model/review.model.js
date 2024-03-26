
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
            validate: {
                isInt: {
                    msg: "Rating must be an integer", // Custom error message
                },
                min: {
                    args: [0],
                    msg: "Rating must be at least 0", // Custom error message
                },
                max: {
                    args: [5],
                    msg: "Rating must be no more than 5", // Custom error message
                },
            }
        },
        review: {
            type: DataTypes.TEXT,
        },
        reply: {
            type: DataTypes.STRING(255),
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
    