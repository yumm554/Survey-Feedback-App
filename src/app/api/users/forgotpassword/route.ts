import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/userModel";
import { dbConnect } from "@/dbConfig/dbConfig";
import { sendEmail } from '@/helpers/mailer';

dbConnect()

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json()
        const { email } = reqBody
        console.log(email);
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 })
        }

        console.log(user);
        await sendEmail({ email: user.email, emailType: "RESET", userId: user._id })

        return NextResponse.json({
            message: "Reset email sent successfully",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}