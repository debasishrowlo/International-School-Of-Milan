import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        message: 'No token provided',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded.userId) {
      throw new UnauthorizedError('Invalid token payload');
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error('Auth Error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default verifyToken;