const db = require("../../../config/db.config")
const category = db.category;
const subCategory = db.subcategory;
const services = db.service;

// API for add Services
const createServices = async(req, res)=>{
    const { categoryId, subCategoryId,serviceName  } = req.body;
    // const { serviceName } = req.body
    try {
        const findCategory = await category.findByPk(categoryId)
        
        const findSubCategory = await subCategory.findByPk(subCategoryId)
        // if(!findCategory && !findSubCategory){
        //     return res.status(404).json({
        //         success : false,
        //         message : "Category or sub Category are not found"
        //     })
        // }
        
            const filePath = req.file
            ? `/src/uploads/service_img/${req.file.filename}`
            : "/src/uploads/service_img/default.png";
            const addServices = await services.create({
            categoryId : categoryId,
            subcategoryId: subCategoryId,
            service_img : filePath,
            serviceName
            })
            await addServices.update(req.body)
            return res.status(200).json({
                success : true,
                message : "Service add succesfully",
                data : addServices
            })
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// API for getAll Services
const getALlService = async(req, res) =>{
    try {
        const getServices = await services.findAll()
        if(getServices){
            return res.status(200).json({
                success : true,
                message : " get all services",
                data : getServices
            })
        }else{
            return res.status(400).json({
                success : false,
                message : "services not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// API for get service by Id
const getServiceById = async(req, res) => {
    const { serviceId } = req.params;
    try {
        const getServices = await services.findByPk(serviceId)
        if(getServices){
            return res.status(200).json({
                success : true,
                message : "Show service by Id",
                data : getServices
            })
        }else{
            return res.status(404).json({
                success : false,
                message : "service Id is not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    } 
}

// API for delete Services
const deleteService = async(req, res) => {
    const { serviceId } = req.params;
    try {
        const delServices = await services.findByPk(serviceId)
        if(delServices){
       await delServices.destroy(delServices)
        return res.status(200).json({
            success : true,
            message : "Data delete successfully"
        })
    }else{
        return res.status(400).json({
            success : false,
            message : "service Id not found or services not deleted"
        })
    }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}
module.exports = {
    createServices,
    getALlService,
    getServiceById,
    deleteService
}