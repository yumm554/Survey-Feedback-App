import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useFetchFeedbacks from '../../handlers/feedbacks';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Feedback Form Hook', () => {
  const page = 1;
  const limit = 2;

  afterEach(() => {
    mock.reset();
  });

  it('should submit feedback', async () => {
    const feedbackData = {
      feedbacks: [
        {
          _id: '1',
          username: 'user1',
          email: 'user1@example.com',
          rating: 5,
        },
        {
          _id: '2',
          username: 'user2',
          email: 'user2@example.com',
          rating: 4,
        },
      ],
      pagination: {
        page: 1,
        totalPages: 2,
        totalFeedbacks: 4,
      },
    };

    mock
      .onGet(`/api/users/feedbacks?page=${page}&limit=${limit}`)
      .reply(200, feedbackData);
    const { result } = renderHook(() => useFetchFeedbacks(page, limit));

    expect(result.current.isFeedbackLoading).toBe(true);

    await waitFor(() =>
      expect(result.current).toMatchObject({
        feedbacks: feedbackData.feedbacks,
        pagination: feedbackData.pagination,
        isFeedbackLoading: false,
      })
    );
  });

  it('error fetching feedbacks', async () => {
    const feedbackData = {
      erorr: 'An error occurred',
    };

    mock
      .onGet(`/api/users/feedbacks?page=${page}&limit=${limit}`)
      .reply(500, feedbackData);
    const { result } = renderHook(() => useFetchFeedbacks(page, limit));

    expect(result.current.isFeedbackLoading).toBe(true);

    await waitFor(() =>
      expect(result.current).toMatchObject({
        feedbacks: [],
        pagination: { page: 1, totalPages: 1, totalFeedbacks: 0 },
        isFeedbackLoading: false,
        isFeedbackError: 'An error occurred',
      })
    );
  });
});
