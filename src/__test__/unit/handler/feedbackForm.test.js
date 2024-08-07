import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useFeedbackForm from 'src/handlers/feedbackForm';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Feedback Form Hook', () => {
  const setFeedback = jest.fn();
  const feedback = {
    name: 'Test User',
    email: 'test@example.com',
    rating: 4,
    comments: 'Great service!',
  };

  afterEach(() => {
    mock.reset();
  });

  it('submits feedback successfully', async () => {
    const feedbackData = {
      message: 'Feedback submitted successfully',
    };

    mock.onPost('/api/users/userfeedback').reply(200, feedbackData);
    const { result } = renderHook(() => useFeedbackForm());
    act(() => {
      result.current.onSubmit(feedback, setFeedback);
    });

    expect(result.current).toMatchObject({
      isFeedbackFormLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isFeedbackFormLoading: false,
        disable: false,
        isFeedbackFormSuccess: 'Feedback submitted successfully',
      })
    );

    expect(setFeedback).toHaveBeenCalledWith({
      ...feedback,
      rating: 3,
      comments: '',
    });
  });

  it('handles error when submitting feedback', async () => {
    const feedbackData = {
      error: 'An error occurred',
    };

    mock.onPost('/api/users/userfeedback').reply(500, feedbackData);
    const { result } = renderHook(() => useFeedbackForm());
    act(() => {
      result.current.onSubmit(feedback, setFeedback);
    });

    expect(result.current).toMatchObject({
      isFeedbackFormLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isFeedbackFormLoading: false,
        disable: false,
        isFeedbackFormError: 'An error occurred',
      })
    );
  });
});
