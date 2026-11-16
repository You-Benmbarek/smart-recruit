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
        const decoded = jwt.verify(token, process.env.SecretKey);
       return { valid: true, expired: false, decoded };
    } catch (error) {
        if (error.name === "TokenExpiredError")
        {
            return { valid: false, expired: true, decoded: null };
        }
        else 
            {
                return { valid: false, expired: false, decoded: null };
            }
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
