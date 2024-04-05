require('moment')
const db = require("../../../config/db.config")
const User =db.User; 
const ChatRequest = db.chat_request;
const chat = db.chat;
const call_details = db.call_details;
const ChatLog = db.chat_log;
const Sequelize = require('sequelize');
const axios = require('axios');
let users = {}
var FCM = require("fcm-node");
const serverkey = process.env.SERVER_KEY;
var fcm = new FCM(serverkey);
const sender_profile_image = process.env.IMAGE;

const handleUserData = async (socket, users, io) => {
    socket.on("user_data", async (data) => {
        try {
            await User.update(
                { connection_id: socket.id, is_busy: 1 },
                { where: { id: data.from_user_id } }
            );

            users[socket.id] = {
                id: data.from_user_id,
                customer_id: data.user_id,
                expert_id: data.astro_id,
                per_minute: data.astro_charge,
                amount: data.user_amount,
            };
            console.log('users array', users);
             const response = { id: data.from_user_id, status: 'Online', is_busy: 1 };
             socket.emit("user_status", response);
        } catch (error) {
            console.error("Error updating user:", error);
            // socket.emit("error", "An error occurred updating user status.");
        }
    });
};

function hmsToSeconds(s) {
    let parts = s.split(':'), seconds = 0;
    if (parts.length === 3) {
        seconds = (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
    }
    return seconds;
}

function secondsToHMS(secs) {
    let hours = Math.floor(secs / 3600);
    let minutes = Math.floor((secs % 3600) / 60);
    let seconds = secs % 60;
    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .join(":");
}

// Assuming 'getCurrent_time' is defined elsewhere or adjust this to use current time
function getCurrent_time() {
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta',
        hour12: false,
    });
    var formattedDate = nDate.split(', ')[1];
    var formattedDate= formattedDate.split(' ')[0]

    return formattedDate
}

const handleTimer = async (socket, io) => {
    socket.on("timer", async (data) => {
        try {
            const chatRequest = await ChatRequest.findOne({
                where: {
                    from_user_id: data.UserId,
                    to_user_id: data.astroid,
                    status: "Approve"
                },
                order: [['id', 'DESC']],
                limit: 1
            });

            if (chatRequest) {
                let start_time = chatRequest.approve_time.toISOString().split('T')[1].split('.')[0];
                let end_time = getCurrent_time();
                let t1 = hmsToSeconds(start_time);
                let t2 = hmsToSeconds(end_time);
                let diff = secondsToHMS(t2 - t1);
                
                if (parseInt(data.max_time) <= parseInt(diff.split(':')[0])) {
                    io.emit("times_up_disconnect", data);
                } else {
                    data.time = diff;
                    io.emit("timer_value", data);
                }
            }
        } catch (error) {
            console.error("Error fetching chat request:", error);
            // Handle the error appropriately, maybe notify the client
            // socket.emit("error", "An error occurred with the timer.");
        }
    });
};


const handleUserStatusWeb = async (socket, io) => {
    socket.on("user_status_web", async (data) => {
        try {
            // Assuming `data` contains `userId` and `status`
            await User.update({ status: data.status }, { where: { id: data.user_id } });

            // After successfully updating the user's status, emit the update to all connected clients
            io.emit("user_status", data);
        } catch (error) {
            console.error("Failed to update user status", error);
            // Handle error appropriately
            // For example, you could emit an error event to the client:
            // socket.emit("error", "Failed to update user status.");
        }
    });
};


const handleRequestSending = async (socket, io) => {
    socket.on("send_request", async (data) => {
        try {
            const createdRequest = await chat.create({
                from_user_id: data.senderId,
                to_user_id: data.receiverId,
                // Add other fields as necessary
            });

            // Emit the "incoming_request" event with the necessary data
            io.emit("incoming_request", {
                ...data,
                request_id: createdRequest.id, // Assuming the created object has an id field
            });
        } catch (error) {
            console.error("Error saving request to database", error);
            // Here you could emit an error to the client if needed
            // socket.emit("request_error", "Failed to send request.");
        }
    });
};


const handleAcceptRequest = async (socket, io) => {
socket.on("accept_request", async (data) => {
    try {
        const chatRequest = await ChatRequest.findOne({
            where: {
                from_user_id: data.user_id,
                to_user_id: data.astro_id,
                status: 'Pending'
            },
            order: [['id', 'DESC']],
            limit: 1
        });

        if (chatRequest) {
            data.key = chatRequest.key; // Assuming 'key' is a field in your ChatRequest model
            console.log("accept_request_response", data);
            io.emit("accept_request_response", data);
        } else {
            // Handle the case where no matching chat request is found
            console.log("No pending chat request found");
            // Optionally emit an event to inform the client
            // socket.emit("no_pending_request", "No pending request found.");
        }
    } catch (error) {
        console.error("Error processing accept_request:", error);
        // Handle error appropriately, for example, by emitting an error event to the client
        // socket.emit("error_accepting_request", "Error processing your request.");
    }
});
}


const handleAstroRequest = async (socket, io) => {
socket.on("accept_astro_request", async (data) => {
    try {
        const chatRequest = await ChatRequest.findOne({
            where: {
                from_user_id: data.user_id,
                to_user_id: data.astro_id,
                status: "Waiting"
            },
            order: [['id', 'DESC']],
        });

        if (chatRequest) {
            data.key = chatRequest.key; // Assuming 'key' is a field in your ChatRequest model
            console.log("********accept_astro_request*************", data);

            io.emit("accept_astro_request_response", data);
        } else {
            // Handle the case where no matching chat request is found
            console.log("No waiting chat request found");
            // Optionally emit an event to inform the client
            // socket.emit("no_waiting_request", "No waiting request found.");
        }
    } catch (error) {
        console.error("Error processing accept_astro_request:", error);
        // Handle error appropriately, for example, by emitting an error event to the client
        // socket.emit("error_accepting_astro_request", "Error processing your request.");
    }
});
}

const handleChatHistory = async (socket) => {
socket.on("chat_history", async (data) => {
    try {
        // Assuming Message is your Sequelize model for the 'message' table
        const messages = await chat.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { 
                        from_user_id: data.from_user_id, 
                        to_user_id: data.to_user_id 
                    },
                    { 
                        to_user_id: data.from_user_id, 
                        from_user_id: data.to_user_id 
                    }
                ]
            },
            raw: true
        });

        var new_data = {
            // from_user_id: data.from_user_id,
            // to_user_id: data.to_user_id,
            data: messages
        };

        socket.emit("chat_data", new_data); // Changed socketIO to socket based on your variable name consistency
    } catch (error) {
        console.error("Error fetching chat history:", error);
        // Handle error appropriately, maybe send an error message back to the client
        // socket.emit("error", "Failed to fetch chat history");
    }
});
}


async function fetchChatHistory(socket, data) {
    try {
        const messages = await ChatRequest.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { 
                        from_user_id: data.from_user_id, 
                        to_user_id: data.to_user_id 
                    },
                    { 
                        from_user_id: data.to_user_id, 
                        to_user_id: data.from_user_id 
                    }
                ]
            },
            raw: true
        });

        var new_data = {
            from_user_id: data.from_user_id,
            to_user_id: data.to_user_id,
            data: messages
        };

        socket.emit("chat_data", new_data); // Emitting to the requesting client only
    } catch (error) {
        console.error("Error fetching chat history:", error);
        // Optionally, send an error message back to the client
        socket.emit("error", "Failed to fetch chat history");
    }
}

// Function to handle typing notifications
function handleTyping(socket, data) {
    socket.broadcast.emit("typingResponse", data); // Broadcast to all clients except the sender
}


async function handleForceDisconnect(socket, data) {
    try {
        // Update users using Sequelize's update method
        await User.update(
            { connection_id: 0, is_busy: 0 },
            { where: { id: [data.from_user_id, data.to_user_id] } }
        );

        data.end_time = getCurrent_time(); // Ensure this function is defined or replaced with an equivalent
        data.comment = 'Done';
        console.log('data axios sending', data);

        // // Make the HTTP request using axios
        // const response = await axios.post('http://134.209.229.112/astrology_new/api/deduct_amount', { data: data }, {
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        // });

        // console.log('axios response', response.data);
        var resp = { id: data.astroid, status: 'Online', is_busy: 0 };
        socket.emit("user_status", resp); // Emit to the socket instance if meant for the current connection
        socket.emit("end_chat_web", data); // Adjust according to your needs

    } catch (error) {
        console.error(error);
    }
}

async function checkIsBusyHandler(socket, data) {
    try {
        const user = await User.findOne({
            where: {
                is_busy: 1,
                id: data.id
            },
            include: [{
                model: ChatRequest,
                as: 'chat_request',
                where: {
                    status: 'Approve',
                    is_busy: 1
                },
                order: [['id', 'DESC']],
                limit: 1,
                include: [{
                    model: User,
                    as: 'User'
                }]
            }]
        });

        if (user && user.chat_request && user.chat_request.length > 0) {
            const chatRequest = user.chat_request[0];
            const associatedUser = chatRequest.User;

            // Preparing data for the response
            data.name = associatedUser.name;
            data.profile_image = associatedUser.profile_image;
            if (data.type == 2) {
                data.from_user_id = chatRequest.to_user_id;
                data.to_user_id = chatRequest.from_user_id;
            } else {
                data.from_user_id = chatRequest.from_user_id;
                data.to_user_id = chatRequest.to_user_id;
            }
            data.key = chatRequest.key;
            data.user_type = chatRequest.msg; // Adjust according to your data structure

            console.log('check_is_busy============>', data);
            socket.emit("chat_busy", data); // Note: Adjust the socket instance if necessary
        }
    } catch (err) {
        console.error("Error querying database: ", err);
    }
}
const handleApproveWaitingStatus = async (socket, io, User) => {
    socket.on("approve_waiting_status", async (data) => {
        if (data.status === 'Approve') {
            try {
                const user = await User.findOne({
                    where: { id: data.astro_id }
                });

                if (user) {
                    // User found
                    data.name = user.name;
                    data.profile_image = user.profile_image;
                    io.emit("approve_waiting_resp", data);
                } else {
                    // No user found
                    console.log("No user found with id:", data.astro_id);
                    // Optionally, emit an event to inform the operation's outcome
                }
            } catch (err) {
                console.error("Error querying user:", err);
                // Optionally, emit an event to inform the client of the error
            }
        } else {
            io.emit("approve_waiting_resp", data);
        }
    });
};

const handleCallStatus = async (socket, io, CallDetail) => {
    socket.on("call_status", async (data) => {
        console.log("call status calling", data);

        // Determine the correct where condition based on user_type
        let whereCondition = data.user_type == 2 ? { export_id: data.id, call_data: ' ' } : { customer_id: data.id, call_data: ' ' };

        try {
            const callDetail = await call_details.findOne({
                where: whereCondition,
                order: [['id', 'DESC']] // Order by 'id' descending to get the latest record
            });

            if (callDetail) {
                // Call detail found
                data.call_sid = callDetail.call_sid;
                io.emit("call_status_resp", data);
            } else {
                // No call detail found
                console.log("No call detail found for condition:", whereCondition);
                // Optionally, emit an event to inform the operation's outcome
            }
        } catch (err) {
            console.error("Error querying call details:", err);
            // Optionally, emit an event to inform the client of the error
        }
    });
};

const handleDisconnect = async (socket, users, ChatLog, getCurrent_time) => {
    socket.on("disconnect", async () => {
        console.log(users[socket.id]);
        if (users[socket.id] !== undefined) {
            try {
                await ChatLog.update({
                    end_time: getCurrent_time(),
                    comment: "unexpected Close",
                    status: 0 // Assuming you want to set the status to 0 as part of the update
                }, {
                    where: {
                        customer_id: users[socket.id].user_id,
                        expert_id: users[socket.id].astro_id,
                        status: 0 // Include if you're only updating records where status is 0
                    }
                });
                delete users[socket.id];
            } catch (err) {
                console.error("Error updating chat logs on disconnect:", err);
            }
        }
    });
};

function isEmpty(obj) {
    return !Object.keys(obj).length > 0;
  }

function getCurrentDate() {

    //let parsedDate =  new Date()
    //const formattedDate = `${parsedDate.getHours()}:${parsedDate.getMinutes()}`

    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
    });
    var formattedDate = nDate.split(', ')[0].split('/')[2] + '-' + nDate.split(', ')[0].split('/')[0] + '-'+ nDate.split(', ')[0].split('/')[1];

    return formattedDate
}   

function hmsToSeconds(s) {
    var b = s.split(':');
    return b[0]*3600 + b[1]*60 + (+b[2] || 0);
  }
  
    // Convert seconds to hh:mm:ss
    function secondsToHMS(secs) {
        function z(n){
            var n=(n<10?'0':'') + n
            return n;
        }
        var sign = secs < 0? '-':'';
    
        secs = Math.abs(secs);
    
        return  z((secs%3600) / 60 |0) + ':' + z(secs%60);
        // return sign + z(secs/3600 |0) + ':' + z((secs%3600) / 60 |0) + ':' + z(secs%60);
      }
function getCurrentTime() {

    //let parsedDate =  new Date()
    //const formattedDate = `${parsedDate.getHours()}:${parsedDate.getMinutes()}`

    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
    });
    var formattedDate = nDate.split(', ')[1].split(':')[0] + ':' + nDate.split(', ')[1].split(':')[1] + ' '+ nDate.split(', ')[1].split(' ')[1];

    return formattedDate
}

function getCurrent_time() {

    //let parsedDate =  new Date()
    //const formattedDate = `${parsedDate.getHours()}:${parsedDate.getMinutes()}`

    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta',
        hour12: false,
    });
    var formattedDate = nDate.split(', ')[1];
    var formattedDate= formattedDate.split(' ')[0]

    return formattedDate
}

// // Define a function to handle sending messages
// const sendMessage = async (data, socket) => {
//     try {
//       // Check if the message type is text
//       if (data.message_type === 'text') {
//         // Fetch the connection_id of the recipient user
//         const recipient = await User.findOne({
//           attributes: ['connection_id'],
//           where: { id: data.to_user_id }
//         });
  
//         // Insert the message into the database
//         const message = await chat.create({
//             from_user_id: data.from_user_id,
//             to_user_id: data.to_user_id,
//             chat_message: data.message,
//             message_status: data.message_status,
//             unread_msg:data.unread_msg,
//             message_type :data.message_type,
//             message_date: getCurrentDate(),
//             message_time: getCurrentTime()
//         });
//   if(data.image){
//     message.image= data.image;
//     await message.save();
//   }
//         // Emit the message data
//         data.id = message.id;
//         data.message_time = getCurrentTime();
//         if (recipient && recipient.connection_id) {
//           socket.to(recipient.connection_id).emit("message_data", data);

//         //   console.log("message_data", data);

//         } else {
//           // If recipient not found or connection_id is null, emit to all sockets
//           socket.emit("message_data", data);
//         //   console.log("error : message_data", data);

//         }
//       } else {
//         // Handle other message types here
//         data.id = 0;
//         data.message_time = getCurrentTime();
//         socket.emit("message_data", data);
//       }
//     //   return socket.status(200).json({
//     //     status : true
//     //   })
//     } catch (error) {
//       console.error(error);
//       // Handle errors here
//     }
//   };

const sendMessage = async (data, socket) => {
    try {
      // Check if the message type is text
      if (data.message_type === 'text') {
        // Fetch the connection_id of the recipient user
        const recipient = await User.findOne({
          attributes: ['connection_id'],
          where: { id: data.to_user_id }
        });
          
        // Insert the message into the database
        const message = await chat.create({
            from_user_id: data.from_user_id,
            to_user_id: data.to_user_id,
            chat_message: data.message,
            message_status: data.message_status,
            unread_msg:data.unread_msg,
            message_type :data.message_type,
            message_date: getCurrentDate(),
            message_time: getCurrentTime()
        });

          const find_receiver_id = message.to_user_id
          console.log(find_receiver_id)
          const find_user = await User.findByPk(find_receiver_id)
          const find_sender = await User.findByPk(message.from_user_id)
          const receiver_device_id = find_user.device_id
          const sender_name = find_sender.name
          console.log(receiver_device_id, sender_name);
              var messages = {
                to: receiver_device_id,
                collapse_key: "green",

                notification: {
                  title: `${sender_name}`,
                  body: `${message.chat_message}`,
                  priority: "high",
                  image: `${sender_profile_image}${find_sender.profile_image}`,
                },
              };
           fcm.send(messages, function (err, response) {
             if (err) {
               console.log("Something Has Gone Wrong !", err);
               return res.status(200).json({
                 success: false,
                 message: err.messages,
               });
             } else {
               console.log("Successfully Sent With Resposne :", response);
               var body = messages.notification.body;
               console.log(
                 "notification body for add order <sent to manager>",
                 body
               )
             }
           });
          
  if(data.image){
    message.image= data.image;
    await message.save();
  }
        // Emit the message data
        data.id = message.id;
        data.message_time = getCurrentTime();
        if (recipient && recipient.connection_id) {
          socket.to(recipient.connection_id).emit("message_data", data);

        //   console.log("message_data", data);

        } else {
          // If recipient not found or connection_id is null, emit to all sockets
          socket.emit("message_data", data);
        //   console.log("error : message_data", data);

        }
      } else {
        // Handle other message types here
        data.id = 0;
        data.message_time = getCurrentTime();
        socket.emit("message_data", data);
      }
    //   return socket.status(200).json({
    //     status : true
    //   })
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };

  const updateMessageStatus = async (data,socket) => {
    try {
       const user = await chat.update(
            {
                message_status: data.message_status,
                unread_msg: data.unread_msg
            },
            {
                where: {
                    [Sequelize.Op.or]: [
                      { 
                        from_user_id: data.from_user_id,
                        to_user_id: data.to_user_id
                      },
                      { 
                        from_user_id: data.to_user_id,
                        to_user_id: data.from_user_id
                      },
                   ]
                  },
            }
            // { where: { id: data.id } }
        );
      
        console.log("User == ",user)
        console.log("Data == ",data)

        // Assuming socketIO is defined elsewhere
        socket.emit("update_message_data", data);

    } catch (error) {
        // Handle errors here
        console.error("Error updating message status:", error);
    }
};


module.exports = { 
    
    handleUserData, 
    handleTimer, 
    handleUserStatusWeb, 
    handleRequestSending, 
    handleAcceptRequest,
    handleAstroRequest,
    handleChatHistory,
    fetchChatHistory,
    handleTyping,
    handleForceDisconnect,
    checkIsBusyHandler,
    handleApproveWaitingStatus,
    handleCallStatus,
    handleDisconnect ,
    sendMessage,
    updateMessageStatus,
 
    
};
