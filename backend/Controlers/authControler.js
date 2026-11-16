const {generateAccessToken, generateRefreshToken} = require('../utils/jwt');
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const {forgotPasswordEmail} = require('../utils/sendEmail');
const crypto = require('crypto');


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
};

const forgotUserPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate resetToken and store in database with expiration
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        await user.save();

        // Generate a reset link (this would typically involve creating a unique token and storing it)
        const resetLink = `${process.env.APP_URL}/reset-password/${user.resetToken}`;
        
        // Send the forgot password email
        await forgotPasswordEmail(user.email, user.fullName, resetLink);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error in forgotUserPassword:', error);
        res.status(500).json({ message: 'Failed to send password reset email' });
    }
};


const resetPassword = async (req, res) => {
    try {
        const token = req.params.token || req.body.token || req.body.resetToken;
        const { password, confirmPassword } = req.body; // Saisie dans le Link

        if (!token) {
            return res.status(400).json({ message: 'Reset token is required' });
        }

        if (!password || !confirmPassword) {
            return res.status(400).json({ message: 'Password and confirmPassword are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const user = await userModel.findOne({ resetToken: token }); //get user with token

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired reset token' });
        }

        if (!user.resetTokenExpiration || new Date() > new Date(user.resetTokenExpiration)) {
            user.resetToken = null;
            user.resetTokenExpiration = null;
            await user.save();
            return res.status(400).json({ message: 'Reset token has expired' });
        } //l'utilisateur en retard

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();
        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({ message: 'Failed to reset password' });
    }
};

module.exports = {
    loginUser,
    logoutUser,
    forgotUserPassword,
    resetPassword
};


