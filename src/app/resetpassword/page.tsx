"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


const ResetPassword = () => {

    const [token, setToken] = useState("");
    const [error, setError] = useState(false);
    const [user, setUser] = useState({
        password: "",
        passwordConfirmation: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (user.password && user.passwordConfirmation && user.password === user.passwordConfirmation) {
            setButtonDisabled(false)
        }
        else {
            setButtonDisabled(true)
        }
    }, [user])

    const resetPassword = async () => {
        if (user.password == user.passwordConfirmation) {
            if (token.length > 0) {
                try {
                    await axios.post('/api/users/resetpassword', { token, password: user.password })
                    router.push('/login')
                } catch (error: any) {
                    setError(true);
                    console.log(error?.reponse?.data);
                }
            }
        } else {
            toast.error('Password and confirmation password must match')
            return
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold">Reset Password</h1>
            <br />
            <hr />

            <label htmlFor="newPassword" >Password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="password"
                type="password"
                value={user.password}
                placeholder="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <label htmlFor="passwordConfirmation" >Confirm Password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="passwordConfirmation"
                type="password"
                value={user.passwordConfirmation}
                placeholder="confirm password"
                onChange={(e) => setUser({ ...user, passwordConfirmation: e.target.value })}
            />

            <button
                className="p-2 border border-gray-300 rounded-lg bg-gray-500 mb-4 focus:outline-none focus:border-gray-600 text-white disabled:bg-gray-400"
                onClick={resetPassword}
                disabled={buttonDisabled}
            >
                Reset
            </button>
            <Link href="/login" className="p-2  mb-4 focus:outline-none focus:border-gray-600 text-gray-500">
                Go to Login
            </Link>
        </div>
    )
}

export default ResetPassword