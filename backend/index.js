const express = require('express');
const app = express();
const port = 3001;
const env = require('dotenv').config();



app.use(express.json());


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


const connectToDatabase = require('./database');
connectToDatabase();

