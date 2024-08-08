import { NextRequest, NextResponse } from 'next/server';

import User from '@/models/userModel';
import Feedback from '@/models/feedbackModel';
import { dbConnect } from '@/dbConfig/dbConfig';

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, email, rating, comments } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Incorrect email' }, { status: 400 });
    }

    // create new feedback
    const newFeedback = new Feedback({
      name,
      email,
      rating,
      comments,
    });

    const savedFeedback = await newFeedback.save();

    //return response

    return NextResponse.json({
      message: 'Feedback submitted successfully',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
