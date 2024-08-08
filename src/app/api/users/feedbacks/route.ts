import { NextRequest, NextResponse } from 'next/server';
import Feedback from '@/models/feedbackModel';
import { dbConnect } from '@/dbConfig/dbConfig';

dbConnect();

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page
    const skip = (page - 1) * limit;

    // Fetch feedbacks with pagination
    const feedbacks = await Feedback.find().skip(skip).limit(limit);
    const totalFeedbacks = await Feedback.countDocuments();

    // Return response with feedbacks and pagination info
    return NextResponse.json({
      feedbacks,
      pagination: {
        page,
        totalPages: Math.ceil(totalFeedbacks / limit),
        totalFeedbacks,
      },
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
