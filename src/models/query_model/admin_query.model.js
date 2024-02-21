module.exports = (sequelize, DataTypes) => {
    const admin_query = sequelize.define('admin_query', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
          type: {
            type: DataTypes.INTEGER
          },
          query: {
            type: DataTypes.STRING
          },
          date: {
            type: DataTypes.DATEONLY
          },
          time: {
            type: DataTypes.TIME
          },
          ticketId: {
            type: DataTypes.STRING
          },
         
          status: {
            type: DataTypes.INTEGER
          },
          query_type: {
            type: DataTypes.STRING
          },
          query_id: {
            type: DataTypes.INTEGER
          },
          response: {
            type: DataTypes.STRING
          },
          amount: {
            type: DataTypes.FLOAT
          },
          approve_amt: {
            type: DataTypes.FLOAT
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
    return admin_query;
  };
  