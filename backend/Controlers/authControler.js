const {generateAccessToken, generateRefreshToken} = require('../utils/jwt');
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
    try {
        // Find the user by email
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'Email user not found' });
        }
        // check the password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // Store the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({ message: 'Login successful', data: { accessToken, refreshToken }});
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};


const logoutUser = async (req, res) => {
    try {
        // recupere the refresh token from the request body
        const { refreshToken } = req.body;
        // Find the user by refresh token
        const user = await userModel.findOne({ refreshToken });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Clear the refresh token
        user.refreshToken = null;
        await user.save();
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed' });
    }   
}





module.exports = {
    loginUser,
    logoutUser  
};

