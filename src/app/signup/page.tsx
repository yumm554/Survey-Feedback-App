'use client'

import axios from 'axios'
import Link from "next/link"
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const SignUp = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(true)

    useEffect(() => {
        if (user.username && user.email && user.password && user.password_confirmation && user.password === user.password_confirmation) {
            setButtonDisabled(false)
        }
        else {
            setButtonDisabled(true)
        }
    }, [user])

    const onSignUp = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`/api/users/signup`, user)
            console.log('Signup success', response.data);
            toast.success('Successfully Signed Up');
            router.push('/login')
        } catch (error: any) {
            console.log('Signup failed', error.message);
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold">Sign Up</h1>
            <br />
            <hr />
            <label htmlFor="username">Username</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-800"
                id="username"
                type="text"
                value={user.username}
                placeholder="username"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
            />

            <label htmlFor="email" >Email</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-800"
                id="email"
                type="text"
                value={user.email}
                placeholder="email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <label htmlFor="password">Password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-800"
                id="password"
                type="password"
                value={user.password}
                placeholder="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <label htmlFor="password">Confirm Password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-800"
                id="password_confirmation"
                type="password"
                value={user.password_confirmation}
                placeholder="Confirm Password"
                onChange={(e) => setUser({ ...user, password_confirmation: e.target.value })}
            />
            <button
                className="p-2 border border-gray-300 rounded-lg bg-gray-500 mb-4 focus:outline-none focus:border-gray-600 disabled:bg-gray-400 text-gray-950 cursor-pointer"
                onClick={onSignUp}
                disabled={buttonDisabled}
            >
                Sign Up
            </button>
            <Link href="/login" className="p-2  mb-4 focus:outline-none focus:border-gray-600 text-gray-500">
                Go to Login
            </Link>
        </div>
    )
}

export default SignUp