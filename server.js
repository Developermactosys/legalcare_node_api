// app.js
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public", "uploads")));
app.use(cookieParser());
app.use(cors());


const Routes = require('./src/routes/main.routes');

app.use('/', Routes);


app.get("/",(req,res)=>{
    res.send("Hello ForMaxi, Server  is running on port : 7070")

})
// Start server
const PORT = process.env.PORT || 7070;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
