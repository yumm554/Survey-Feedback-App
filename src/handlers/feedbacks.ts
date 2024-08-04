import { useState, useEffect } from 'react';
import axios from 'axios';

interface Feedback {
  _id: string;
  username: string;
  email: string;
  rating: number;
  comments: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalFeedbacks: number;
}

const useFetchFeedbacks = (page: number, limit: number) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalFeedbacks: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await axios.get(
          `/api/users/feedbacks?page=${page}&limit=${limit}`
        );

        setFeedbacks(response.data?.feedbacks);
        setPagination(response.data?.pagination);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [page]);

  return {
    feedbacks,
    pagination,
    isFeedbackLoading: loading,
    isFeedbackError: error,
  };
};

export default useFetchFeedbacks;
