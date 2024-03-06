const db = require("../../../config/db.config");
const document = db.document


// API for create document 
exports.uploadDocument = async(req, res)=>{
    try{
        const filePath = req.file
        ? `documents/${req.file.filename}`
        : "/src/uploads/profile_image/default.png"; 
        const doc = await document.create({
            document: filePath
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
exports.getAllDocument = async(req,res)=>{
    try {
        const doc = await document.findAll()
        if(doc){
            return res.status(200).json({
                status : true,
                message : "Document list get successfully",
                data : doc
            })
        }else{
            return res.status(400).json({
                status : false,
                message : "Document list not available"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.messsage
        })
    }
}