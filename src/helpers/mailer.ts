import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';

import User from '@/models/userModel';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        }
        else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordExpiry: Date.now() + 3600000
            })
        }
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PW
            }
        });
        const domain = emailType === 'VERIFY'
            ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
            : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`

        const subject = emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password'


        const mailOptions = {
            from: 'Ammar@gmail.com',
            to: email,
            subject: subject,
            html: `<p>Click <a href="${domain}">here</a> to ${subject}
            or copy and paste the link below in your browser. <br> ${domain}
            </p>`
        }

        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;

    } catch (error: any) {
        throw new Error(error.message)
    }
}