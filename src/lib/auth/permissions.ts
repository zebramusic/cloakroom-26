// Role-Based Access Control (RBAC) System

export type Role = 'admin' | 'manager' | 'support' | 'editor' | 'customer';

export type Permission =
  | 'quotes.view'
  | 'quotes.create'
  | 'quotes.update'
  | 'quotes.delete'
  | 'orders.view'
  | 'orders.create'
  | 'orders.update'
  | 'orders.delete'
  | 'orders.refund'
  | 'products.view'
  | 'products.create'
  | 'products.update'
  | 'products.delete'
  | 'partners.view'
  | 'partners.create'
  | 'partners.update'
  | 'partners.delete'
  | 'portfolio.view'
  | 'portfolio.create'
  | 'portfolio.update'
  | 'portfolio.delete'
  | 'portfolio.publish'
  | 'support.view'
  | 'support.respond'
  | 'support.manage'
  | 'site.read'
  | 'site.write'
  | 'site.publish'
  | 'site.media'
  | 'site.rollback'
  | 'content.view'
  | 'content.create'
  | 'content.update'
  | 'content.delete'
  | 'users.view'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'users.manage'
  | 'analytics.view'
  | 'settings.view'
  | 'settings.update';

// Permission matrix: which roles have which permissions
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    // Full access to everything
    'quotes.view', 'quotes.create', 'quotes.update', 'quotes.delete',
    'orders.view', 'orders.create', 'orders.update', 'orders.delete', 'orders.refund',
    'products.view', 'products.create', 'products.update', 'products.delete',
    'partners.view', 'partners.create', 'partners.update', 'partners.delete',
    'portfolio.view', 'portfolio.create', 'portfolio.update', 'portfolio.delete', 'portfolio.publish',
    'support.view', 'support.respond', 'support.manage',
    'site.read', 'site.write', 'site.publish', 'site.media', 'site.rollback',
    'content.view', 'content.create', 'content.update', 'content.delete',
    'users.view', 'users.create', 'users.update', 'users.delete', 'users.manage',
    'analytics.view',
    'settings.view', 'settings.update',
  ],
  
  manager: [
    // All except user management and settings
    'quotes.view', 'quotes.create', 'quotes.update', 'quotes.delete',
    'orders.view', 'orders.create', 'orders.update', 'orders.delete', 'orders.refund',
    'products.view', 'products.create', 'products.update', 'products.delete',
    'partners.view', 'partners.create', 'partners.update', 'partners.delete',
    'portfolio.view', 'portfolio.create', 'portfolio.update', 'portfolio.delete', 'portfolio.publish',
    'support.view', 'support.respond',
    'site.read', 'site.write', 'site.publish', 'site.media',
    'content.view', 'content.create', 'content.update', 'content.delete',
    'users.view', 'users.manage',
    'analytics.view',
  ],
  
  support: [
    // View/update quotes and orders, view products
    'quotes.view', 'quotes.update',
    'orders.view', 'orders.update',
    'products.view',
    'partners.view',
    'portfolio.view',
    'support.view', 'support.respond',
    'site.read',
    'content.view',
  ],
  
  editor: [
    // Content management only
    'content.view', 'content.create', 'content.update', 'content.delete',
    'site.read', 'site.write', 'site.media',
    'partners.view', 'partners.update',
    'portfolio.view', 'portfolio.create', 'portfolio.update',
  ],
  
  customer: [
    // No admin access
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role can access admin panel
 */
export function canAccessAdmin(role: Role): boolean {
  return role !== 'customer';
}

/**
 * Throw error if permission check fails
 */
export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Unauthorized: Missing permission '${permission}'`);
  }
}

/**
 * Check permissions in API routes
 */
export function checkPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return hasPermission(role as Role, permission);
}
