# StayX User Roles Guide

This document provides a comprehensive overview of the user role system in the StayX platform, including role-based access control, authentication flows, and typical user journeys.

## Role Types

StayX has three primary user roles:

1. **CUSTOMER** - Regular users who book properties and use services
2. **PROPERTY_ADMIN** - Users who manage properties and bookings
3. **SUPER_ADMIN** - Platform administrators with full access

## Authentication Implementation

The application uses Firebase Authentication with custom claims to manage roles:

```javascript
// Setting a user's role in Firebase Auth
await admin.auth().setCustomUserClaims(uid, { role: 'CUSTOMER' });
await admin.auth().setCustomUserClaims(uid, { role: 'PROPERTY_ADMIN' });
await admin.auth().setCustomUserClaims(uid, { role: 'SUPER_ADMIN' });
```

## Role-Based Access Control

Access control is implemented using the `RoleGuard` component:

```jsx
<RoleGuard allowedRoles={["CUSTOMER", "PROPERTY_ADMIN"]}>
  <ProtectedComponent />
</RoleGuard>
```

The `RoleGuard` implementation checks the user's role from Firebase Authentication custom claims:

```typescript
export function RoleGuard({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[] | string;
}) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (!isLoading && user) {
      const userRole = user.role || 'CUSTOMER';
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      if (!roles.includes(userRole)) {
        navigate('/no-access');
      }
    }
  }, [user, isLoading, allowedRoles, navigate]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return null;
  }
  
  const userRole = user.role || 'CUSTOMER';
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!roles.includes(userRole)) {
    return null;
  }
  
  return <>{children}</>;
}
```

## Registration Flow

1. User completes registration form
2. Firebase Authentication creates new user
3. Cloud Function triggers on user creation:
   - Creates user record in Firestore
   - Sets default role as 'CUSTOMER' via custom claims
4. User is redirected to appropriate dashboard based on role

## Role Elevation Process

To elevate a user from CUSTOMER to PROPERTY_ADMIN:

1. User applies for property admin status
2. SUPER_ADMIN reviews application
3. If approved, SUPER_ADMIN updates user role:
   ```javascript
   // In admin panel
   async function updateUserRole(uid, newRole) {
     await admin.auth().setCustomUserClaims(uid, { role: newRole });
     await db.collection('users').doc(uid).update({ role: newRole });
   }
   ```

## Access Control Matrix

| Feature | CUSTOMER | PROPERTY_ADMIN | SUPER_ADMIN |
|---------|----------|----------------|-------------|
| View Properties | ✓ | ✓ | ✓ |
| Book Properties | ✓ | ✓ | ✓ |
| Create Properties | ✗ | ✓ | ✓ |
| Manage Own Properties | ✗ | ✓ | ✓ |
| Manage All Properties | ✗ | ✗ | ✓ |
| View Own Bookings | ✓ | ✓ | ✓ |
| Manage Property Bookings | ✗ | ✓ | ✓ |
| Access ChillRoom | ✓ | ✓ | ✓ |
| Customer Dashboard | ✓ | ✗ | ✓ |
| Property Dashboard | ✗ | ✓ | ✓ |
| Admin Dashboard | ✗ | ✗ | ✓ |
| Manage Users | ✗ | ✗ | ✓ |
| System Configuration | ✗ | ✗ | ✓ |

## Test Accounts

For testing the different user roles, the following accounts have been set up:

1. **Customer**:
   - Create via standard registration

2. **Property Admin**:
   - Email: "amrikyy1@gmail.com"
   - UID: "UtrbHH8i53czbRKKzxCAN8mtocZ2"

3. **Super Admin**:
   - Email: "amrikyy@gmail.com"
   - UID: "W09aDSV1Z7esozpK35Co5DKPBvT2"

## Common Role-Related Issues and Solutions

### 1. User Not Seeing Role-Specific Content

**Problem**: User has been assigned a role but cannot see role-specific content.

**Solution**: 
- Check that custom claims have been set properly
- Force refresh the ID token: 
  ```javascript
  await firebase.auth().currentUser.getIdToken(true)
  ```
- Verify RoleGuard is using correct role names

### 2. Delayed Role Updates

**Problem**: Role updates are not immediately reflected.

**Solution**:
- Firebase custom claims can take up to an hour to propagate
- Use force refresh technique above
- Implement a logout/login flow after role changes

### 3. Firebase Rules Not Working with Roles

**Problem**: Firestore or Storage security rules not correctly applying based on roles.

**Solution**:
- Verify security rules syntax is correct
- Ensure rules are checking `request.auth.token.role`
- Test rules in the Firebase emulator

## Role Transition Workflows

### Customer to Property Admin Transition

1. Customer submits property admin application
2. Application is reviewed by super admin
3. If approved, super admin updates role
4. System notifies user of role change
5. User logs out and back in to refresh token
6. User now has access to property admin features

### Property Admin Dashboard Features

Once a user becomes a property admin, they gain access to:

1. Property management dashboard
2. Property creation and editing tools
3. Booking management for their properties
4. Analytics for their properties
5. Income tracking and payout settings

## Security Considerations

- Regularly audit user roles for appropriate access
- Implement timeout for inactive super admin sessions
- Use Firebase App Check to prevent unauthorized API access
- Apply principle of least privilege when assigning roles
- Log all role change operations for security auditing