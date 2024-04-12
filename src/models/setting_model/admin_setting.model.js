
module.exports = (sequelize, DataTypes) => {
    const admin_setting = sequelize.define('admin_setting', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull :false
      },
      name: {
        type: DataTypes.STRING,
      },
      email : {
        type: DataTypes.STRING,
      },
      phone_no: {
        type: DataTypes.STRING,
      },
      city : {
        type: DataTypes.STRING,
      },
      user_name: {
        type: DataTypes.STRING,
      },
      password : {
        type: DataTypes.STRING,
      },
      api_key : {
        type: DataTypes.STRING,
      },
      payment_merchant_key : {
        type: DataTypes.STRING,
      }, 
      map_key : {
        type: DataTypes.STRING,
      }, 
      CA_api_key : {
        type: DataTypes.STRING,
      },
      CA_map_key : {
        type: DataTypes.STRING,
      },
      CA_api_user_id : {
        type: DataTypes.STRING,
      },
      CA_percentage : {
        type: DataTypes.STRING,
      },
      cancelation_charges :{
        type: DataTypes.STRING,
      },
      admin_for_call_video_percentage :{
        type: DataTypes.FLOAT,
        defaultValue:5.0,
      },
      admin_per_booking :{
        type: DataTypes.FLOAT,
        defaultValue:5.0,
      },
      agora_token :{
        type: DataTypes.STRING,
      },
      agora_merchant :{
        type: DataTypes.STRING,
      },
      deleted_At: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    
    }, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deleted_At'
    }
    )
    return admin_setting
}