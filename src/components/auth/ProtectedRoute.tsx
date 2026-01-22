"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/lib/auth/permissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Wraps content that requires specific permissions to access.
 * Handles loading states, authentication checks, and permission validation.
 *
 * @param requiredPermission - Single permission required to view content
 * @param requiredPermissions - Multiple permissions (use with requireAll)
 * @param requireAll - If true, user must have ALL permissions; if false, ANY permission
 * @param fallback - Custom content to show when permission is denied
 */
export function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, role } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!isAuthenticated) {
    return null; // Router will redirect
  }

  // Check permissions if specified
  let hasRequiredPermissions = true;

  if (requiredPermission) {
    hasRequiredPermissions = hasPermission(requiredPermission);
  } else if (requiredPermissions && requiredPermissions.length > 0) {
    hasRequiredPermissions = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  }

  // Show fallback or default unauthorized message
  if (!hasRequiredPermissions) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="max-w-md w-full space-y-6">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <p className="font-semibold mb-2">Access Denied</p>
              <p className="text-sm">
                You don't have permission to access this resource. Your current
                role is <span className="font-medium">{role}</span>.
              </p>
              {requiredPermission && (
                <p className="text-sm mt-2">
                  Required permission:{" "}
                  <span className="font-mono text-xs">
                    {requiredPermission}
                  </span>
                </p>
              )}
              {requiredPermissions && requiredPermissions.length > 0 && (
                <div className="text-sm mt-2">
                  <p>Required permissions {requireAll ? "(all)" : "(any)"}:</p>
                  <ul className="list-disc list-inside font-mono text-xs mt-1">
                    {requiredPermissions.map((perm) => (
                      <li key={perm}>{perm}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex-1"
            >
              Go Back
            </Button>
            <Button onClick={() => router.push("/admin")} className="flex-1">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User has required permissions
  return <>{children}</>;
}

/**
 * ProtectedContent Component
 *
 * Conditionally renders children based on permissions, without redirects.
 * Useful for hiding/showing UI elements based on user permissions.
 */
export function ProtectedContent({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  fallback = null,
}: ProtectedRouteProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let hasRequiredPermissions = true;

  if (requiredPermission) {
    hasRequiredPermissions = hasPermission(requiredPermission);
  } else if (requiredPermissions && requiredPermissions.length > 0) {
    hasRequiredPermissions = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  }

  if (!hasRequiredPermissions) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
