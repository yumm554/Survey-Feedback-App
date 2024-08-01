import { NextRequest, NextResponse } from 'next/server';

import User from '@/models/userModel';
import { dbConnect } from '@/dbConfig/dbConfig';

dbConnect();

export async function DELETE(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    // check if user exists
    const user = await User.findOne({ email });

    // delete user
    await User.deleteOne({ email });

    const response = NextResponse.json({
      message: 'User deleted successfully',
      success: true,
    });
    response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
