// Permission system for role-based access control

export type Permission = 
  // User Management
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  | 'users.assign_roles'
  
  // Product Management
  | 'products.create'
  | 'products.read'
  | 'products.update'
  | 'products.delete'
  | 'products.adjust_stock'
  
  // Category Management
  | 'categories.create'
  | 'categories.read'
  | 'categories.update'
  | 'categories.delete'
  
  // Supplier Management
  | 'suppliers.create'
  | 'suppliers.read'
  | 'suppliers.update'
  | 'suppliers.delete'
  
  // Purchase Orders
  | 'purchase_orders.create'
  | 'purchase_orders.read'
  | 'purchase_orders.update'
  | 'purchase_orders.delete'
  | 'purchase_orders.approve'
  | 'purchase_orders.receive'
  
  // Sales
  | 'sales.create'
  | 'sales.read'
  | 'sales.update'
  | 'sales.delete'
  | 'sales.refund'
  
  // Stock Management
  | 'stock.record_in'
  | 'stock.record_out'
  | 'stock.adjust'
  | 'stock.transfer'
  | 'stock.view_movements'
  
  // Reports
  | 'reports.sales'
  | 'reports.stock'
  | 'reports.audit'
  | 'reports.financial'
  | 'reports.export'
  
  // System Settings
  | 'settings.read'
  | 'settings.update'
  | 'settings.tax'
  | 'settings.company'
  | 'settings.backup'
  
  // Audit & Logs
  | 'audit.read'
  | 'audit.export'
  
  // Dashboard Access
  | 'dashboard.admin'
  | 'dashboard.manager'
  | 'dashboard.staff';

export type UserRole = 'admin' | 'manager' | 'staff';

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    // Full access to everything
    'users.create', 'users.read', 'users.update', 'users.delete', 'users.assign_roles',
    'products.create', 'products.read', 'products.update', 'products.delete', 'products.adjust_stock',
    'categories.create', 'categories.read', 'categories.update', 'categories.delete',
    'suppliers.create', 'suppliers.read', 'suppliers.update', 'suppliers.delete',
    'purchase_orders.create', 'purchase_orders.read', 'purchase_orders.update', 'purchase_orders.delete', 'purchase_orders.approve', 'purchase_orders.receive',
    'sales.create', 'sales.read', 'sales.update', 'sales.delete', 'sales.refund',
    'stock.record_in', 'stock.record_out', 'stock.adjust', 'stock.transfer', 'stock.view_movements',
    'reports.sales', 'reports.stock', 'reports.audit', 'reports.financial', 'reports.export',
    'settings.read', 'settings.update', 'settings.tax', 'settings.company', 'settings.backup',
    'audit.read', 'audit.export',
    'dashboard.admin'
  ],
  
  manager: [
    // User management (limited)
    'users.read',
    
    // Product management
    'products.create', 'products.read', 'products.update', 'products.adjust_stock',
    'categories.read', 'categories.create', 'categories.update',
    'suppliers.read', 'suppliers.create', 'suppliers.update',
    
    // Purchase orders (full access)
    'purchase_orders.create', 'purchase_orders.read', 'purchase_orders.update', 'purchase_orders.approve', 'purchase_orders.receive',
    
    // Sales (full access)
    'sales.create', 'sales.read', 'sales.update', 'sales.refund',
    
    // Stock management (approve changes)
    'stock.record_in', 'stock.record_out', 'stock.adjust', 'stock.transfer', 'stock.view_movements',
    
    // Reports (limited)
    'reports.sales', 'reports.stock', 'reports.export',
    
    // Limited settings
    'settings.read',
    
    'dashboard.manager'
  ],
  
  staff: [
    // Read-only user access
    'users.read',
    
    // Product viewing and basic updates
    'products.read',
    'categories.read',
    'suppliers.read',
    
    // Purchase orders (view only)
    'purchase_orders.read',
    
    // Sales (create and view)
    'sales.create', 'sales.read',
    
    // Stock management (record movements)
    'stock.record_in', 'stock.record_out', 'stock.view_movements',
    
    // Basic reports
    'reports.stock',
    
    'dashboard.staff'
  ]
};

// Helper function to check if user has permission
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole].includes(permission);
};

// Helper function to check multiple permissions
export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

// Helper function to check all permissions
export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Get all permissions for a role
export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole];
};

// Permission descriptions for UI
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  'users.create': 'Create new users',
  'users.read': 'View user information',
  'users.update': 'Update user details',
  'users.delete': 'Delete users',
  'users.assign_roles': 'Assign roles to users',
  
  'products.create': 'Add new products',
  'products.read': 'View product information',
  'products.update': 'Update product details',
  'products.delete': 'Delete products',
  'products.adjust_stock': 'Adjust product stock levels',
  
  'categories.create': 'Create product categories',
  'categories.read': 'View categories',
  'categories.update': 'Update categories',
  'categories.delete': 'Delete categories',
  
  'suppliers.create': 'Add new suppliers',
  'suppliers.read': 'View supplier information',
  'suppliers.update': 'Update supplier details',
  'suppliers.delete': 'Delete suppliers',
  
  'purchase_orders.create': 'Create purchase orders',
  'purchase_orders.read': 'View purchase orders',
  'purchase_orders.update': 'Update purchase orders',
  'purchase_orders.delete': 'Delete purchase orders',
  'purchase_orders.approve': 'Approve purchase orders',
  'purchase_orders.receive': 'Receive purchase orders',
  
  'sales.create': 'Process sales transactions',
  'sales.read': 'View sales records',
  'sales.update': 'Update sales information',
  'sales.delete': 'Delete sales records',
  'sales.refund': 'Process refunds',
  
  'stock.record_in': 'Record stock incoming',
  'stock.record_out': 'Record stock outgoing',
  'stock.adjust': 'Adjust stock levels',
  'stock.transfer': 'Transfer stock between locations',
  'stock.view_movements': 'View stock movement history',
  
  'reports.sales': 'View sales reports',
  'reports.stock': 'View stock reports',
  'reports.audit': 'View audit reports',
  'reports.financial': 'View financial reports',
  'reports.export': 'Export reports',
  
  'settings.read': 'View system settings',
  'settings.update': 'Update system settings',
  'settings.tax': 'Manage tax settings',
  'settings.company': 'Manage company information',
  'settings.backup': 'Manage system backups',
  
  'audit.read': 'View audit logs',
  'audit.export': 'Export audit logs',
  
  'dashboard.admin': 'Access admin dashboard',
  'dashboard.manager': 'Access manager dashboard',
  'dashboard.staff': 'Access staff dashboard'
};
