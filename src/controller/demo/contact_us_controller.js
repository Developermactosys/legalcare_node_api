
const db = require("../../../config/db.config")
const contact = db.contact_us

exports.contactUs = async (req, res) => {
   
    const {  email, whatapp_no, address, message } = req.body;

    try {
        const isEmptyKey = Object.keys(req.body).some(key => {
            const value = req.body[key];
            return value === '' || value === null || value === undefined;
        });

        if (isEmptyKey) {
            return res.status(400).json({status:false, message: "Please do not leave empty fields" });
        }

        
        const updatedUser = await contact.create({email, whatapp_no, address, message });
        if(updatedUser){
            return res.status(200).json({
                status: true,
                message: "Contact added successfully",
                data: {
                         id :updatedUser.id,
                        email :updatedUser.email,
                        whatapp_no :updatedUser.whatapp_no,
                        address: updatedUser.address,
                        message: updatedUser.message
                },
            });
        }
        else{
        return res.status(200).json({
            status: false,
            message: "Contact not added",
           
        });
    }
    } catch (error) {
        return res.status(500).json({status : false, error: error.message });
    }
};

// API for get contact us form
exports.getContactUs = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const updatedUser = await contact.findAll({
            limit: limit,
            offset: offset,
        })
        const totalCount = await contact.count({});
        const totalPages = Math.ceil(totalCount / limit);
       
        if(updatedUser){
            return res.status(200).json({
                status: true,
                message: "showing Data successfully",
                // data: {
                //     id :updatedUser.id,
                //         email :updatedUser.email,
                //         whatapp_no :updatedUser.whatapp_no,
                //         address: updatedUser.address,
                //         message: updatedUser.message
                // },
                data : updatedUser,
                currentPage: page,
                totalPages: totalPages,
            });
        }
        else{
        return res.status(200).json({
            status: true,
            message: "Dat not found",
           
        });
    }
    } catch (error) {
        return res.status(500).json({status : false, error: error.message });
    }
};
