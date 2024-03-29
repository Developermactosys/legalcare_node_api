const db = require("../../../config/db.config")
const category = db.category;
const subCategory = db.subcategory;
const services = db.service;
const User = db.User;
const {Sequelize} = require('sequelize');
// API for add Services
const createServices = async(req, res)=>{
    const { categoryId, subCategoryId,serviceName, expert_id ,service_type ,expert_fees, service_cost} = req.body;
    // const { serviceName } = req.body
    try {
        const findCategory = await category.findByPk(categoryId)
        
        const findSubCategory = await subCategory.findByPk(subCategoryId)
        // if(!findCategory && !findSubCategory){
        //     return res.status(404).json({
        //         status : false,
        //         message : "Category or sub Category are not found"
        //     })
        // }
        
            const filePath = req.file
            ? `service_img/${req.file.filename}`
            : "/src/uploads/service_img/default.png";
            const addServices = await services.create({
            categoryId : categoryId,
            subcategoryId: subCategoryId,
            service_img : filePath,
            serviceName : serviceName,
            service_type:service_type,
            service_cost : service_cost,
            UserId :expert_id
            })
            await addServices.update(req.body)
            return res.status(200).json({
                status : true,
                message : "Service add succesfully",
                data : addServices
            })
        
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

// API for getAll Services
const getALlService = async(req, res) =>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const getServices = await services.findAll({
            include:[{
                model: category,
                as: "category",
              },
            {
                model:subCategory,
                as:"subcategory",
            },
            {
                model:User,
                as:"User",
                attributes:['id','user_type']
            }
        ],
        order: [["id", "DESC"]],
        limit: limit,
        offset: offset,
        })
        const totalCount = await services.count({});
        const totalPages = Math.ceil(totalCount / limit);
 

        if(getServices){
            return res.status(200).json({
                status : true,
                count:totalCount,
                message : " get all services",
                data : getServices,
                currentPage: page,
                totalPages: totalPages,
            })
        }else{
            return res.status(400).json({
                status : false,
                message : "services not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

// API for get service by Id
const getServiceById = async(req, res) => {
    const { serviceId } = req.query;
    try {
        const getServices = await services.findByPk(serviceId, {
            include:[{
                model: category,
                as: "category",
              },
            {
                model:subCategory,
                as:"subcategory",
            }]
        })
        if(getServices){
            return res.status(200).json({
                status : true,
                message : "Show service by Id",
                data : getServices
            })
        }else{
            return res.status(404).json({
                status : false,
                message : "service Id is not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    } 
}


// API for get service by expert_id(user side)
const getServiceBy_expertId = async(req, res) => {
    try {
        const { expert_id ,service_type} = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const getServices = await services.findAll({where :{
            UserId:expert_id,
            service_type :service_type,
        },
        include: [
            {
                model: User,
                as: "User",
            },
            {
                model: category,
                as: "category",
            },
            {
                model: subCategory,
                as: "subcategory",
            }
        ],
         limit: limit,
         offset: offset,
    })
    const totalCount = await services.count({});
    const totalPages = Math.ceil(totalCount / limit);

        if(getServices){
            return res.status(200).json({
                status : true,
                message : `Showing ${service_type} by expert_id`,
                data : getServices,
                totalServices: totalCount,
                currentPage: page,
                totalPages:totalPages,
            })
        }else{
            return res.status(404).json({
                status : false,
                message : "expert_id is not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    } 
}

// API for get sevices by expert_id for expert flow(expert side)

const getAllserviceBy_expert_id = async(req, res) => {
    try {
        const { expert_id } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const getServices = await services.findAll({where :{
            UserId:expert_id,
        },
        include:[{
            model: category,
            as: "category",
          },
        {
            model:subCategory,
            as:"subcategory",
        }],
         limit: limit,
         offset: offset,
    })
    const totalCount = await services.count({});
    const totalPages = Math.ceil(totalCount / limit);

        if(getServices){
            return res.status(200).json({
                status : true,
                message : `Showing services by expert_id`,
                data : getServices,
                totalServices: totalCount,
                currentPage: page,
                totalPages:totalPages,
            })
        }else{
            return res.status(404).json({
                status : false,
                message : "expert_id is not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    } 
}

const updateService = async (req, res) => {
    const {
      categoryId,
      subCategoryId,
      serviceName,
      expert_id,
      service_type,
      expert_fees,
      service_cost,
      status,
      description
    } = req.body;
    let id = req.params.id;
    try {
      const findCategory = await category.findByPk(categoryId);
  
      const findSubCategory = await subCategory.findByPk(subCategoryId);
    //   if(!findCategory && !findSubCategory){
    //       return res.status(404).json({
    //           status : false,
    //           message : "Category or sub Category are not found"
    //       })
    //   }
  
      const filePath = req.file
        ? `service_img/${req.file.filename}`
        : "/src/uploads/service_img/default.png";
      const updateData = await services.update({
        categoryId: categoryId,
        subcategoryId: subCategoryId,
        service_img: filePath,
        serviceName: serviceName,
        service_type: service_type,
        expert_fees: expert_fees,
        service_cost:service_cost,
        status:status,
        description:description,
        UserId: expert_id,

    },{
      where : {
          id : id
      }
    });
      if(updateData){
          return res.status(200).json({
              status : true,
              message : "Service updated successfully",
              data : updateData
          })
      }else{
          return req.status(200).json({
              status : false,
              message : "service not updated"
          })
      }
    } catch (error) {
      return res.status(500).json({
          status :false,
          message : error.message
      })
    }
  };


// API for delete Services
const deleteService = async(req, res) => {
    const { serviceId } = req.params;
    try {
        const delServices = await services.findByPk(serviceId)
        if(delServices){
       await delServices.destroy(delServices)
        return res.status(200).json({
            status : true,
            message : "Data delete successfully"
        })
    }else{
        return res.status(400).json({
            status : false,
            message : "service Id not found or services not deleted"
        })
    }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}


module.exports = {
    createServices,
    getALlService,
    getServiceById,
    deleteService,
    getServiceBy_expertId,
    getAllserviceBy_expert_id,
    updateService
}