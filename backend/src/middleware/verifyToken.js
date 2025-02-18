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
    const token = req.cookies.token;
    //const authHeader = req.headers.authorization;
    //const token = authHeader.split(" ")[1];
    //console.log("requested Token : ", token)

    if (!token) {
      return res.status(401).json({
        message: 'No token provided',

      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded", decoded)
    if (!decoded.userId) {
      throw new UnauthorizedError('Invalid token payload');
    }
    //
    //const user = User.findById(decoded.userId);
    //
    //if (!user) {
    //  throw new UnauthorizedError('User not found');
    //}

    // Set user info on request object

    //console.log("before setting user role ")
    req.user = decoded;
    //console.log("after setting user role ....")
    //req.user = user;
    console.log('Req, user', req.user.role)


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

export default verifyToken;
