import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import User from '@/models/userModel';
import { dbConnect } from '@/dbConfig/dbConfig';

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    if (!email || !password) {
      return NextResponse.json(
        { error: { message: 'Fill all the required fields', type: 0 } },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // if user is does not exist
    if (!user) {
      return NextResponse.json(
        { error: { message: 'User doesnt exist', type: 1 } },
        { status: 404 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: { message: 'Incorrect password', type: 2 } },
        { status: 401 }
      );
    }
    // create token data

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      role: user.role,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
