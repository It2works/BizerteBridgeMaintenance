export type UserRole = 'admin' | 'supadmin' | 'technician';

export const getUserRoleFromEmail = (email: string): UserRole => {
  if (!email) {
    console.error('No email provided for role detection');
    return 'admin'; // Default fallback
  }

  try {
    const domain = email.split('@')[1];
    if (!domain) {
      console.error('Invalid email format:', email);
      return 'admin';
    }

    // Extract the subdomain (part before .tn)
    const role = domain.split('.')[0];
    console.log('Detected role from email:', role);
    
    switch (role) {
      case 'admin':
        return 'admin';
      case 'supadmin':
        return 'supadmin';
      case 'technician':
        return 'technician';
      default:
        console.error('Invalid email domain for role detection:', domain);
        return 'admin'; // Default fallback
    }
  } catch (error) {
    console.error('Error parsing email for role detection:', error);
    return 'admin'; // Default fallback
  }
};

export const getRoleBasedRoute = (role: UserRole, path: string) => {
  return `/${role}${path}`;
};