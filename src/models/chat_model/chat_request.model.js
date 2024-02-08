// models/ChatRequest.js
module.exports = (sequelize, DataTypes) => {
    const chat_request = sequelize.define('chat_request', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        },
        from_user_id: {
            type: DataTypes.INTEGER
        },
        to_user_id: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING
        },
        request_date: {
            type: DataTypes.DATE
        },
        key: {
            type: DataTypes.STRING
        },
        msg: {
            type: DataTypes.STRING
        },
        notify: {
            type: DataTypes.INTEGER
        },
        notify_user: {
            type: DataTypes.INTEGER
        },
        approve_time: {
            type: DataTypes.DATE
        },
        valid_time: {
            type: DataTypes.DATE
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

    return chat_request;
  };
  