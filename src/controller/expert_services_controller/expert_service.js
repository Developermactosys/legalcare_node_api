const db = require('../../../config/db.config')
const User = db.User
const expert_service = db.expertservices
const service = db.service

// API for create expert_services
exports.addExpertService = async(req, res) =>{
    const { status, service_type, expert_fees, GST , user_id, serviceId } = req.body;
    
    try {
        if(!user_id && !serviceId){
            return res.status(404).json({
                status : false,
                message : "user_id and serviceId not found "
            })
        }
        const createExpert = await expert_service.create({
            GST,  expert_fees, UserId : user_id, serviceId : serviceId
        })
        if(createExpert){
            return res.status(200).json({
                status : true,
                message : "expert service is created successfully",
                data : createExpert
            })
        }
        else{
            return res.status(400).json({
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
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit
        const getAllData = await expert_service.findAll({
            include:[{
                model: service,
                as: "service",
                attributes: ['id', 'serviceName','service_img']
            },
            {
            model: User,
            as: "User",
            attributes:['id', 'name', 'profile_image']
        }],
        order: [["id", "DESC"]],
        limit: limit,
        offset: offset,
        })
        const totalCount = await expert_service.count({});
        const totalPages = Math.ceil(totalCount / limit);
        if(getAllData){
            return res.status(200).json({
                status : true,
                message: "Get all expert service",
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


// API for get expert service by Id
exports.getAllExpertServiceById = async(req, res) => {
    const { id } = req.params;
    try {
        const getAllData = await expert_service.findByPk(id, {
            include:[{
                model: service,
                as: "service",
                attributes: ['id', 'serviceName','service_img']
            },
            {
            model: User,
            as: "User",
            attributes:['id', 'name', 'profile_image']
        }]
        })
        if(getAllData){
            return res.status(200).json({
                status : true,
                message: "Get expert service",
                data : getAllData
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

// API for update expert service by ID
exports.updateExpertServiceById = async(req, res) => {
    const { id } = req.params;
    const {status, service_type, expert_fees, GST} = req.body
    try {
        const getAllData = await expert_service.findByPk(id)

            if(getAllData){
                const updateData = await getAllData.update(
                   req.body
                )
            return res.status(200).json({
                status : true,
                message: "Expert service updated successfully",
                data : updateData
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

// API for delete expert service by Id
exports.delExpertServiceById = async(req, res) => {
    const { id } = req.params;
  
    try {
        const getAllData = await expert_service.findByPk(id)

            if(getAllData){
                const updateData = await getAllData.destroy()
            return res.status(200).json({
                status : true,
                message: "Expert service has been deleted successfully",
            })
        }
        else{
            return res.status(400).json({
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