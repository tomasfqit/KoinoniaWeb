import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// This should be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// This is a mock user database. In a real application, you would use a real database
const MOCK_USER = {
  id: '1',
  email: 'admin@example.com',
  // This is a hashed version of 'password123'
  password: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
  name: 'Admin User',
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In a real application, you would fetch the user from your database
    if (email !== MOCK_USER.email) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, MOCK_USER.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: MOCK_USER.id, email: MOCK_USER.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return user data and token
    return NextResponse.json({
      token,
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        name: MOCK_USER.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 