import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'floodguard-himalayan-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    district: string;
  };
}

/**
 * Express Middleware verifying JWT Token
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Default fallback to CITIZEN role if no token passed (Public access)
    req.user = {
      id: 'USR-PUBLIC',
      name: 'Public Citizen',
      email: 'citizen@floodguard.org',
      role: 'CITIZEN',
      district: 'All Districts',
    };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token.' });
    }
    req.user = decoded as AuthenticatedRequest['user'];
    next();
  });
}

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 */
export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Role '${req.user.role}' is unauthorized to perform this operation. Allowed roles: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
}
