// controllers/bankController.js
// const db = require("../../../config/db.config");
// const BankDetails = db.bank_details;

// async function saveBankDetails(req, res) {
//     try {
//         const {
//             astro_id,
//             pan_card_no,
//             aadhar_no,
//             acc_no,
//             acc_holder_name,
//             ifsc_code,
//             bank_name,
//             pan_doc,
//             aadhar_doc,
//             passbook_img,
//         } = req.body;

//         const detailsExists = await BankDetails.findOne({
//             where: { astro_id: astro_id },
//         });

//         const fileUpload = async (file, fieldName) => {
//             if (file) {
//                 const filePath = 'public\images'; // Update the path
//                 const fileName = `/${Date.now()}${file.name}`;
//                 await file.mv(filePath + fileName);
//                 return fileName;
//             }
//             return null;
//         };

//         if (detailsExists) {
//             const updateData = {
//                 pan_card_no,
//                 aadhar_no,
//                 acc_holder_name,
//                 ifsc_code,
//                 acc_no,
//                 bank_name,
//                 aadhar_doc,
//                 pan_doc,
//                 passbook_img,
//             };

//             updateData.pan_doc = await fileUpload(req.body.pan_doc, 'pan_doc');
//             updateData.aadhar_doc = await fileUpload(req.body.aadhar_doc, 'aadhar_doc');
//             updateData.passbook_img = await fileUpload(req.body.passbook_img, 'passbook_img');

//             await BankDetails.update(updateData, {
//                 where: { astro_id },
//             });

//             return res.json({
//                 status: true,
//                 data: updateData,
//                 message: 'Documents updated successfully',
//             });
//         } else {
//             const insertData = {
//                 astro_id,
//                 pan_card_no,
//                 aadhar_no,
//                 acc_no,
//                 acc_holder_name,
//                 ifsc_code,
//                 bank_name,
//                 pan_doc: await fileUpload(req.body.pan_doc, 'pan_doc'),
//                 aadhar_doc: await fileUpload(req.body.aadhar_doc, 'aadhar_doc'),
//                 passbook_img: await fileUpload(req.body.passbook_img, 'passbook_img'),
//             };

//             await BankDetails.create(insertData);

//             return res.json({
//                 status: true,
//                 data: insertData,
//                 message: 'Bank Details saved successfully',
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             code: 500,
//             message: 'Internal Server Error',
//             data: '',
//         });
//     }
// }


// const saveBankDetails = async (req, res) => {
//   const {  
//     expert_id,
//     pan_card_no,
//     aadhar_no,
//     acc_no,
//     acc_holder_name,
//     ifsc_code,
//     bank_name,
//     pan_doc,
//     aadhar_doc,
//     passbook_img, } = req.body;
//   try {
//     const filePath = req.file
//       ? `document/${req.file.filename}`
//       : "/src/uploads/document/default.png";

//     const addBankDetails = await BankDetails.create({
//       UserId :expert_id,
//       pan_card_no,
//       aadhar_no,
//       acc_no,
//       acc_holder_name,
//       ifsc_code,
//       bank_name,
//       pan_doc: Array.isArray(pan_doc) ? pan_doc.map(file => `document/${file.filename}`) : [],
//       aadhar_doc: Array.isArray(aadhar_doc) ? aadhar_doc.map(file => `document/${file.filename}`) : [],
//       passbook_img: Array.isArray(passbook_img) ? passbook_img.map(file => `document/${file.filename}`) : [],
     
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Bank details add successfully....",
//       data: addBankDetails,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// const getBankDetails = async (req, res) => {
//     try {
//       const userDetails = await BankDetails.findAll({});
  
//       if (!userDetails) {
//         return res.status(404).json({
//           success: false,
//           message: "Bank Details not found",
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         message: "BankDetails retrieved successfully",
//         data: userDetails,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
  
//   // get BankDetails by id
//   const getBankDetailsById = async (req, res) => {
//     if (!req.params.id) {
//       return res.json({
//         success: false,
//         message: "bankDetails is Not provide",
//       });
//     }
//     try {
//       const userDetails = await BankDetails.findOne({
//         where: {
//           id: req.params.id,
//         },
//       });
//       if (!userDetails) {
//         return res.status(404).json({
//           success: false,
//           message: "BankDetails not found",
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         message: "BankDetails retrieved successfully",
//         data: userDetails,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };


// //get bank
//   const editBankInfo = async (req, res) => {
//     const caId = req.params.id;
//     try {
//       const bankInfo = await BankDetails.findOne({
//         where: {
//           astro_id: caId,
//         },
//       });
  
//       if (!bankInfo) {
//         return res.json({
//           message: "Bank information not found for the provided CA ID",
//         });
//       }
  
//       const updatedBankInfo = await bankInfo.update(req.body);
  
//       return res.json({
//         success: true,
//         message: "Bank information updated successfully",
//         data: updatedBankInfo,
//       });
//     } catch (error) {
//       // Handle errors
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
  

// module.exports = {
//     saveBankDetails,getBankDetails,getBankDetailsById,editBankInfo
// };



// controllers/bankController.js

const db = require("../../../config/db.config");
const BankDetails = db.bank_details;
const User =db.User

const saveBankDetails = async (req, res) => {
  const {  
    expert_id,
    pan_card_no,
    aadhar_no,
    acc_no,
    acc_holder_name,
    ifsc_code,
    bank_name
  } = req.body;

  try {
    let pan_doc = req.files['pan_doc'] && req.files['pan_doc'][0]
     ? `documents/${req.files['pan_doc'][0].filename}`
     : null;

    let aadhar_doc = req.files['aadhar_doc'] && req.files['aadhar_doc'][0]
     ? `documents/${req.files['aadhar_doc'][0].filename}`
     : null;

    let passbook_img = req.files['passbook_img'] && req.files['passbook_img'][0]
     ? `documents/${req.files['passbook_img'][0].filename}`
     : null;

    if (!pan_doc || !aadhar_doc || !passbook_img) {
      return res.status(400).json({
        status: false,
        message: "Please provide pancard, aadharcard, and passbook image."
      });
    }
const findUser = await User.findOne({where : {
  id :expert_id
}})
if(findUser){
    const addBankDetails = await BankDetails.create({
      UserId: expert_id,
      pan_card_no,
      aadhar_no,
      acc_no,
      acc_holder_name,
      ifsc_code,
      bank_name,
      pan_doc,
      aadhar_doc,
      passbook_img
    });

    if (addBankDetails) {
      return res.status(200).json({
        status: true,
        message: "Bank details added successfully.",
        data: addBankDetails,
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


const getBankDetails = async (req, res) => {
    try {
      const userDetails = await BankDetails.findAll({});
  
      if (!userDetails) {
        return res.status(404).json({
          success: false,
          message: "Bank Details not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "BankDetails retrieved successfully",
        data: userDetails,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  // get BankDetails by id
  const getBankDetailsById = async (req, res) => {
    if (!req.params.id) {
      return res.json({
        success: false,
        message: "bankDetails is Not provide",
      });
    }
    try {
      const userDetails = await BankDetails.findOne({
        where: {
          USerId: req.params.id,
        },
      });
      if (!userDetails) {
        return res.status(404).json({
          success: false,
          message: "BankDetails not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "BankDetails retrieved successfully",
        data: userDetails,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

const updateBankDetails = async (req, res) => {
  const {  
    expert_id,
    pan_card_no,
    aadhar_no,
    acc_no,
    acc_holder_name,
    ifsc_code,
    bank_name
  } = req.body;

  try {
    let pan_doc = req.files['pan_doc'] && req.files['pan_doc'][0]
     ? `documents/${req.files['pan_doc'][0].filename}`
     : null;

    let aadhar_doc = req.files['aadhar_doc'] && req.files['aadhar_doc'][0]
     ? `documents/${req.files['aadhar_doc'][0].filename}`
     : null;

    let passbook_img = req.files['passbook_img'] && req.files['passbook_img'][0]
     ? `documents/${req.files['passbook_img'][0].filename}`
     : null;

    // Check if at least one of the fields is provided for update
    if (!pan_card_no && !aadhar_no && !acc_no && !acc_holder_name && !ifsc_code && !bank_name && !pan_doc && !aadhar_doc && !passbook_img) {
      return res.status(400).json({
        status: false,
        message: "Please provide at least one field to update."
      });
    }

    // Retrieve the bank details to update
    let bankDetails = await BankDetails.findOne({ where: { UserId: expert_id } });
    if (!bankDetails) {
      return res.status(404).json({
        status: false,
        message: "Bank details not found."
      });
    }

    // Update the bank details with provided fields
    if (pan_card_no) bankDetails.pan_card_no = pan_card_no;
    if (aadhar_no) bankDetails.aadhar_no = aadhar_no;
    if (acc_no) bankDetails.acc_no = acc_no;
    if (acc_holder_name) bankDetails.acc_holder_name = acc_holder_name;
    if (ifsc_code) bankDetails.ifsc_code = ifsc_code;
    if (bank_name) bankDetails.bank_name = bank_name;
    if (pan_doc) bankDetails.pan_doc = pan_doc;
    if (aadhar_doc) bankDetails.aadhar_doc = aadhar_doc;
    if (passbook_img) bankDetails.passbook_img = passbook_img;

    // Save the updated bank details
    await bankDetails.save();

    return res.status(200).json({
      status: true,
      message: "Bank details updated successfully.",
      data: bankDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


module.exports = {
    saveBankDetails,getBankDetails,getBankDetailsById,updateBankDetails
};