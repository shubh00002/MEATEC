import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function generateToken(userId: number | string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}
