import { NextRequest, NextResponse } from 'next/server';

import User from '@/models/userModel';
import { dbConnect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';

dbConnect();
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select('-password');
    const { username, email, role } = user;
    return NextResponse.json({
      message: 'User found',
      user: { username, email, role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
