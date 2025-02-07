const jwt = require('jsonwebtoken');
const User = require('../model/user.model.js');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    console.log("requestData", token)

    if (!token) {
      res.status(401).json({
        message: 'No token provided',
        token,
        requestData

      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded", decoded)
    if (!decoded.userId) {
      throw new UnauthorizedError('Invalid token payload');
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Set user info on request object
    req.role = decoded.role;
    req.user = user;
    console.log('Req, user', req.user)

    // Continue to next middleware/route handler
    next();

  } catch (error) {
    console.error('Auth Error:', error);

    // Handle different types of errors appropriately
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = verifyToken;
