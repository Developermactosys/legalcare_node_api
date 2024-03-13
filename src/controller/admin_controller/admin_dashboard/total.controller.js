const db = require("../../../../config/db.config");
const User = db.User;
const chat = db.chat;
const call = db.call_details
const video = db.video;
const { Op, Sequelize } = require("sequelize");
const { QueryTypes } = require('sequelize')
const moment = require("moment");


// API for total customer
exports.totalUser = async(req, res)=>{
    try {
        const user_type = "1";
        const user = await User.findAndCountAll({
            where : {
                user_type : user_type
            }
        })
        if(!user){
            return res.status(400).json({
                status : false,
                message : "Data not found"
            })
        }else{
            return res.status(200).json({
                status : true,
                message : "Get user successfully",
                data : user.count
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message,
          })
    }
}

// API for total Expert
exports.totalExpert = async(req, res)=> {
    const user_type = ['2','3','4']
    try {
        const expert = await User.findAndCountAll({
            where : {
                user_type : user_type
            }
        })
        if(!expert){
            return res.status(400).json({
                status : false,
                message : "Data not found"
            })
        }else{
            return res.status(200).json({
                status : true,
                message : "Get total Expert",
                data : expert.count
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message,
          })
    }
}

exports.count_total_chat = async (req, res) => {
    try {
        const results = await chat.findAll({
            attributes: ['from_user_id', 'to_user_id'],
            group: ['from_user_id', 'to_user_id']
        });

        if (results.length > 0) {
            const uniqueChats = new Set();
            
            results.forEach(row => {
                const { from_user_id, to_user_id } = row;
                // Create a string or another structure that uniquely identifies the chat pair
                // Here, we ensure the lower ID always comes first to avoid duplicates like (1,2) and (2,1)
                const chatPair = [from_user_id, to_user_id].sort().join(':');
                uniqueChats.add(chatPair);
            });

            return res.send({
                status: true,
                message: "Get Data Successfully",
                chat_count: uniqueChats.size // The total number of unique chat connections
            });
        } else {
            return res.send({
                status: true,
                message: "No Data Found",
                chat_count: 0
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            status: false,
            message: "Internal Server Error",
            chat_count: 0
        });
    }
};

// API for total get call
exports.getTotalCall = async(req, res) =>{
    try {
        const getTotal = await call.findAndCountAll()
        if(getTotal){
            return res.status(200).json({
                status : true,
                message : "Get Total call successfully...",
                data : getTotal.count
            })
        }else{
            return res.status(400).json({
                status: false,
                message : "Call not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

exports.getTotalVideo = async(req, res) =>{
    try {
        const getTotal = await video.findAndCountAll()
        if(getTotal){
            return res.status(200).json({
                status : true,
                message : "Get Total call successfully...",
                data : getTotal.count
            })
        }else{
            return res.status(400).json({
                status: false,
                message : "Call not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

