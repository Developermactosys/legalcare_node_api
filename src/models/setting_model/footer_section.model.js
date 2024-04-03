module.exports = (sequelize, DataTypes) => {
    const footer_section = sequelize.define('footer_section', {
      id: { 
        type: DataTypes.BIGINT, 
        primaryKey: true, 
        autoIncrement: true 
    },
    address:{
         type:DataTypes.STRING,
         allowNull:true
      },
      description: {
        type:DataTypes.STRING,
      
     },
     contact_no:{
        type: DataTypes.BIGINT,
        allowNull:true
      },
      services:{
        type : DataTypes.STRING,
      },
      deleted_At : {
        type : DataTypes.DATE,
        allowNull : true,
        defaultValue : null
      }
  }, {
      paranoid: true,
      timestamps: true,
      deletedAt: 'deleted_At'
  }
  );
    return  footer_section ;
  }