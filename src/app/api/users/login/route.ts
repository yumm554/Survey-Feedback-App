import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/userModel";
import { dbConnect } from "@/dbConfig/dbConfig";

dbConnect()
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody

        const user = await User.findOne({ email })

        // if user is does not exist
        if (!user) {
            return NextResponse.json({ error: "User doesnt exist" }, { status: 500 })
        }

        const validPassword = await bcryptjs.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 500 })
        }
        // create token data

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }

        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '1d' })

        const response = NextResponse.json({ message: 'Login successful', success: true })

        response.cookies.set('token', token, {
            httpOnly: true,
        })

        return response
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}