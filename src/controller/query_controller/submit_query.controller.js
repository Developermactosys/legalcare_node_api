const db = require("../../../config/db.config")
const  AdminQuery  = db.admin_query ;
const  Notification  = db.notification ;
const { validationResult } = require("express-validator");

const generateTicketID = () => {
  return "TICKET-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

exports.submitQuery = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({
        status: false,
        code: 201,
        message: errors.array()[0].msg,
        data: req.body,
      });
  }

  const { user_id, type, query_type, text_query } = req.body;
  
  
  const query_id = req.body.query_id || 0;
  const amount = parseFloat(req.body.amount) || 0;



  try {
    const ticketID = generateTicketID();
  

    await AdminQuery.create({
      type,
      query_type,
      query_id,
      status: 0,
      user_id: user_id,
      query: text_query,
      date: new Date(),
      ticketid: ticketID,
      amount,
    });

   await Notification.create({
      message: "New query request from User",
      user_id: user_id,
      title: "New Query Arrived",
      type: "query",
    });

    res.json({
      status: true,
      data: [],
      message: "We will resolve your query in 24 Hours",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "An error occurred",
        error: error.message,
      });
  }
};
