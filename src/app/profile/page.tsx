'use client'

import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from 'react'


const Profile = () => {
    const [userDetails, setUserDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const logout = async () => {
        try {
            await axios.get(`/api/users/logout`)
            toast.success('Successfully Logged Out');
            router.push('/login')
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }
    useEffect(() => {
        const getUserDetails = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`/api/users/me`)
                console.log("Get user details success", response.data, response);
                setUserDetails(response.data?.user?._id)
            } catch (error: any) {
                console.log("Get user details failed", error.message);
            }
            finally {
                setIsLoading(false);
            }
        }
        getUserDetails()
    }, [])


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold">Profile</h1>
            <h2 className='p-2 bg-purple-950 rounded text-white'>{isLoading ? 'Please wait...' : userDetails ? <Link href={`/profile/${userDetails}`}>Go to User Profile</Link> : 'No User Found'}</h2>
            <hr />
            <button
                className='bg-blue-800 mt-4 hover:bg-blue-950 text-white font:bold py-2 px-4 rounded'
                onClick={logout}>
                Logout
            </button>
            {/* <button
                className='bg-purple-800 mt-4 hover:bg-purple-950 text-white font:bold py-2 px-4 rounded'
                onClick={getUserDetails}>
                Get User
            </button> */}
        </div>
    )
}

export default Profile