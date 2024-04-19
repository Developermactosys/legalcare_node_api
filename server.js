// app.js

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
