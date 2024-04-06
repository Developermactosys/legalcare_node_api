// // app.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const multer = require("multer");
// const app = express();

// const path = require('path');
// // const { Server } = require('socket.io');
// const cookieParser = require('cookie-parser');
// // const server = http.createServer(app);
// // const io = new Server(server);
// const cors = require("cors");


// const http = require("http").Server(app);
// const socketIO = require("socket.io")(http, {

//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// const corsOption = {
//     credentials: true,
//     origin: '*',
// };
// app.use(cors(corsOption));

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static("src/uploads"));
// app.use(cookieParser());
// // app.use(multer().none());


// const handleUserData = require('./src/controller/socket_controller/socket.controller')
// const handleTimer = require('./src/controller/socket_controller/socket.controller')
// const handleUserStatusWeb = require('./src/controller/socket_controller/socket.controller')
// const handleRequestSending = require('./src/controller/socket_controller/socket.controller')
// const handleAcceptRequest = require('./src/controller/socket_controller/socket.controller')
// const handleAstroRequest = require('./src/controller/socket_controller/socket.controller')
// const handleChatHistory = require('./src/controller/socket_controller/socket.controller')
// const fetchChatHistory = require('./src/controller/socket_controller/socket.controller')
// const handleTyping = require('./src/controller/socket_controller/socket.controller')
// const handleForceDisconnect = require('./src/controller/socket_controller/socket.controller')
// const checkIsBusyHandler = require('./src/controller/socket_controller/socket.controller')
// const handleApproveWaitingStatus = require('./src/controller/socket_controller/socket.controller')
// const handleCallStatus = require('./src/controller/socket_controller/socket.controller')
// const handleDisconnect = require('./src/controller/socket_controller/socket.controller')

// // Routes
// const Routes = require('./src/routes/main.routes');

// // Add more route files as needed

// app.use('/', Routes);

// app.get('/', (req, res, next) => {
//     try {
//         res.json({
//             status: 'success',
//             message: 'Server is on Listning :"' + process.env.PORT + '" ',
//         });
//     } catch (err) {
//         return next(err);
//     }
// });
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// // Socket.io
// // io.on('connection', (socket) => {
// //     socket.on('userMessage', (message) => {
// //         // Consider saving the message to your database here
// //         io.emit('message', message);
// //     });
// // });
// // Socket.io
// let users = {}
// socketIO.on('connection', (socket) => {
    
//     handleUserData(socket, users, io);
//     handleTimer(socket, io);
//     handleUserStatusWeb(socket, io);
//     handleRequestSending(socket, io);
//     handleAcceptRequest(socket, io);
//     handleAstroRequest(socket, io);
//     handleChatHistory(socket);
//     fetchChatHistory(socket, data);

//     socket.on('typing', (data) => {
//         handleTyping(socket, data);
//     });

//     socket.on('force_disconnect', async (data) => {
//         await handleForceDisconnect(socket, data);
//     });

//     socket.on('check_is_busy', async (data) => {
//         await checkIsBusyHandler(socket, data);
//     });

//     socket.on("approve_waiting_status", (data) => handleApproveWaitingStatus(socket, io, users, data));
//     socket.on("call_status", (data) => handleCallStatus(socket, io, CallDetail, data));
//     socket.on('disconnect', () => handleDisconnect(socket, users));

// });


// // Start server
// const PORT = process.env.PORT || 7878;
// http.listen(PORT, () => {
//     console.log(`Server & Socket.io is running on port ${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
const {Server} = require("socket.io");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src", "uploads")));
app.use(cookieParser());
app.use(cors());

// Import controller functions
const {
    handleUserData,
    handleAstroRequest,
    handleChatHistory,
    fetchChatHistory,
    handleTyping,
    handleForceDisconnect,
    checkIsBusyHandler,
    handleApproveWaitingStatus,
    handleCallStatus,
    handleDisconnect,
    handleTimer,
    handleUserStatusWeb,
    handleRequestSending,
    handleAcceptRequest, 
    sendMessage,
    updateMessageStatus
} = require('./src/controller/socket_controller/socket.controller');

const Routes = require('./src/routes/main.routes');



// Socket.io connection handler
let users = {};
io.on('connection', (socket) => {
    handleUserData(socket, users, io);
    handleTimer(socket, io);
    handleUserStatusWeb(socket, io);
    handleRequestSending(socket, io);
    handleAcceptRequest(socket, io);
    handleAstroRequest(socket, io);
    handleChatHistory(socket);

    socket.on('fetch_chat_history', (data) => {
        fetchChatHistory(socket, data);
    });

    socket.on('typing', (data) => {
        handleTyping(socket, data);
    });

    socket.on('force_disconnect', async (data) => {
        await handleForceDisconnect(socket, data);
    });

    socket.on('check_is_busy', async (data) => {
        await checkIsBusyHandler(socket, data);
    });

    socket.on("approve_waiting_status", (data) => handleApproveWaitingStatus(socket, io, users, data));
    socket.on("call_status", (data) => handleCallStatus(socket, io, data));
    
    socket.on('disconnect', () => {
        handleDisconnect(socket, users);
    });
    socket.on("message", (data) => {
        sendMessage(data, socket);
      });
    socket.on("update_message_status", (data) => {
    updateMessageStatus(data,socket);
});

});

app.use('/', Routes);

app.get("/",(req,res)=>{
    res.send("Hello lynklegal, Server & Socket.io is running on port : 7878")

})
// Start server
const PORT = process.env.PORT || 7878;
server.listen(PORT, () => {
    console.log(`Server & Socket.io is running on port ${PORT}`);
});
