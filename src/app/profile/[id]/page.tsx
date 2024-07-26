import React from 'react'

const UserProfile = ({ params }: any) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold">User Profile</h1>
            <hr />
            <br />
            <p className='text-3xl  text-gray-500'>
                User
                <span className='px-2 ml-2 rounded bg-gray-500 text-center text-white'>
                    {params?.id}
                </span>
            </p>
        </div>
    )
}

export default UserProfile