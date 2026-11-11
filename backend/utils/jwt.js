const jwt = require('jsonwebtoken');



const generateAccessToken = (user) => {
    const payload = { fullName: user.fullName, email: user.email, role: user.role };
    return jwt.sign(payload, process.env.SecretKey, { expiresIn: process.env.AccessTokenExpire });
};

const generateRefreshToken = (user) => {
    const payload = { fullName: user.fullName, email: user.email, role: user.role };
    return jwt.sign(payload, process.env.SecretKey, { expiresIn: process.env.RefreshTokenExpire });
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.SecretKey);
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.SecretKey);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};  
