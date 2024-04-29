const db = require("../../../config/db.config")
const category = db.category;
const subCategory = db.subcategory;
const services = db.service;
const User = db.User;
const wallet_system =db.wallet_system;
const booking = db.booking_detail;
const expert_service = db.expert_service
// const expert_service = db.expert_service
const {Sequelize,Op, where} = require('sequelize');
// API for add Services
const createServices = async(req, res)=>{
    const { categoryId, subCategoryId,serviceName, expert_id ,service_type ,expert_fees, service_cost,type_of_service} = req.body;
    // const { serviceName } = req.body
    try {

      const find_service_name = await services.findOne({
        where:{ serviceName : serviceName}
      })
      if(find_service_name){
        return res.status(200).json({status:false , message : "Service name is Already exist "})
      }
      
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
            type_of_service:type_of_service,
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
        const {type_of_service} = req.query;
        let query = {
            where: {},
          };
        
          if (type_of_service) {
            query.where.type_of_service = { [Sequelize.Op.like]: `%${type_of_service}%` };
          }

        const getServices = await services.findAll({
            // where: { type_of_service: req.query.type_of_service },
            where: query.where,
            include:[{
                model: category,
                as: "category",
              },
            {
                model:subCategory,
                as:"subcategory",
            },
            {
              model: expert_service,
              as: "expert_service",
              include: [
                  {
                      model: User,
                      as: "User",
                      // attributes: ['id', 'user_type', 'name', 'profile_image'],
                  }
              ],
          },
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


// Originoal
// // API for get service by Id
// const getServiceById = async(req, res) => {
//     const { serviceId } = req.query;
//     try {
//         const getServices = await services.findByPk(serviceId, {
//             include:[
//                 // {
//                 //     model: User,
//                 //     as: "User",
//                 //     attributes:['id','user_type','name','profile_image']
//                 // },
//                 {
//                   model: expert_service,
//                   as: "expert_service",
//                   include: [
//                     {
//                       model: User,
//                       as: "User",
//                       where: { id: Sequelize.col('expert_service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
//                     }]
//                 },
//                 {
//                 model: category,
//                 as: "category",
//               },
//             {
//                 model:subCategory,
//                 as:"subcategory",
//             }]
//         })
//         if(getServices){
//             return res.status(200).json({
//                 status : true,
//                 message : "Show service by Id",
//                 data : getServices
//             })
//         }else{
//             return res.status(404).json({
//                 status : false,
//                 message : "service Id is not found"
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     } 
// }



const getServiceById = async (req, res) => {
  const { serviceId } = req.query;
  try {
      const service = await services.findByPk(serviceId, {
          include: [
              {
                  model: expert_service,
                  as: "expert_service",
                  include: [
                      {
                          model: User,
                          as: "User",
                          // attributes: ['id', 'user_type', 'name', 'profile_image'],
                      }
                  ],
              },
              {
                  model: category,
                  as: "category",
              },
              {
                  model: subCategory,
                  as: "subcategory",
              },
          ],
      });

      if (!service) {
          return res.status(404).json({
              status: false,
              message: "Service Id not found",
          });
      }

      // Extract and format expert_service data into an array of user details
      // const expertUsersArray = service.expert_service.map(expertService => ({
      //     id: expertService.User.id,
      //     user_type: expertService.User.user_type,
      //     name: expertService.User.name,
      //     profile_image: expertService.User.profile_image,
      // }));

      return res.status(200).json({
          status: true,
          message: "Service found by Id",
          data: {
              ...service.toJSON(), // Include other service details
              // expert_service: expertUsersArray, // Replace expert_service with the formatted array of user details
          },
      });
  } catch (error) {
      return res.status(500).json({
          status: false,
          message: error.message,
      });
  }
};


// Origional
// // API for get service by expert_id(user side)
// const getServiceBy_expertId = async(req, res) => {
//     try {
//         const { expert_id ,service_type} = req.query;
//         const page = Number(req.query.page) || 1;
//         const limit = Number(req.query.limit) || 5;
//         const offset = (page - 1) * limit;

//         const getServices = await services.findAll({where :{
//             UserId:expert_id,
//             service_type :service_type,
//         },
//         include: [
//             {
//                 model: User,
//                 as: "User",
//                 attributes:['id','user_type','name','profile_image']

//             },
//             {
//                 model: category,
//                 as: "category",
//             },
//             {
//                 model: subCategory,
//                 as: "subcategory",
//             }
//         ],
//          limit: limit,
//          offset: offset,
//     })
//     const totalCount = await services.count({});
//     const totalPages = Math.ceil(totalCount / limit);

//         if(getServices){
//             return res.status(200).json({
//                 status : true,
//                 message : `Showing ${service_type} by expert_id`,
//                 data : getServices,
//                 totalServices: totalCount,
//                 currentPage: page,
//                 totalPages:totalPages,
//             })
//         }else{
//             return res.status(404).json({
//                 status : false,
//                 message : "expert_id is not found"
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     } 
// }


const getServiceBy_expertId = async(req, res) => {
  try {
      const { expert_id ,service_type} = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;

      const getServices = await expert_service.findAll({where :{
          UserId:expert_id,
          service_type :service_type,
      },
      include: [
        {
          model: services,
          as: "service",
      },  
        {
              model: User,
              as: "User",
              // attributes:['id','user_type','name','profile_image']

          },
         
          // {
          //     model: category,
          //     as: "category",
          // },
          // {
          //     model: subCategory,
          //     as: "subcategory",
          // }
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



// API for get service by expert_id(user side)
const get_expertServiceBy_category_id = async(req, res) => {
  try {
      const { category_id  } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;

      const getServices = await services.findAll({where :{
          categoryId :category_id ,
          // service_type :service_type,
      },
      include: [
          {
              model: User,
              as: "User",
              attributes:['id','user_type','name','profile_image']

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
              // message : `Showing ${service_type} by expert_id`,
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

        const getServices = await expert_service.findAll({where :{
            UserId:expert_id,
        },
        include:[
           
            {
              model: services,
              as: "service",
            },
            {
              model: User,
              as: "User",
              attributes:['id','user_type','name','profile_image']
            },

        //     {
        //     model: category,
        //     as: "category",
        //   },
        // {
        //     model:subCategory,
        //     as:"subcategory",
        // }
      ],
         limit: limit,
         offset: offset,
    })
    const totalCount = await expert_service.count({});
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
            return res.status(200).json({
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

// Web  side Update services
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
      description,
      type_of_service
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
  
    //   const filePath = req.file
    //     ? `service_img/${req.file.filename}`
    //     : "/src/uploads/service_img/default.png";
      const updateData = await services.update({
        categoryId: categoryId,
        subcategoryId: subCategoryId,
        // service_img: filePath,
        serviceName: serviceName,
        service_type: service_type,
        expert_fees: expert_fees,
        service_cost:service_cost,
        status:status,
        description:description,
        type_of_service:type_of_service,
        // UserId: expert_id,

    },{
      where : {
          id : id
      }
    });

    const find_service = await services.findByPk(id);

    if (req.file) {
      const filePath = req.file
        ? `service_img/${req.file.filename}`
        : "/src/uploads/service_img/default.png";
      find_service.service_img = filePath;
      await find_service.save();
    }

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

// App Side update sevices
const update_expert_service_for_app = async (req, res) => {
  const {
    service_type,
    expert_fees,
    GST,
    status,
    description,
    serviceId,
    expert_id
  } = req.body;

  try {
    
    // Update the expert_service record
    const updateData = await expert_service.update({
  
      service_type: service_type,
      expert_fees: expert_fees,
      GST : GST,
      status: status,
      description: description,
     
    }, {
      where: {
        serviceId: serviceId ,
        UserId :expert_id
      }
    });
    // Check if update was successful
    if (updateData) {
      return res.status(200).json({
        status: true,
        message: "Expert Service updated successfully",
        data: updateData
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Expert Service not updated"
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};


// Cancle Booking 
exports.Cancle_service_by_id = async (req, res) => {
    try {
      const { booking_id ,refunding_amount } = req.params
      const cancel_booking = await Booking_details.findByPk(booking_id)
      if (cancel_booking) {
  
        const  user = await User.findByPk(cancel_booking.UserId)
        const expert= await User.findByPk(cancel_booking.expert_id)
    
        const find_service = await services.findByPk(cancel_booking.serviceId)
        const service_name = find_service.serviceName

        if(cancel_booking.status == 'pending'){
        const deduction_amount = parseFloat(refunding_amount);
         const userWallet = await wallet_system.findOne({
            where:{
                UserId : user.id
            }
       })

    const walletBalance_user = parseFloat(userWallet.wallet_amount);
       

       const newBalance_of_userWalllet = walletBalance_user + (0.95*deduction_amount);
       await userWallet.update(
         { wallet_amount: newBalance_of_userWalllet, device_id },
         { where: { UserId:  user.id} }
       );


       const admin_id = 9

       const walletSystem_of_admin = await wallet_system.findOne({
        where: { UserId: admin_id },
      });

        // Update wallet balance of admin
    const newBalance_of_admin = walletBalance + (0.05 * deduction_amount);
    await walletSystem_of_admin.update(
      { wallet_amount: newBalance_of_admin, device_id },
      { where: { UserId: admin_id } }
    );
   
        }


        
    
    
        //console.log(expert)
        const user_name = user.name;
   
        var message = {
          to: expert.device_id, // Assuming the user model has a device_id field
          notification: {
            title: `Service Cancellation`,
            body: ` ${service_name} is cancelled by ${user_name}.`,
          }, 
        }
        await Notification.create({
          message: message.notification.body,
          type: " Service_cancellation ",
          UserId : expert.id
        });
  
       const delete_booking = await cancel_booking.destroy(cancel_booking)
    
        fcm.send(message, function(err, response) {
          if (err) {
              console.error("Something went wrong!", err);
              return res.status(400).json({ success: false, message: err.message });
          } else {
              console.log("Successfully sent with response: ", response);
              // Proceed with your response
              return res.status(200).json({
                  status: true,
                  message: "Booking is cancelled and notification sent",
                  data: delete_booking,
              });
          }
      });
  
      } else {
        return res.status(400).json({
          status: false,
          message: "Booking Id not found or Booking not deleted"
        })
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

// Origional
// // API for delete Services
// const deleteService = async (req, res) => {
//     const { serviceId, expert_id } = req.params;
//     try {
//       // Find all bookings associated with the service
//       const bookingData = await booking.findAll({
//         where: { serviceId: serviceId }
//       });
  
//       // Check if any booking has 'pending' status
//       const hasPendingBooking = bookingData.some(booking => booking.status === 'pending');
  
//       if (hasPendingBooking) {
//         return res.status(200).json({
//           status: false,
//           message: "Cannot delete service due to pending bookings"
//         });
//       }
  
//       // Proceed with service deletion if no pending bookings
//       const findExpertId = await services.findOne({
//         where: { UserId: expert_id }
//       });
  
//       if (findExpertId) {
//         const delServices = await services.findByPk(serviceId);
  
//         if (delServices) {
//           await delServices.destroy(delServices);
//           return res.status(200).json({
//             status: true,
//             message: "Data deleted successfully"
//           });
//         } else {
//           return res.status(200).json({
//             status: false,
//             message: "Service not found or not deleted"
//           });
//         }
//       } else {
//         return res.status(200).json({
//           status: false,
//           message: "Expert not found or service not deleted"
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         status: false,
//         message: error.message
//       });
//     }
//   };


// App Side delete expert sevices
const deleteService = async (req, res) => {
  const { serviceId, expert_id } = req.params;
  try {
    // Find all bookings associated with the service
    const bookingData = await booking.findAll({
      where: { serviceId: serviceId , expert_id: expert_id}
    });

    // Check if any booking has 'pending' status
    const hasPendingBooking = bookingData.some(booking => booking.status === 'pending');

    if (hasPendingBooking) {
      return res.status(200).json({
        status: false,
        message: "Cannot delete service due to pending bookings"
      });
    }

    // Proceed with service deletion if no pending bookings
    const findExpertId = await expert_service.findOne({
      where:{
         UserId : expert_id ,
          serviceId : serviceId
        }
      })

    if (findExpertId) {
      // const delServices = await services.findByPk(serviceId);
      const delete_expert_service = await expert_service.findAll({
      where:{
         UserId : expert_id ,
          serviceId : serviceId
        }
      })

      if (delete_expert_service) {
        await expert_service.destroy({
          where:{
             UserId : expert_id ,
              serviceId : serviceId
            }
          });
        return res.status(200).json({
          status: true,
          message: "Expert Services deleted successfully"
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "Service not found or not deleted"
        });
      }
    } else {
      return res.status(200).json({
        status: false,
        message: "Expert Service is Already deleted "
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};


// Web Side delete sevices
  const deleteServiceforAdmin = async(req, res) => {
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

const update_service_for_active = async (req, res) => {
  const {service_id,expert_id}= req.query;
  try {

    const Service = await services.findByPk(service_id);

    if (!Service) {
      return res.status(200).json({
        status: false,
        message: "Service not found"
      });
    }

    const find_service = Service.service_active

    if(find_service == 1){

    const updateData_1 = await services.update({
      service_active: 0
  },{
    where : {
        id : service_id
    }
  });

  return res.status(200).json({
    status : true,
    message : "Service is deactivated ",
    data : updateData_1
  })
}else{
  const updateData = await services.update({
    service_active: 1
},{
  where : {
      id : service_id
  }
});
return res.status(200).json({
  status : true,
  message : "Service is activated",
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

module.exports = {
    createServices,
    getALlService,
    getServiceById,
    deleteService,
    getServiceBy_expertId,
    getAllserviceBy_expert_id,
    updateService,
    deleteServiceforAdmin,
    update_service_for_active,
    get_expertServiceBy_category_id,
    update_expert_service_for_app
}