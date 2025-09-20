export async function POST(request) {
  try {
    const credentials = await request.json();
    
    // Validate required fields
    const { email, password } = credentials;
    
    if (!email || !password) {
      return Response.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Mock user authentication
    const user = authenticateUser(email, password);
    
    if (!user) {
      return Response.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate mock JWT token
    const token = generateMockJWT(user);

    return Response.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock authentication function
function authenticateUser(email, password) {
  // Mock users database
  const mockUsers = [
    {
      id: 'user_demo_individual',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'password123', // In real app, this would be hashed
      phone: '+91 98765 43210',
      userType: 'individual',
      address: 'HSR Layout, Bengaluru',
      createdAt: '2024-01-15T10:00:00Z',
      profile: {
        points: 1250,
        level: 'Silver',
        completedActions: 45
      }
    },
    {
      id: 'user_demo_hostel',
      name: 'Priya Menon',
      email: 'priya@studentspg.com',
      password: 'hostel123',
      phone: '+91 87654 32109',
      userType: 'hostel',
      organizationName: 'Students Paradise PG',
      address: 'Koramangala, Bengaluru',
      createdAt: '2024-02-20T14:30:00Z',
      profile: {
        points: 2800,
        level: 'Gold',
        completedActions: 78
      }
    },
    {
      id: 'user_demo_company',
      name: 'Amit Kumar',
      email: 'amit@techcorp.com',
      password: 'company123',
      phone: '+91 76543 21098',
      userType: 'company',
      organizationName: 'TechCorp Solutions',
      address: 'Whitefield, Bengaluru',
      createdAt: '2024-03-10T09:15:00Z',
      profile: {
        points: 3400,
        level: 'Gold',
        completedActions: 92
      }
    },
    {
      id: 'user_demo_vendor',
      name: 'Sneha Reddy',
      email: 'sneha@ecorecycle.org',
      password: 'vendor123',
      phone: '+91 65432 10987',
      userType: 'vendor',
      organizationName: 'EcoRecycle Bengaluru',
      address: 'Indiranagar, Bengaluru',
      createdAt: '2024-01-05T16:45:00Z',
      profile: {
        points: 5200,
        level: 'Platinum',
        completedActions: 156
      }
    },
    {
      id: 'user_demo_admin',
      name: 'Admin User',
      email: 'admin@greenshift.com',
      password: 'admin123',
      phone: '+91 90000 00000',
      userType: 'individual',
      address: 'Bengaluru',
      createdAt: '2024-01-01T00:00:00Z',
      profile: {
        points: 10000,
        level: 'Diamond',
        completedActions: 250
      }
    }
  ];

  // Find user by email and validate password
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

function generateMockJWT(user) {
  // In a real app, use proper JWT signing with secret key
  const payload = {
    userId: user.id,
    email: user.email,
    userType: user.userType,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  // This is a mock token - in production, use proper JWT signing
  return 'mock_jwt_' + btoa(JSON.stringify(payload)) + '_' + Math.random().toString(36).substr(2, 9);
}
