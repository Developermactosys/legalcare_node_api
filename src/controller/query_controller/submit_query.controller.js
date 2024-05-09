const db = require("../../../config/db.config")
const  AdminQuery  = db.admin_query ;
const User = db.User;
const  Notification  = db.notification ;
const { validationResult } = require("express-validator");

const generateTicketID = () => {
  const randomString = Math.random().toString(36).substr(2, 6).toUpperCase(); // Generates a random string of length 6
  const randomNumber = Math.floor(Math.random() * 1000); // Generates a random number between 0 and 999
  return "TICKET-" + randomString + randomNumber;
};

// exports.submitQuery = async (req, res) => {
  
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res
//       .status(200)
//       .json({
//         status: false,
//         code: 201,
//         message: errors.array()[0].msg,
//         data: req.body,
//       });
//   }

//   const { user_id, type, query_type, text_query } = req.body;
  
  
//   const query_id = req.body.query_id || 0;
//   const amount = parseFloat(req.body.amount) || 0;



//   try {
//     const ticketID = generateTicketID();
  
//     const filePath = req.file
//     ? `query_img/${req.file.filename}`
//     : "/src/uploads/query_img/default.png";
//     await AdminQuery.create({
//       type,
//       query_type,
//       query_id,
//       status: 0,
//       query_img:filePath,
//       UserId: user_id,
//       query: text_query,
//       date: new Date(),
//       ticketid: ticketID,
//       amount,
//     });

//    await Notification.create({
//       message: "New query request from User",
//       UserId: user_id,
//       title: "New Query Arrived",
//       type: "query",
//     });

//    return res.status(200).json({
//       status: true,
//       message: "We will resolve your query in 24 Hours",
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         status: false,
//         message: "An error occurred",
//         error: error.message,
//       });
//   }
// };


exports.submitQuery = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        code: 201,
        message: errors.array()[0].msg,
        data: req.body,
      });
    }

    const { user_id, type, query_type, text_query, issue_with } = req.body;
    const query_id = req.body.query_id || 0;
    const amount = parseFloat(req.body.amount) || 0;

    const ticketID = generateTicketID();

    const findUser = await User.findOne({
      where : {
        id : user_id
      }
    })
    const checkUserType = findUser.user_type;

    if(!findUser){
      return res.status(200).json({
        status : false,
        message : "Please provide a User Id"
      })
    }
    
    const add_query = await AdminQuery.create({
      type:checkUserType,
      query_type,
      query_id,
      // status: "Pending",
      UserId: user_id,
      query: text_query,
      date: new Date(),
      ticketId: ticketID,
      issue_with : issue_with,
      amount,
    });

    if(req.file){
      const filePath = req.file
        ? `query_img/${req.file.filename}`
        : "src/uploads/query_img/default.png";
        add_query.query_img = filePath
        await add_query.save()
  
       }

    // await Notification.create({
    //   message: "New query request from User",
    //   UserId: user_id,
    //   title: "New Query Arrived",
    //   type: "query",
    // });

    return res.status(200).json({
      status: true,
      message: "We will resolve your query in 24 Hours",
    });
  } catch (error) {
    console.error("Error submitting query:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
};

// get all query for user side
exports.getAllSubmitQuery = async(req, res) => {
  const user_type = 1;
  try{
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  const getUserQuery = await AdminQuery.findAll({where : {
   type : user_type
  },
   include: [
     {
       model: User,
       as: "User",
       attributes: ['id','name','user_type','profile_image']
     },
   ],
   order: [["id", "DESC"]],
   limit: limit,
   offset: offset,
  })

  const totalCount = await AdminQuery.count({where: { type: user_type }});
  const totalPages = Math.ceil(totalCount / limit);

  if(getUserQuery){
   return res.status(200).json({
     status : true,
     message : "Show data successfully",
     count: totalCount,
     data : getUserQuery,
     currentPage: page,
     totalPages: totalPages,
   })
  }else{
   return res.status(200).json({
     status : false,
     message : "data not found"
   })
  }
 }catch(error){
   return res.status(500).json({
     status : false,
     message : error.message
   })
 }
} 

// get all query for expert side
exports.getAllSubmitQueryForExpert = async(req, res) => {
 const user_type = ['2','3','4'];
 try{
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
 const getUserQuery = await AdminQuery.findAll({where : {
  type : user_type
 },
  include: [
    {
      model: User,
      as: "User",
      attributes: ['id','name','user_type','profile_image']
    },
  ],
  order: [["id", "DESC"]],
  limit: limit,
  offset: offset,
 })

 const totalCount = await AdminQuery.count({where: { type: user_type }});
 const totalPages = Math.ceil(totalCount / limit);

 if(getUserQuery){
  return res.status(200).json({
    status : true,
    message : "Data retrived successfully",
    count: totalCount,
    data : getUserQuery,
    currentPage: page,
    totalPages: totalPages,
  })
  }
 else{
  return res.status(200).json({
    status : false,
    message : "data not found"
  })
 }
}catch(error){
  return res.status(500).json({
    status : false,
    message : error.message
  })
}
}


// API for update status for query
exports.updateStatusQuery = async(req, res) => {
 const { id, status ,response} = req.query;
 try {
   const queryUpdate = await AdminQuery.update({
     status : status,
     response:response
   }, {where : {
     id: id,
     response:NULL
   }})
   if(queryUpdate){
     return res.status(200).json({
       status : true,
       message : "Query status updated successfully"
     })
   }else{
     return res.status(200).json({
       status : false,
       message : "You already Responded to this query"
     })
   }
 } catch (error) {
   return res.status(500).json({
     status : false,
     message : error.message
   })
 }
}