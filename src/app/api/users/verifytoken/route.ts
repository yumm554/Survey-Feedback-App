import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const SECRET = process.env.JWT_SECRET || '';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value || '';

  try {
    // Verify the JWT token
    const secret = new TextEncoder().encode(SECRET);
    await jwtVerify(token, secret);

    // If the token is valid, return a success response
    return NextResponse.json({ message: 'Token is valid' });
  } catch (error: any) {
    // If token verification fails, return an error response
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
