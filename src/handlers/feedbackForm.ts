import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Feedback {
  name: string;
  email: string;
  rating: number;
  comments: string;
}

const useFeedbackForm = () => {
  const [disable, setDisable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const onSubmit = async (
    feedback: Feedback,
    setFeedback: React.Dispatch<React.SetStateAction<Feedback>>
  ) => {
    try {
      setSuccess('');
      setError('');
      setLoading(true);
      setDisable(true);
      const response = await axios.post(`/api/users/userfeedback`, feedback);
      console.log('Submission success');
      setSuccess(response.data?.message);
      setFeedback({ ...feedback, comments: '', rating: 3 });
    } catch (error: any) {
      console.log('Submission failed', error.message);
      setError('An error occurred');
    } finally {
      setLoading(false);
      setDisable(false);
    }
  };

  return {
    disable,
    isFeedbackFormLoading: loading,
    isFeedbackFormError: error,
    isFeedbackFormSuccess: success,
    onSubmit,
  };
};

export default useFeedbackForm;
