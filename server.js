// app.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require("multer");
const app = express();

const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const io = new Server(server);
const cors = require("cors");

const corsOption = {
    credentials: true,
    origin: '*',
};
app.use(cors(corsOption));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("src/uploads"));
app.use(cookieParser());
// app.use(multer().none());



// Routes
const Routes = require('./src/routes/main.routes');

// Add more route files as needed

app.use('/', Routes);

app.get('/', (req, res, next) => {
    try {
        res.json({
            status: 'success',
            message: 'Server is on Listning :"' + process.env.PORT + '" ',
        });
    } catch (err) {
        return next(err);
    }
});

// Socket.io
io.on('connection', (socket) => {
    socket.on('userMessage', (message) => {
        // Consider saving the message to your database here
        io.emit('message', message);
    });
});

// Start server
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
