const db = require("../../../config/db.config");
const document = db.document;
const User = db.User;
const { Sequelize,Op } = require("sequelize")
// API for create document 

exports.uploadDocument = async(req, res)=>{
    try{

        const {expert_id,user_id} = req.body;

        const filePath = req.file
        ? `documents/${req.file.filename}`
        : "/src/uploads/profile_image/default.png"; 
        const doc = await document.create({
            document: filePath,
            expert_id:expert_id,
            UserId:user_id
        })
        if(doc){
            return res.status(200).json({
                status : true,
                message : "document uploaded successfully",
                data : doc
            })
        }
    }catch(error){
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

// API for get Document 
exports.getAllDocument = async (req, res) => {
    try {
        const doc = await document.findAll({
            include: [
                {
                    model: User,
                    as: "User"
                },
            ],
            order: [['createdAt', 'DESC']]
        });

        if (doc.length > 0) {
            return res.status(200).json({
                status: true,
                message: "Document list retrieved successfully",
                data: doc
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Document list not available"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


exports.get_document_by_user_id = async (req, res) => {
    try {
        const { user_id } = req.query;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const offset = (page - 1) * pageSize;

        const get_document = await document.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { UserId: user_id },
                    { expert_id: user_id }
                ]
            },
            include: [
                {
                    model: User,
                    as: "User"
                },
            ],
            include:[
                {
                    model: User,
                    as: "User",
                    where: { id: Sequelize.col('document.expert_id') } 

                },
            ],
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: pageSize
        });

        return res.status(200).json({
            status: true,
            message: "All Documents",
            data: get_document,
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};