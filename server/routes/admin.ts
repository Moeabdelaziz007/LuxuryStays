import express, { Request, Response } from 'express';
import { auth, db, verifyIdToken } from '../firebase-admin-simple';
import * as admin from 'firebase-admin';
import { UserRole } from '@shared/schema';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: string;
      };
    }
  }
}

const router = express.Router();

// Middleware to verify admin/property admin access
const requireAdmin = async (req: Request, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await verifyIdToken(token);
      
      // Fetch the user's role from Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      
      if (!userDoc.exists) {
        return res.status(403).json({ error: 'Forbidden - User does not exist' });
      }
      
      const userData = userDoc.data();
      const userRole = userData?.role;
      
      if (userRole !== UserRole.SUPER_ADMIN && userRole !== UserRole.PROPERTY_ADMIN) {
        return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
      }
      
      // Attach the verified user info to the request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: userRole,
      };
      
      next();
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to verify super admin only access
const requireSuperAdmin = async (req: Request, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await verifyIdToken(token);
      
      // Fetch the user's role from Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      
      if (!userDoc.exists) {
        return res.status(403).json({ error: 'Forbidden - User does not exist' });
      }
      
      const userData = userDoc.data();
      const userRole = userData?.role;
      
      if (userRole !== UserRole.SUPER_ADMIN) {
        return res.status(403).json({ error: 'Forbidden - Super Admin access required' });
      }
      
      // Attach the verified user info to the request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: userRole,
      };
      
      next();
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all users (Super Admin only)
router.get('/users', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (Super Admin only)
router.put('/users/:userId/role', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!role || !Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ error: 'Invalid role provided' });
    }
    
    // Update user role in Firestore
    await db.collection('users').doc(userId).update({
      role: role
    });
    
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Get system stats (Admin only)
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    // Get user stats
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;
    
    // Count users by role
    let usersByRole = {
      [UserRole.CUSTOMER]: 0,
      [UserRole.PROPERTY_ADMIN]: 0,
      [UserRole.SUPER_ADMIN]: 0
    };
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const role = userData?.role as UserRole;
      if (role && Object.values(UserRole).includes(role)) {
        usersByRole[role]++;
      }
    });
    
    // Get properties stats
    const propertiesSnapshot = await db.collection('properties').get();
    const totalProperties = propertiesSnapshot.size;
    
    // Get bookings stats
    const bookingsSnapshot = await db.collection('bookings').get();
    const totalBookings = bookingsSnapshot.size;
    
    // Get active bookings
    let activeBookings = 0;
    let completedBookings = 0;
    let cancelledBookings = 0;
    
    bookingsSnapshot.forEach(doc => {
      const bookingData = doc.data();
      const status = bookingData.status;
      
      if (status === 'confirmed') {
        activeBookings++;
      } else if (status === 'completed') {
        completedBookings++;
      } else if (status === 'cancelled') {
        cancelledBookings++;
      }
    });
    
    res.status(200).json({
      users: {
        total: totalUsers,
        byRole: usersByRole
      },
      properties: {
        total: totalProperties
      },
      bookings: {
        total: totalBookings,
        active: activeBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      }
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// Get health status (no auth required)
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Check Firebase connection
    let firebaseStatus = 'healthy';
    try {
      // Just try to access Firestore
      await db.collection('users').limit(1).get();
    } catch (error) {
      console.error('Firebase health check failed:', error);
      firebaseStatus = 'unhealthy';
    }
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        firebase: firebaseStatus
      },
      env: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

export default router;