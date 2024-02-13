
module.exports = (sequelize, DataTypes) => {
const rating = sequelize.define('rating', {
    rating : {
        type : DataTypes.INTEGER,
        min : 0,
        max : 5
    }
})

return rating

}
