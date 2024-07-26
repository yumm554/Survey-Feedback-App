// components/FeedbackList.tsx
'use client'

import { useState, useEffect } from 'react'

interface Feedback {
  _id: string
  username: string
  email: string
  rating: number
  comments: string
}

interface Pagination {
  page: number
  limit: number
  totalPages: number
  totalFeedbacks: number
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalFeedbacks: 0,
  })

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          `/api/users/feedbacks?page=${pagination.page}&limit=${pagination.limit}`
        )
        const data = await res.json()
        setFeedbacks(data.feedbacks)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Error fetching feedbacks:', error)
      }
    }

    fetchFeedbacks()
  }, [pagination.page])

  return (
    <div>
      <h2>Feedback List</h2>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback._id}>
            <p>Username: {feedback.username}</p>
            <p>Email: {feedback.email}</p>
            <p>Rating: {feedback.rating}</p>
            <p>Comments: {feedback.comments}</p>
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(prev.page + 1, pagination.totalPages),
            }))
          }
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default FeedbackList
