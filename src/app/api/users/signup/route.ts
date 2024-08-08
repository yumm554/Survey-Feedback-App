import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import User from '@/models/userModel';
import { dbConnect } from '@/dbConfig/dbConfig';

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, role, key, password } = reqBody;

    //check if required fields are not empty
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: { message: 'Fill all the required fields' } },
        { status: 400 }
      );
    }

    //check if key is not empty
    if (role === 1 && !key) {
      return NextResponse.json(
        { error: { message: 'Key is required' } },
        { status: 400 }
      );
    }

    //check if key is accessible from env
    const hashedAdminKey = process.env.ADMIN_KEY;
    if (!hashedAdminKey)
      return NextResponse.json(
        { error: { message: 'An error occured' } },
        { status: 500 }
      );
    //check if key is correct
    const isKeyValid = await bcryptjs.compare(key, hashedAdminKey);
    if (role === 1 && !isKeyValid) {
      return NextResponse.json(
        { error: { message: 'Key is not valid' } },
        { status: 401 }
      );
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          error: {
            message: 'An account with this email already exists',
          },
        },
        { status: 409 }
      );
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return NextResponse.json(
        { error: { message: 'Username is already taken' } },
        { status: 409 }
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword,
      isAdmin: role === 1,
    });

    const savedUser = await newUser.save();

    return NextResponse.json({
      message: 'Successfully Signed Up',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
