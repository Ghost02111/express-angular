import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(403).json(
    {
       message: 'You must enter token info' 
    });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ 
      message: 'Invalid token' 
    });
  }
};

export const authorizeRole = (roles) => (req, res, next) => {


  if (!roles.includes(req.user.role)) 
    {
      return res.status(403).json({ message: 'You cannot do this, you are a normal user.' });
    }
  next();
};
