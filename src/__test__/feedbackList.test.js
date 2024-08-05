import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import FeedbackList from '../app/feedbacklist/page';
import GetUserDetails from '../handlers/me';
import useFetchFeedbacks from '../handlers/feedbacks';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the handlers
jest.mock('../handlers/me', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../handlers/feedbacks', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Feedback List Component', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    GetUserDetails.mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com', role: 0 },
      isAdmin: false,
      isLoading: false,
    });

    useFetchFeedbacks.mockReturnValue({
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
      pagination: { page: 1, totalPages: 2, totalFeedbacks: 4 },
      isFeedbackLoading: false,
      isFeedbackError: '',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', async () => {
    render(<FeedbackList />);

    // Check for feedback submissions
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    // Check pagination
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    render(<FeedbackList />);

    const nextButton = screen.getByLabelText('next button');
    const prevButton = screen.getByLabelText('prev button');

    // Simulate next page click
    fireEvent.click(nextButton);
    await expect(useFetchFeedbacks).toHaveBeenCalledWith(2, 10);

    // Simulate previous page click
    fireEvent.click(prevButton);
    await expect(useFetchFeedbacks).toHaveBeenCalledWith(1, 10);
  });

  it('handle disable on next pagination when page is equal to total pages', () => {
    useFetchFeedbacks.mockReturnValue({
      feedbacks: [],
      pagination: { page: 2, totalPages: 2, totalFeedbacks: 4 },
      isFeedbackLoading: false,
      isFeedbackError: '',
    });

    render(<FeedbackList />);

    const nextButton = screen.getByLabelText('next button');
    expect(nextButton).toHaveClass('disabled');
  });

  it('handle disable on prev pagination when page is 1', () => {
    useFetchFeedbacks.mockReturnValue({
      feedbacks: [],
      pagination: { page: 1, totalPages: 2, totalFeedbacks: 4 },
      isFeedbackLoading: false,
      isFeedbackError: '',
    });
    render(<FeedbackList />);

    const prevButton = screen.getByLabelText('prev button');
    expect(prevButton).toHaveClass('disabled');
  });

  it('shows loading state while submitting', () => {
    useFetchFeedbacks.mockReturnValue({
      feedbacks: [],
      pagination: {},
      isFeedbackLoading: true,
      isFeedbackError: '',
    });

    render(<FeedbackList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    const nextButton = screen.getByLabelText('next button');
    const prevButton = screen.getByLabelText('prev button');
    expect(nextButton).toHaveClass('disabled');
    expect(prevButton).toHaveClass('disabled');
  });

  it('shows error message when there is an error', () => {
    useFetchFeedbacks.mockReturnValue({
      feedbacks: [],
      pagination: {},
      isFeedbackLoading: false,
      isFeedbackError: 'An error occurred',
    });

    render(<FeedbackList />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });
});
