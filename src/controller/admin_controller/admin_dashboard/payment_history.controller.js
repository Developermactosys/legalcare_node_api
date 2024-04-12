const db = require('../../../../config/db.config')
const User = db.User;
const transcation_histroy = db.transaction_history

// API for get all transcation_history
const getPaymentHistory = async(req ,res) =>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const findPayment = await transcation_histroy.findAll({
            attributes:['id','transaction_id','payment_method','createdAt','transaction_amount','status'],
            include: [{
                model: User,
                attributes: ['name','user_type'], 
                as: 'User' 
            }],
            order: [['id', 'DESC']],
            limit: limit,
            offset: offset,
        });
        
        const totalCount = await transcation_histroy.count({});
        const totalPages = Math.ceil(totalCount / limit);
    

        if(findPayment){
            return res.status(200).json({
                status : true,
                message : "Payment show successfully",
                data : findPayment
            })
        }
        else{
            return res.status(400).json({
                status : false,
                message : "Payment is not available",
                count:totalCount,
                currentPage: page,
                totalPages: totalPages,
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message 
        })
    }
}

const getPaymentHistoryById = async(req ,res) =>{
    const id = req.params.id;
    try {
        const findPayment = await transcation_histroy.findAll({
            where: {
                id : id
            },
            include: [{
                model: User,
                as: 'User' 
            }]
        });
        
        if(findPayment){
            return res.status(200).json({
                status : true,
                message : "Payment show successfully",
                data : findPayment
            })
        }
        else{
            return res.status(400).json({
                status : false,
                message : "Payment is not available"
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
    getPaymentHistory,
    getPaymentHistoryById

}

