const db = require('../../../config/db.config')
const User = db.User;
const expert_service = db.expert_service;
const service = db.service;
const category = db.category;
const subcategory = db.subcategory;

// API for create expert_services
exports.addExpertService = async(req, res) =>{
    const { status, service_type, expert_fees, GST , user_id, service_id ,description} = req.body;
    
    try {

        if(!user_id && !service_id){
            return res.status(200).json({
                status : false,
                message : "user_id and service_id not found "
            })
        }

        const find_expert_service = await expert_service.findOne({
            where:{UserId : user_id , serviceId:service_id}
        })

        if(find_expert_service){
            return res.status(200).json({status:false, message:"expert service already exist"})
        }
        const createExpert = await expert_service.create({
             GST:GST, 
             expert_fees:expert_fees, 
             UserId : user_id, 
             serviceId : service_id ,
             description:description,
             service_type:service_type
        })
        if(createExpert){
            return res.status(200).json({
                status : true,
                message : "expert service is created successfully",
                data : createExpert
            })
        }
        else{
            return res.status(200).json({
                status : false,
                message : "Expert service is not created "
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message 
        })
    }
}

// API for get all expert service
exports.getAllExpertService = async(req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit
        const getAllData = await expert_service.findAll({
            where:{expert_service_active: true },
            include:[
                {
                model: service,
                as: "service",
                // attributes: ['id', 'serviceName','service_img','description','status']
            },
        //     {
        //     model: User,
        //     as: "User",
        //     attributes:['id','user_type','name', 'profile_image']
        //    }
    ],
        order: [["id", "DESC"]],
        limit: limit,
        offset: offset,
        })
        const totalCount = await expert_service.count({});
        const totalPages = Math.ceil(totalCount / limit);
        if(getAllData){
            return res.status(200).json({
                status : true,
                message: " Expert service reterived successfully",
                data : getAllData,
                total_Expert_Services: totalCount,
                currentPage: page,
                totalPages:totalPages,
            })
        }
        else{
            return res.status(200).json({
                status : false,
                message : "expert sevices not found "
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}


// // API for get expert service by Id
// exports.getAllExpertServiceById = async(req, res) => {
//     const { id } = req.params;
//     try {
//         const getAllData = await expert_service.findByPk(id, {
//             include:[{
//                 model: service,
//                 as: "service",
//                 attributes: ['id', 'serviceName','service_img']
//             },
//             {
//             model: User,
//             as: "User",
//             attributes:['id', 'name', 'profile_image']
//         }]
//         })
//         if(getAllData){
//             return res.status(200).json({
//                 status : true,
//                 message: "Get expert service",
//                 data : getAllData
//             })
//         }
//         else{
//             return res.status(200).json({
//                 status : false,
//                 message : "expert sevices not found "
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     }
// }

// // API for update expert service by ID
// exports.updateExpertServiceById = async(req, res) => {
//     const { id } = req.params;
//     const {status, service_type, expert_fees, GST} = req.body
//     try {
//         const getAllData = await expert_service.findByPk(id)

//             if(getAllData){
//                 const updateData = await getAllData.update(
//                    req.body
//                 )
//             return res.status(200).json({
//                 status : true,
//                 message: "Expert service updated successfully",
//                 data : updateData
//             })
//         }
//         else{
//             return res.status(200).json({
//                 status : false,
//                 message : "expert sevices not found "
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     }
// }

// // API for delete expert service by Id
// exports.delExpertServiceById = async(req, res) => {
//     const { id } = req.params;
  
//     try {
//         const getAllData = await expert_service.findByPk(id)

//             if(getAllData){
//                 const updateData = await getAllData.destroy()
//             return res.status(200).json({
//                 status : true,
//                 message: "Expert service has been deleted successfully",
//             })
//         }
//         else{
//             return res.status(400).json({
//                 status : false,
//                 message : "expert sevices not found "
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     }
// }


// // API for get expert service by category_id
// exports.get_expertServiceBy_category_id = async(req, res) => {
//     const { category_id } = req.params;
//     try {
//         const getAllData = await expert_service.findAll({
//              where: { categoryId: category_id },
//             include:[{
//                 model: service,
//                 as: "service",
//                 attributes: ['id', 'serviceName','service_img','description','service_cost','service_type']
//             },
//             {
//             model: User,
//             as: "User",
//             attributes:['id', 'name', 'profile_image']
//         }]
//      })
//         if(getAllData){
//             return res.status(200).json({
//                 status : true,
//                 message: "Get expert service",
//                 data : getAllData
//             })
//         }
//         else{
//             return res.status(200).json({
//                 status : false,
//                 message : "expert sevices not found "
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     }
// }

// // API for get expert service by subcategory_id
// exports.get_expertServiceBy_subcategory_id = async(req, res) => {
//     const { subcategory_id } = req.params;
//     try {
//         const getAllData = await expert_service.findAll({
//              where: { subcategoryId: subcategory_id },
//             include:[{
//                 model: service,
//                 as: "service",
//                 attributes: ['id', 'serviceName','service_img','description','service_cost','service_type']
//             },
//             {
//             model: User,
//             as: "User",
//             attributes:['id', 'name', 'profile_image']
//         }]
//      })
//         if(getAllData){
//             return res.status(200).json({
//                 status : true,
//                 message: "Get expert service",
//                 data : getAllData
//             })
//         }
//         else{
//             return res.status(200).json({
//                 status : false,
//                 message : "expert sevices not found "
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     }
// }

// // API for get expert service by service_id
// exports.get_expertServiceBy_service_id = async(req, res) => {
//     const { service_id } = req.params;
//     try {
//         const getAllData = await expert_service.findAll({
//              where: { serviceId: service_id },
//             include:[{
//                 model: service,
//                 as: "service",
//                 attributes: ['id', 'serviceName','service_img','description','service_cost','service_type']
//             },
//             {
//             model: User,
//             as: "User",
//             attributes:['id', 'name', 'profile_image']
//         }]
//      })
//         if(getAllData){
//             return res.status(200).json({
//                 status : true,
//                 message: "Get expert service",
//                 data : getAllData
//             })
//         }
//         else{
//             return res.status(200).json({
//                 status : false,
//                 message : "expert sevices not found "
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     }
// }

// API for get expert service by expert_id
exports.get_expertServiceBy_expert_id = async(req, res) => {
    const { expert_id } = req.query;
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit

        const getAllData = await expert_service.findAll({
             where: { UserId: expert_id },
            include:[
                // {
                //     model: User,
                //     as: "User",
                //     attributes:['id', 'name', 'profile_image']
                // },
                {
                model: service,
                as: "service",
                attributes: ['id', 'serviceName','service_img','description','service_cost','service_type']
            }
         ],
         order: [["id", "DESC"]],
         limit: limit,
         offset: offset,
     })

     const totalCount = await expert_service.count({where: { UserId: expert_id }});
     const totalPages = Math.ceil(totalCount / limit);
     
        if(getAllData){
            return res.status(200).json({
                status : true,
                message: "All expert services reterived successfully",
                data : getAllData,
                total_Expert_Services: totalCount,
                currentPage: page,
                totalPages:totalPages,
            })
        }
        else{
            return res.status(200).json({
                status : false,
                message : "expert sevices not found "
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}


exports.update_expert_service_for_active = async (req, res) => {
    const {service_id,expert_id}= req.query;
    try {
  
      const Service = await expert_service.findOne({
        where:{ serviceId:service_id,UserId:expert_id},
    });
  
      if (!Service) {
        return res.status(200).json({
          status: false,
          message: "Expert Service not found"
        });
      }
  
      const find_service = Service.expert_service_active
  
      if(find_service == 1){
  
      const updateData_1 = await expert_service.update({
        expert_service_active: 0
    },{
      where : {
        serviceId : service_id,
        UserId:expert_id
      }
    });
  
    return res.status(200).json({
      status : true,
      message : "Expert Service is deactivated ",
      data : updateData_1
    })
  }else{
    const updateData = await expert_service.update({
        expert_service_active: 1
  },{
    where : {
        serviceId : service_id,
        UserId:expert_id

    }
  });
  return res.status(200).json({
    status : true,
    message : "Expert Service is activated",
    data : updateData
  })
  }
      
    } catch (error) {
      return res.status(500).json({
          status :false,
          message : error.message
      })
    }
  };