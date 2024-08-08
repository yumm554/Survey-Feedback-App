import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import User from '@/models/userModel';
import { dbConnect } from '@/dbConfig/dbConfig';

dbConnect();

export async function PATCH(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, old_password, password } = reqBody;

    if (!email || !old_password || !password) {
      return NextResponse.json(
        { error: { message: 'All fields are required', type: 0 } },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ email });
    // Verify old password
    const isMatch = await bcryptjs.compare(old_password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: { message: 'Old password is incorrect', type: 2 } },
        { status: 401 }
      );
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      message: 'Password Successfully Updated',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
