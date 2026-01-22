# Authentication & Authorization System

Complete authentication and authorization implementation with Role-Based Access Control (RBAC).

## Features Implemented

### 1. User Authentication
- ✅ Login with email/password
- ✅ User signup with role selection
- ✅ Password reset flow (forgot password + reset)
- ✅ User profile management
- ✅ Session management with Supabase Auth

### 2. Role-Based Access Control (RBAC)
- ✅ 5 User Roles: admin, manager, support, editor, customer
- ✅ Granular permission system (20+ permissions)
- ✅ Route-level protection with middleware
- ✅ Component-level permission checks
- ✅ UI elements hidden based on permissions

### 3. Pages Created

#### Authentication Pages
- `/admin/login` - User login (enhanced with links)
- `/admin/signup` - New user registration with role selection
- `/admin/forgot-password` - Request password reset email
- `/admin/reset-password` - Complete password reset with token
- `/admin/profile` - User profile and password management

### 4. Core Components

#### Hooks
- `useAuth` - Authentication state management
  - Returns: `{user, role, isAuthenticated, loading, signOut}`
  - Automatically subscribes to auth state changes
  
- `usePermissions` - Permission checking
  - Returns: `{hasPermission, hasAnyPermission, hasAllPermissions, canAccessAdmin}`
  - Works with current user's role

#### Components
- `ProtectedRoute` - Full-page route protection with redirect
- `ProtectedContent` - Conditional content rendering without redirect
- `UserMenu` - User dropdown menu with profile and logout
- `AdminSidebar` - Enhanced with user info and permission filtering

### 5. Permission System

#### Roles (Hierarchical)
```typescript
admin      // Full access to everything
manager    // Orders, quotes, products, partners
support    // View and update orders/quotes
editor     // Create and edit content
customer   // Limited public access
```

#### Permissions
```typescript
// Quotes
"quotes.view", "quotes.create", "quotes.edit", "quotes.delete"

// Orders
"orders.view", "orders.create", "orders.edit", "orders.delete"

// Products
"products.view", "products.create", "products.edit", "products.delete"

// Partners
"partners.view", "partners.create", "partners.edit", "partners.delete"

// Content
"content.view", "content.create", "content.edit", "content.delete"

// Settings
"settings.view", "settings.manage"

// Users
"users.view", "users.manage"

// Analytics
"analytics.view"
```

### 6. Middleware Protection

The middleware now:
- ✅ Allows public access to auth pages (login, signup, forgot-password, reset-password)
- ✅ Redirects authenticated users away from auth pages
- ✅ Protects all admin routes requiring authentication
- ✅ Enforces role-based route restrictions:
  - `/admin/settings` - Admin only
  - `/admin/partners` - Admin only
  - `/admin/orders`, `/admin/quotes` - Admin, Manager, Support
  - `/admin/products/edit` - Admin, Manager only

### 7. Database Migration

Created `004_user_roles.sql` migration with:
- ✅ `user_profiles` table with role and extended info
- ✅ RLS (Row Level Security) policies
- ✅ Automatic profile creation on signup
- ✅ Profile sync to `auth.users` metadata
- ✅ Indexes for performance

## Usage Examples

### Protecting a Route
```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function OrdersPage() {
  return (
    <ProtectedRoute requiredPermission="orders.view">
      {/* Your page content */}
    </ProtectedRoute>
  );
}
```

### Protecting Content
```tsx
import { ProtectedContent } from "@/components/auth/ProtectedRoute";

function OrderActions() {
  return (
    <>
      {/* Always visible if user has orders.view */}
      <ProtectedContent requiredPermission="orders.edit">
        <Button>Edit Order</Button>
      </ProtectedContent>
      
      <ProtectedContent requiredPermission="orders.delete">
        <Button variant="destructive">Delete Order</Button>
      </ProtectedContent>
    </>
  );
}
```

### Using Permission Hooks
```tsx
import { usePermissions } from "@/hooks/usePermissions";

function MyComponent() {
  const { hasPermission, hasAnyPermission } = usePermissions();
  
  if (!hasPermission("orders.view")) {
    return <div>No access</div>;
  }
  
  const canModify = hasAnyPermission(["orders.edit", "orders.delete"]);
  
  return (
    <div>
      {canModify && <Button>Modify Order</Button>}
    </div>
  );
}
```

### Using Auth Hook
```tsx
import { useAuth } from "@/hooks/useAuth";

function Header() {
  const { user, role, isAuthenticated, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginButton />;
  }
  
  return (
    <div>
      Welcome, {user.user_metadata?.full_name} ({role})
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

## Setup Instructions

### 1. Run Database Migration
```bash
# Connect to your Supabase project
psql -h db.your-project.supabase.co -U postgres

# Run the migration
\i supabase/migrations/004_user_roles.sql
```

Or use Supabase CLI:
```bash
supabase db push
```

### 2. Create First Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Invite user" or manually create user
3. Update the user's metadata:
```json
{
  "full_name": "Admin User",
  "role": "admin"
}
```

Or use SQL:
```sql
-- First create the user in auth.users, then:
INSERT INTO user_profiles (id, full_name, role)
VALUES ('user-uuid-here', 'Admin User', 'admin');
```

### 3. Test Authentication Flow

1. Navigate to http://localhost:3000/admin/signup
2. Create a test user with role
3. Check email for verification (if enabled)
4. Login at http://localhost:3000/admin/login
5. Test profile page at http://localhost:3000/admin/profile

### 4. Verify Permissions

Test different roles by:
1. Creating users with different roles
2. Logging in as each user
3. Verifying sidebar shows only permitted links
4. Trying to access restricted routes

## Security Considerations

1. **Middleware Protection**: Routes are protected at the middleware level
2. **RLS Policies**: Database access is restricted by Row Level Security
3. **Client-side Checks**: UI elements hidden but API calls still validated
4. **Token Validation**: All auth state managed by Supabase Auth
5. **Password Reset**: Uses secure token-based reset flow

## Role Permission Matrix

| Permission | Admin | Manager | Support | Editor | Customer |
|------------|-------|---------|---------|--------|----------|
| quotes.* | ✅ | ✅ | view/edit | ❌ | ❌ |
| orders.* | ✅ | ✅ | view/edit | ❌ | ❌ |
| products.* | ✅ | ✅ | view | view | view |
| partners.* | ✅ | ❌ | ❌ | ❌ | ❌ |
| content.* | ✅ | ✅ | ❌ | ✅ | ❌ |
| settings.* | ✅ | ❌ | ❌ | ❌ | ❌ |
| users.* | ✅ | view | ❌ | ❌ | ❌ |
| analytics.view | ✅ | ✅ | ✅ | ❌ | ❌ |

## Files Created/Modified

### New Files (11)
1. `/src/app/admin/signup/page.tsx`
2. `/src/app/admin/forgot-password/page.tsx`
3. `/src/app/admin/reset-password/page.tsx`
4. `/src/app/admin/profile/page.tsx`
5. `/src/lib/auth/permissions.ts`
6. `/src/hooks/useAuth.ts`
7. `/src/hooks/usePermissions.ts`
8. `/src/components/auth/ProtectedRoute.tsx`
9. `/src/components/admin/UserMenu.tsx`
10. `/supabase/migrations/004_user_roles.sql`
11. `/docs/AUTH_SYSTEM.md` (this file)

### Modified Files (3)
1. `/src/app/admin/login/page.tsx` - Added links to signup and forgot password
2. `/src/middleware.ts` - Enhanced with RBAC route protection
3. `/src/components/admin/AdminSidebar.tsx` - Added user info and permission filtering

## Next Steps

1. **Email Templates**: Customize Supabase email templates for password reset
2. **User Management**: Create admin UI to manage users and roles
3. **Audit Logging**: Track permission changes and sensitive actions
4. **2FA**: Add two-factor authentication for admin users
5. **API Protection**: Add permission checks to API routes
6. **Testing**: Write tests for permission system and auth flows

## Troubleshooting

### Users can't sign up
- Check Supabase email confirmation settings
- Verify SMTP configuration
- Check RLS policies on user_profiles table

### Permission denied errors
- Verify user role in database
- Check permission definitions in permissions.ts
- Ensure middleware is running

### Session not persisting
- Check cookie settings in Supabase client
- Verify middleware is not clearing cookies
- Check browser localStorage

### Migration fails
- Ensure no existing user_profiles table
- Check for trigger conflicts
- Verify admin user UUID exists

## Support

For issues or questions:
1. Check [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
2. Review migration logs
3. Check browser console for client-side errors
4. Review Supabase Dashboard logs
