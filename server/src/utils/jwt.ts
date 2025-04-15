import jwt from 'jsonwebtoken';
import { DecodedToken } from '../types/types';


export const decodeJWT = (token: string, secret: string): DecodedToken => {
  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Failed to decode token');
  }
};
