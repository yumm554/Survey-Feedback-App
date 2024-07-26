'use client'

import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'

const UserFeedback = () => {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({
    username: '',
    email: '',
    rating: 3,
    comments: '',
  })
  const [buttonDisabled, setButtonDisabled] = useState(true)

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/users/me`)
        setFeedback({
          ...feedback,
          username: response.data?.user.username,
          email: response.data?.user.email,
        })
      } catch (error: any) {
        console.log('Get user details failed', error.message)
      } finally {
        setLoading(false)
      }
    }
    getUserDetails()
  }, [])

  useEffect(() => {
    if (
      feedback.username &&
      feedback.email &&
      feedback.rating &&
      feedback.comments
    ) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [feedback])

  const onSubmit = async () => {
    try {
      setLoading(true)
      const response = await axios.post(`/api/users/userfeedback`, feedback)
      console.log('Submission success', response.data)
      toast.success('Successfully Submitted')
    } catch (error: any) {
      console.log('Submission failed', error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Your Feedback</h1>
      <br />
      <hr />
      <label htmlFor="username">Username</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-800"
        id="username"
        type="text"
        disabled
        value={feedback.username}
        placeholder="username"
        onChange={(e) => setFeedback({ ...feedback, username: e.target.value })}
      />

      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-800"
        id="email"
        type="text"
        disabled
        value={feedback.email}
        placeholder="email"
        onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
      />

      <label>Rating:</label>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <input
          type="checkbox"
          value={1}
          checked={feedback.rating === 1}
          onChange={() => setFeedback({ ...feedback, rating: 1 })}
        />

        <input
          type="checkbox"
          value={2}
          checked={feedback.rating === 2}
          onChange={() => setFeedback({ ...feedback, rating: 2 })}
        />
        <input
          type="checkbox"
          value={3}
          checked={feedback.rating === 3}
          onChange={() => setFeedback({ ...feedback, rating: 3 })}
        />
        <input
          type="checkbox"
          value={2}
          checked={feedback.rating === 4}
          onChange={() => setFeedback({ ...feedback, rating: 4 })}
        />
        <input
          type="checkbox"
          value={5}
          checked={feedback.rating === 5}
          onChange={() => setFeedback({ ...feedback, rating: 5 })}
        />
      </div>
      <label htmlFor="password">Comments</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-800"
        id="comments"
        type="text"
        value={feedback.comments}
        placeholder="comments"
        onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
      />
      <button
        className="p-2 border border-gray-300 rounded-lg bg-gray-500 mb-4 focus:outline-none focus:border-gray-600 disabled:bg-gray-400 text-gray-950 cursor-pointer"
        onClick={onSubmit}
        disabled={buttonDisabled}
      >
        Submit
      </button>
    </div>
  )
}

export default UserFeedback
