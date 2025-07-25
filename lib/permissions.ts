import { prisma } from "./prisma"

// Define all possible permissions in the system
export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: "manage_users",
  VIEW_ALL_USERS: "view_all_users",
  APPROVE_RESEARCHERS: "approve_researchers",

  // Proposal Management
  CREATE_PROPOSALS: "create_proposals",
  EDIT_OWN_PROPOSALS: "edit_own_proposals",
  VIEW_OWN_PROPOSALS: "view_own_proposals",
  VIEW_ALL_PROPOSALS: "view_all_proposals",
  REVIEW_PROPOSALS: "review_proposals",
  APPROVE_PROPOSALS: "approve_proposals",
  BULK_MANAGE_PROPOSALS: "bulk_manage_proposals",

  // Project Management
  VIEW_OWN_PROJECTS: "view_own_projects",
  VIEW_ALL_PROJECTS: "view_all_projects",
  SUPERVISE_PROJECTS: "supervise_projects",
  EVALUATE_PROJECTS: "evaluate_projects",
  UPDATE_PROJECT_STATUS: "update_project_status",

  // Financial Management
  VIEW_FINANCIAL_DATA: "view_financial_data",
  MANAGE_BUDGETS: "manage_budgets",
  APPROVE_BUDGETS: "approve_budgets",

  // System Administration
  MANAGE_FINANCIAL_YEARS: "manage_financial_years",
  MANAGE_GRANTS: "manage_grants",
  MANAGE_THEMES: "manage_themes",
  MANAGE_DEPARTMENTS: "manage_departments",
  SYSTEM_SETTINGS: "system_settings",

  // Reporting and Analytics
  VIEW_REPORTS: "view_reports",
  CREATE_CUSTOM_REPORTS: "create_custom_reports",
  EXPORT_DATA: "export_data",

  // Audit and Monitoring
  VIEW_AUDIT_LOGS: "view_audit_logs",
  VIEW_ALL_ACTIVITIES: "view_all_activities",
  MANAGE_SECURITY: "manage_security",

  // Communication
  SEND_NOTIFICATIONS: "send_notifications",
  MANAGE_EMAIL_TEMPLATES: "manage_email_templates",

  // Feedback and Evaluation
  PROVIDE_FEEDBACK: "provide_feedback",
  VIEW_FEEDBACK: "view_feedback",
  MANAGE_EVALUATIONS: "manage_evaluations",

  // General
  VIEW_DASHBOARD: "view_dashboard",
  UPDATE_PROFILE: "update_profile",
  ACCESS_API: "access_api",
} as const

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// User permission cache
const userPermissionCache = new Map<string, Set<Permission>>()
const cacheExpiry = new Map<string, number>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getUserPermissions(userId: string): Promise<Set<Permission>> {
  // Check cache first
  const now = Date.now()
  if (userPermissionCache.has(userId) && cacheExpiry.get(userId)! > now) {
    return userPermissionCache.get(userId)!
  }

  try {
    // Get user with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        researcher: {
          include: {
            department: true,
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!user) {
      return new Set()
    }

    const permissions = new Set<Permission>()

    // Add role-based permissions
    const rolePermissions = getRolePermissions(user.role, user.researcher)
    rolePermissions.forEach((permission) => permissions.add(permission))

    // Add custom user permissions
    user.userPermissions.forEach((up) => {
      if (up.granted) {
        permissions.add(up.permission.name as Permission)
      } else {
        permissions.delete(up.permission.name as Permission)
      }
    })

    // Cache the result
    userPermissionCache.set(userId, permissions)
    cacheExpiry.set(userId, now + CACHE_DURATION)

    return permissions
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    return new Set()
  }
}

function getRolePermissions(role: string, researcher?: any): Permission[] {
  const basePermissions = [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.UPDATE_PROFILE, PERMISSIONS.ACCESS_API]

  switch (role) {
    case "ADMIN":
      return [
        ...basePermissions,
        // All permissions for admin
        ...Object.values(PERMISSIONS),
      ]

    case "SUPERVISOR":
      return [
        ...basePermissions,
        // Proposal and project management
        PERMISSIONS.VIEW_ALL_PROPOSALS,
        PERMISSIONS.REVIEW_PROPOSALS,
        PERMISSIONS.APPROVE_PROPOSALS,
        PERMISSIONS.VIEW_ALL_PROJECTS,
        PERMISSIONS.SUPERVISE_PROJECTS,
        PERMISSIONS.EVALUATE_PROJECTS,
        PERMISSIONS.UPDATE_PROJECT_STATUS,

        // Financial (limited)
        PERMISSIONS.VIEW_FINANCIAL_DATA,

        // Reporting
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.CREATE_CUSTOM_REPORTS,

        // Feedback
        PERMISSIONS.PROVIDE_FEEDBACK,
        PERMISSIONS.VIEW_FEEDBACK,
        PERMISSIONS.MANAGE_EVALUATIONS,

        // Communication
        PERMISSIONS.SEND_NOTIFICATIONS,

        // If supervisor is also a researcher
        ...(researcher
          ? [
              PERMISSIONS.CREATE_PROPOSALS,
              PERMISSIONS.EDIT_OWN_PROPOSALS,
              PERMISSIONS.VIEW_OWN_PROPOSALS,
              PERMISSIONS.VIEW_OWN_PROJECTS,
            ]
          : []),
      ]

    case "RESEARCHER":
      const researcherPermissions = [
        ...basePermissions,
        PERMISSIONS.VIEW_OWN_PROPOSALS,
        PERMISSIONS.VIEW_OWN_PROJECTS,
        PERMISSIONS.VIEW_FEEDBACK,
        PERMISSIONS.VIEW_REPORTS,
      ]

      // Only approved researchers can create proposals
      if (researcher?.isApproved) {
        researcherPermissions.push(PERMISSIONS.CREATE_PROPOSALS, PERMISSIONS.EDIT_OWN_PROPOSALS)
      }

      return researcherPermissions

    case "GENERAL_USER":
      return basePermissions

    default:
      return basePermissions
  }
}

export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId)
  return userPermissions.has(permission)
}

export async function hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId)
  return permissions.some((permission) => userPermissions.has(permission))
}

export async function hasAllPermissions(userId: string, permissions: Permission[]): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId)
  return permissions.every((permission) => userPermissions.has(permission))
}

// Clear cache when user permissions change
export function clearUserPermissionCache(userId: string) {
  userPermissionCache.delete(userId)
  cacheExpiry.delete(userId)
}

// Clear all cache
export function clearAllPermissionCache() {
  userPermissionCache.clear()
  cacheExpiry.clear()
}

// Middleware helper for API routes
export async function requirePermission(userId: string, permission: Permission) {
  const hasAccess = await hasPermission(userId, permission)
  if (!hasAccess) {
    throw new Error(`Access denied: Missing permission ${permission}`)
  }
}

// Route-based permission checking
export async function canAccessRoute(userId: string, route: string): Promise<boolean> {
  const routePermissions: Record<string, Permission[]> = {
    "/admin": [PERMISSIONS.SYSTEM_SETTINGS],
    "/admin/users": [PERMISSIONS.MANAGE_USERS],
    "/admin/financial-years": [PERMISSIONS.MANAGE_FINANCIAL_YEARS],
    "/admin/grants": [PERMISSIONS.MANAGE_GRANTS],
    "/admin/themes": [PERMISSIONS.MANAGE_THEMES],
    "/admin/departments": [PERMISSIONS.MANAGE_DEPARTMENTS],
    "/proposals/new": [PERMISSIONS.CREATE_PROPOSALS],
    "/proposals": [PERMISSIONS.VIEW_OWN_PROPOSALS, PERMISSIONS.VIEW_ALL_PROPOSALS],
    "/projects": [PERMISSIONS.VIEW_OWN_PROJECTS, PERMISSIONS.VIEW_ALL_PROJECTS],
    "/supervision": [PERMISSIONS.SUPERVISE_PROJECTS],
    "/reports": [PERMISSIONS.VIEW_REPORTS],
    "/audit": [PERMISSIONS.VIEW_AUDIT_LOGS],
  }

  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) {
    return true // Allow access to routes without specific permissions
  }

  return await hasAnyPermission(userId, requiredPermissions)
}

// Permission management functions
export async function grantPermission(userId: string, permission: Permission, grantedBy: string) {
  try {
    // First, ensure the permission exists in the database
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: {
        name: permission,
        description: `Permission to ${permission.replace(/_/g, " ")}`,
      },
    })

    // Grant the permission to the user
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId,
          permissionId: permission,
        },
      },
      update: {
        granted: true,
        grantedBy,
        grantedAt: new Date(),
      },
      create: {
        userId,
        permissionId: permission,
        granted: true,
        grantedBy,
        grantedAt: new Date(),
      },
    })

    // Clear cache
    clearUserPermissionCache(userId)
  } catch (error) {
    console.error("Error granting permission:", error)
    throw error
  }
}

export async function revokePermission(userId: string, permission: Permission, revokedBy: string) {
  try {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId,
          permissionId: permission,
        },
      },
      update: {
        granted: false,
        revokedBy,
        revokedAt: new Date(),
      },
      create: {
        userId,
        permissionId: permission,
        granted: false,
        revokedBy,
        revokedAt: new Date(),
      },
    })

    // Clear cache
    clearUserPermissionCache(userId)
  } catch (error) {
    console.error("Error revoking permission:", error)
    throw error
  }
}
