// models/User.js
module.exports = (sequelize, DataTypes) => {
    const relation_bw_tu_cat_sub_top = sequelize.define('relation_bw_tu_cat_sub_top', {
    id: { 
        type: DataTypes.BIGINT,
        primaryKey: true, 
        autoIncrement: true
    },
   
    }, 
    );
    
    return  relation_bw_tu_cat_sub_top;
    }