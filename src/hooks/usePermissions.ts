import { useAuth } from './useAuth';
import { hasPermission, hasAnyPermission, hasAllPermissions, canAccessAdmin, Permission, Role } from '@/lib/auth/permissions';

export function usePermissions() {
  const { role } = useAuth();

  return {
    hasPermission: (permission: Permission) => 
      role ? hasPermission(role as Role, permission) : false,
    
    hasAnyPermission: (permissions: Permission[]) => 
      role ? hasAnyPermission(role as Role, permissions) : false,
    
    hasAllPermissions: (permissions: Permission[]) => 
      role ? hasAllPermissions(role as Role, permissions) : false,
    
    canAccessAdmin: () => 
      role ? canAccessAdmin(role as Role) : false,
  };
}
