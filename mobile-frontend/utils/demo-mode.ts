// Demo mode configuration for App Store review
export const DEMO_MODE_CONFIG = {
  // Demo account credentials
  credentials: {
    countryCode: '+1',
    phoneNumber: '9999999999',
    password: 'demo123',
    fullPhoneNumber: '+19999999999',
  },
  
  // Demo user info
  user: {
    id: 'demo-user-001',
    given_name: 'Demo',
    family_name: 'User',
    phone_number: '+19999999999',
    email: 'demo@example.com',
  },
  
  // Demo tokens (not real tokens, just for demo)
  tokens: {
    access_token: 'demo-access-token-' + Date.now(),
    refresh_token: 'demo-refresh-token-' + Date.now(),
  },
};

// Check if the login credentials match demo mode
export const isDemoModeLogin = (phoneNumber: string, password: string): boolean => {
  return (
    phoneNumber === DEMO_MODE_CONFIG.credentials.fullPhoneNumber &&
    password === DEMO_MODE_CONFIG.credentials.password
  );
};

// Generate demo session data
export const generateDemoSession = () => {
  return {
    access_token: DEMO_MODE_CONFIG.tokens.access_token,
    refresh_token: DEMO_MODE_CONFIG.tokens.refresh_token,
    user: DEMO_MODE_CONFIG.user,
  };
};