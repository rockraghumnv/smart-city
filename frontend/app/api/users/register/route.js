export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Validate required fields
    const { name, email, password, userType } = userData;
    
    if (!name || !email || !password || !userType) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user type
    const validUserTypes = ['individual', 'hostel', 'company', 'vendor'];
    if (!validUserTypes.includes(userType)) {
      return Response.json(
        { success: false, message: 'Invalid user type' },
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

    // Validate password length
    if (password.length < 6) {
      return Response.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists (mock check)
    // In a real app, you'd check against a database
    const existingUsers = getExistingUsers();
    if (existingUsers.some(user => user.email === email)) {
      return Response.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate mock JWT token
    const token = generateMockJWT(userData);
    
    // Create user object (without password)
    const user = {
      id: generateUserId(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      userType: userData.userType,
      organizationName: userData.organizationName || '',
      address: userData.address || '',
      createdAt: new Date().toISOString(),
      profile: {
        points: 0,
        level: 'Bronze',
        completedActions: 0
      }
    };

    // Mock saving to database
    saveUser(user);

    return Response.json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock helper functions
function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

function generateMockJWT(userData) {
  // In a real app, use proper JWT signing
  const payload = {
    userId: generateUserId(),
    email: userData.email,
    userType: userData.userType,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  // This is a mock token - in production, use proper JWT signing
  return 'mock_jwt_' + btoa(JSON.stringify(payload)) + '_' + Math.random().toString(36).substr(2, 9);
}

function getExistingUsers() {
  // Mock existing users for demonstration
  return [
    { email: 'test@example.com', id: 'user_1' },
    { email: 'admin@greenshift.com', id: 'user_2' }
  ];
}

function saveUser(user) {
  // In a real app, save to database
  console.log('User saved:', user);
}
