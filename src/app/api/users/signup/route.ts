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
        { error: { message: 'Fill all the required fields', type: 0 } },
        { status: 400 }
      );
    }

    //check if key is not empty
    if (role === 1 && !key) {
      return NextResponse.json(
        { error: { message: 'Key is required', type: 0 } },
        { status: 400 }
      );
    }

    //check if key is correct
    if (role === 1 && key !== 'ZF65WD490') {
      return NextResponse.json(
        { error: { message: 'Key is not valid', type: 1 } },
        { status: 400 }
      );
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: { message: 'User already exists', type: 2 } },
        { status: 400 }
      );
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return NextResponse.json(
        { error: { message: 'Username is already taken', type: 3 } },
        { status: 400 }
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
    });

    const savedUser = await newUser.save();
    console.log('user', newUser);
    console.log({ savedUser });

    return NextResponse.json({
      message: 'Successfully Signed Up',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
