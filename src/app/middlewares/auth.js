import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Get auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Get token from auth header (remove "Bearer")
  // "Bearer xxx.xxx.xxx"
  const [, token] = authHeader.split(' ');

  // Try to decode token
  // if it fails, token is invalid
  // else, proceed to next middlewares
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Insert userId on req object
    // This will be used on following middlewares
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
