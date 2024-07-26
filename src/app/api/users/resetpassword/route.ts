import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/userModel";
import { dbConnect } from "@/dbConfig/dbConfig";

dbConnect()

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json()
        const { token, password } = reqBody
        console.log(token);
        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        console.log(user);

        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        user.password = hashedPassword
        await user.save();

        return NextResponse.json({
            message: "Password reset successfully",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}