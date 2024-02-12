const db = require("../../../config/db.config");
const category = db.add_category;

// API for create category
const createCategory = async(req, res)=>{
    const { id, categoryName, description, color, status, } = req.body;
    try {

        const filePath = req.file
      ? `/src/uploads/category_img/${req.file.filename}`
      : "/src/uploads/category_img/default.png";

        const addCategory = await category.create({
            categoryName,status,description,color, category_img : filePath, id
        })

        return res.status(200).json({
            success : true,
            message : "Category add successfully....",
            data : addCategory
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

module.exports = {
    createCategory
}
