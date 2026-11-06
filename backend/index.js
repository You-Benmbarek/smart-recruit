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



// Import routes tables
const userRouter = require('./Routers/userRouter');
app.use('/users', userRouter);

const candidateRouter = require('./Routers/candidateRouter');
app.use('/candidates', candidateRouter);

const companyRouter = require('./Routers/companyRouter');
app.use('/companies', companyRouter);

app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory (Frontend can access images via /uploads/filename)






