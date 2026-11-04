const mongoose = require('mongoose');
//const env = require('dotenv').config;

const connectToDatabase =  () => {
    try {
        mongoose.connect(process.env.url)
        console.log('Connected to the database')

        }
        
     catch (error) 
    {
        console.error('Error connecting to the database:', error);
    }           
}


module.exports = connectToDatabase;
