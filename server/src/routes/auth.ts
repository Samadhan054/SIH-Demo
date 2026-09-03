import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/authMiddleware.js';
import { User, UserRole } from '../types.js';

const router = Router();

const demoUsers: User[] = [
  {
    id: 'USR-ADMIN',
    name: 'Dr. Ramesh Sharma',
    email: 'admin@floodguard.gov.in',
    role: 'ADMIN',
    district: 'National Ops (New Delhi)',
  },
  {
    id: 'USR-RESCUE',
    name: 'Capt. Bikram Gurung',
    email: 'rescue@floodguard.gov.in',
    role: 'RESCUE_TEAM',
    district: 'Sindhupalchok & Uttarakhand',
    teamId: 'TEAM-01',
  },
  {
    id: 'USR-GOVT',
    name: 'Smt. Sunita Verma (CWC Director)',
    email: 'director@cwc.gov.in',
    role: 'GOVERNMENT',
    district: 'Central Water Commission',
  },
  {
    id: 'USR-CITIZEN',
    name: 'Pema Sherpa',
    email: 'pema@citizen.org',
    role: 'CITIZEN',
    district: 'Sindhupalchok',
  },
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { role, username, password } = req.body;
  const targetRole = (role as UserRole) || 'CITIZEN';

  // Prototype credentials replaceable with DB auth
  if (username !== 'Flash Flood' || password !== '123456789') {
    return res.status(401).json({ error: 'Access Denied. Invalid username or password.' });
  }

  const user = demoUsers.find((u) => u.role === targetRole) || {
    id: `USR-${Date.now()}`,
    name: username || `${targetRole} User`,
    email: `${targetRole.toLowerCase()}@floodguard.org`,
    role: targetRole,
    district: 'All Districts',
  };

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      district: user.district,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    user,
    token,
  });
});

export default router;
