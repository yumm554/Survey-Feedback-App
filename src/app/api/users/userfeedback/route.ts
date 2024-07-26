import { NextRequest, NextResponse } from 'next/server'

import User from '@/models/userModel'
import Feedback from '@/models/feedbackModel'
import { dbConnect } from '@/dbConfig/dbConfig'

dbConnect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { username, email, rating, comments } = reqBody

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'Incorrect email' }, { status: 400 })
    }

    // create new feedback
    const newFeedback = new Feedback({
      username,
      email,
      rating,
      comments,
    })

    const savedFeedback = await newFeedback.save()
    console.log({ savedFeedback })

    //return response

    return NextResponse.json({
      message: 'Feedback submitted successfully',
      success: true,
      savedFeedback,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
