import { useState, useEffect } from 'react';
import axios from 'axios';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  rating: number;
}

interface Pagination {
  page: number;
  totalPages: number;
  totalFeedbacks: number;
}

const useFetchFeedbacks = (page: number, limit: number) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    totalFeedbacks: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchFeedbacks = async () => {
    try {
      setError('');
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

  useEffect(() => {
    fetchFeedbacks();
  }, [page]);

  return {
    feedbacks,
    pagination,
    isFeedbackLoading: loading,
    isFeedbackError: error,
    retry: fetchFeedbacks,
  };
};

export default useFetchFeedbacks;
