'use client'

import axios from "axios"
import Link from "next/link"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"



const Login = () => {
    const router = useRouter()
    const [user, setUser] = useState({
        email: "",
        password: "",
    })
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const onLogin = async () => {
        try {
            setLoading(false)
            const response = await axios.post('/api/users/login', user)
            console.log("Login success", response.data);
            toast.success('Successfully Logged In');
            router.push('/profile')

        } catch (error: any) {
            console.log('Login failed', error?.response?.data?.message || error.message);
            toast.error(error?.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user.email && user.password) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold">Login</h1>
            <br />
            <hr />

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
            <span
                className="text-gray-500 hover:cursor-pointer"
                onClick={async () => router.push('/forgotpassword')}
            >
                Forget Password ?
            </span>
            <button
                className="p-2 border border-gray-300 rounded-lg bg-gray-500 mb-4 focus:outline-none focus:border-gray-600 text-white"
                onClick={onLogin}
                disabled={buttonDisabled}
            >
                {loading ? 'loading...' : 'Login'}
            </button>
            <span>
                {"Don't have an account ?"}
                <Link href="/signup" className="p-2  mb-4 focus:outline-none focus:border-gray-600 text-gray-500">
                    Signup now
                </Link>
            </span>
        </div>
    )
}

export default Login