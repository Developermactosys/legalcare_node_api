const db = require("../../../config/db.config");
const doc = db.document;
const User = db.User;
const BankDetails = db.bank_details
const Notification = db.notification;
const { Sequelize,Op } = require("sequelize")
const FCM = require('fcm-node');
const serverKey = process.env.SERVER_KEY_HERE;
const fcm = new FCM(serverKey);
// API for create document 

// exports.uploadDocument = async(req, res)=>{
//     try{

//         const {expert_id,user_id,booking_id} = req.body;

//         const filePath = req.file
//         ? `documents/${req.file.filename}`
//         : "/src/uploads/profile_image/default.png"; 
//         const doc = await document.create({
//             document: filePath,
//             expert_id:expert_id,
//             UserId:user_id,
//             bookingDetailId :booking_id
//         })
//         if(doc){
//             return res.status(200).json({
//                 status : true,
//                 message : "document uploaded successfully",
//                 data : doc
//             })
//         }
//     }catch(error){
//         return res.status(500).json({
//             status : false,
//             message : error.message
//         })
//     }
// }

// API for get Document 
exports.getAllDocument = async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;

        const docs = await doc.findAll({
            include: [
                {
                    model: User,
                    as: "User"
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset,
        });
        const totalCount = await doc.count({});
        const totalPages = Math.ceil(totalCount / limit);

        if (docs.length > 0) {
            return res.status(200).json({
                status: true,
                message: "Document list retrieved successfully",
                data: docs,
                count: totalCount,
                currentPage: page,
                totalPages: totalPages,
            });
        } else {
            return res.status(200).json({
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

exports.getAllDocumentById = async(req, res)=>{
  
  try {
    // if(!req.body.expert_id){
    //   return res.status(404).json({
    //     status : false,
    //     message : "expert_id not found "
    //   })
    // }
    const docData = await BankDetails.findOne({where: {
      UserId : req.query.expert_id
    }})
    if(docData){
      return res.status(200).json({
        status : true,
        message : "Document get successfully",
        data : docData
      })
    }else{
      return res.status(200).json({
        status : false,
        message : "Document not found",
      })
    }
  } catch (error) {
    return res.status(500).json({
      status : false,
      message : error.message
    })
  }
}

exports.get_document_by_user_id = async (req, res) => {
    try {
        const { sender_id, receiver_id ,booking_id} = req.query;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;

        let expert_Id
        let expert_data = []

        const get_document = await doc.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { 
                        sender_id: sender_id ,
                        receiver_id: receiver_id
                    },
                    { 
                        sender_id: receiver_id ,
                        receiver_id: sender_id ,
                    },
                ],
                    bookingDetailId :booking_id
            },
            include: [
                {
                    model: User,
                    as: "User"
                },
                // {
                //     model: User,
                //     as: "User",
                //     where: { id: Sequelize.col('document.receiver_id') } 
                // },
            ],
           
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: pageSize
        });
        
        for(let i =0; i<get_document.length; i++){
            expert_Id = get_document[i].receiver_id;
            const  ex_data = await User.findByPk(expert_Id)
            expert_data.push({data :get_document[i], expert : ex_data})
      
            // final_data.push()
          }

        return res.status(200).json({
            status: true,
            message: "All Documents",
            data: expert_data,
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


exports.uploadDocument = async (req, res) => {
    try {
        const { booking_id, sender_id, receiver_id } = req.body;
        const sender = await User.findByPk(sender_id);
        const receiver = await User.findByPk(receiver_id);
  
      const filePath = req.file
        ? `documents/${req.file.filename}`
        : "/src/uploads/profile_image/default.png";
      const docs = await doc.create({
        document: filePath,
          sender_id: sender_id,
         receiver_id : receiver_id,
        UserId: sender_id,
        bookingDetailId: booking_id,
      });
        if (docs) {
          
                  var message = {
                    to: receiver.device_id,
                    collapse_key: "green",
  
                    notification: {
                      title: `Document`,
                      body: ` You have received a document sent by ${sender.name}`,
                      priority: "high"
                    },
                  };
  
                  await Notification.create({
                    message: message.notification.body,
                    type: "document",
                    UserId: receiver_id,
                  });
  
                  fcm.send(message, function (err, response) {
                    // console.log("1", message);
                    if (err) {
                      console.log("Something Has Gone Wrong !", err);
                      return res.status(201).json({
                        success: false,
                        message: err.message,
                      });
                    } else {
                      console.log("Successfully Sent With Resposne :", response);
                      var body = message.notification.body;
                      console.log(
                        "notification body for add order <sent to manager>",body
                      );
                      return res.status(200).json({
                        success: true,
                        message: "document uploaded successfully",
                          did: receiver.device_id,
                         data: docs,
                      });
                    }
                  });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  };


  // Api for multiple upload documents
exports.uploadMultipleDoc = async (req, res) => {
  const {  
     expert_id
  } = req.body;

  try {
    let certificate_of_membership = req.files['certificate_of_membership'] && req.files['certificate_of_membership'][0]
     ? `documents/${req.files['certificate_of_membership'][0].filename}`
     : null;

    let certificate_of_practice = req.files['certificate_of_practice'] && req.files['certificate_of_practice'][0]
     ? `documents/${req.files['certificate_of_practice'][0].filename}`
     : null;

    let pan_card_image = req.files['pan_card_image'] && req.files['pan_card_image'][0]
     ? `documents/${req.files['pan_card_image'][0].filename}`
     : null;
     
     let aadhar_card_image = req.files['aadhar_card_image'] && req.files['aadhar_card_image'][0]
     ? `documents/${req.files['aadhar_card_image'][0].filename}`
     : null;
     let passbook_image = req.files['passbook_image'] && req.files['passbook_image'][0]
     ? `documents/${req.files['passbook_image'][0].filename}`
     : null;
     let document = req.files['document'] && req.files['document'][0]
     ? `documents/${req.files['document'][0].filename}`
     : null;
  //   if (!pan_card_image || !aadhar_card_image || !passbook_image || !certificate_of_membership || !certificate_of_practice ) {
  //     return res.status(400).json({
  //       status: false,
  //       message: "Please provide pancard, aadharcard, certificate_of_membership, certificate_of_practice, and passbook image."
  //     });
  //   }
const findUser = await User.findOne({where : {
  id :expert_id
}})
if(findUser){
  const addDocument = await doc.create({
      UserId: expert_id,
      certificate_of_membership: certificate_of_membership,
      certificate_of_practice: certificate_of_practice,
      pan_card_image:  pan_card_image,
      aadhar_card_image: aadhar_card_image,
      passbook_image:  passbook_image,
      document: document
    });
    

    if (addDocument) {
      return res.status(200).json({
        status: true,
        message: "Bank details added successfully.",
        data: addDocument,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Bank details not found."
      });
    }
  }else{
    return res.status(404).json({
      status : false,
      message : "user not found"
    })
  }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// // API for update status 
// exports.updateStatusForDoc = async (req, res) => {
// const {  
//   expert_id,
//   is_aadhar_card_verify,
//   is_passbook_verify,
//   is_certificate_of_membership_verify,
//   is_certificate_of_practice_verify,
//   is_document_verify,
//   is_pan_card_image_verify
// } = req.body;

// try {
//   // const addDocument = await doc.findOne({ where: { UserId: expert_id } });
//   const addDocument = await doc.update( {is_aadhar_card_verify, is_passbook_verify
//     ,is_certificate_of_membership_verify,is_certificate_of_practice_verify, is_document_verify, is_pan_card_image_verify} ,{ where: { UserId: expert_id } });
  

//   if (!addDocument) {
//     return res.status(200).json({
//       status: false,
//       message: "Document not found."
//     });
//   }

//   // if (is_aadhar_card_verify !== undefined) addDocument.is_aadhar_card_verify = is_aadhar_card_verify;
//   // if (is_passbook_verify !== undefined) addDocument.is_passbook_verify = is_passbook_verify;
//   // if (is_certificate_of_membership_verify !== undefined) addDocument.is_certificate_of_membership_verify = is_certificate_of_membership_verify;
//   // if (is_certificate_of_practice_verify !== undefined) addDocument.is_certificate_of_practice_verify = is_certificate_of_practice_verify;
//   // if (is_document_verify !== undefined) addDocument.is_document_verify = is_document_verify;
//   // if (is_pan_card_image_verify !== undefined) addDocument.is_pan_card_image_verify = is_pan_card_image_verify;

//   // await addDocument.save();

//   return res.status(200).json({
//     status: true,
//     message: "Document updated successfully",
//     data: addDocument
//   });
// } catch (error) {
//   return res.status(500).json({
//     status: false,
//     message: error.message
//   });
// }
// };

exports.updateStatusForDoc = async (req, res) => {
  const {  
    expert_id,
    is_aadhar_card_verify,
    is_passbook_verify,
    is_certificate_of_membership_verify,
    is_certificate_of_practice_verify,
    is_document_verify,
    is_pan_card_image_verify
  } = req.body;

  try {
    const addDocument = await BankDetails.update( {is_aadhar_card_verify, is_passbook_verify
      ,is_certificate_of_membership_verify,is_certificate_of_practice_verify, is_document_verify, is_pan_card_image_verify} ,{ where: { UserId: expert_id } });
     
    if (!addDocument) {
      return res.status(200).json({
        status: false,
        message: "Document not found."
      });
    }
    const findDoc = await doc.findOne({
      where : {
        UserId: expert_id     
       }
    })
   
    if(findDoc){
    if(findDoc.is_aadhar_card_verify == 'approved' && findDoc.is_certificate_of_membership_verify == 'approved'
    && findDoc.is_passbook_verify == 'approved' && findDoc.is_certificate_of_practice_verify == 'approved' &&
    findDoc.is_pan_card_image_verify == 'approved'){
      await User.update({
        is_verify: 1
      }, {where : {id : expert_id}})
    }
    }
    return res.status(200).json({
      status: true,
      message: "Document updated successfully",
      data: addDocument
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
