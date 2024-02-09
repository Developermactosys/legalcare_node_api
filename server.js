// app.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require("multer");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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
// Start server
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
