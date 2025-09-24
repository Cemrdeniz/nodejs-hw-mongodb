import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    console.log("Authorization header:", authHeader);  // <--- burada kontrol et

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw createHttpError(401, 'Access token missing');
    }

    // token'ı decode et ve kontrol et
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded);  // <--- burada da kontrol et

    req.user = { _id: decoded.userId };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    if (error.name === 'JsonWebTokenError') {
      next(createHttpError(401, 'Invalid access token'));
    } else if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Access token expired'));
    } else {
      next(error);
    }
  }
};

console.log("ACCESS_TOKEN_SECRET length:", process.env.ACCESS_TOKEN_SECRET?.length);

export default authenticate;
