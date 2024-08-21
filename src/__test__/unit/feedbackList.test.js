import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import FeedbackList from 'src/app/feedbacklist/page';
import GetUserDetails from 'src/handlers/me';
import useFetchFeedbacks from 'src/handlers/feedbacks';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the handlers
jest.mock('src/handlers/me', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('src/handlers/feedbacks', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Feedback List Component', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    GetUserDetails.mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com', role: 1 },
      isAdmin: false,
      isLoading: false,
    });

    useFetchFeedbacks.mockReturnValue({
      feedbacks: [
        {
          _id: '1',
          name: 'Test User 1',
          email: 'user1@example.com',
          rating: 5,
        },
        {
          _id: '2',
          name: 'Test User 2',
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

  it('renders feedback list correctly', async () => {
    render(<FeedbackList />);

    // Check if feedbacks are listed
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('Test User 2')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();

    //expect total feedbacks
    expect(screen.getByText('S-4')).toBeInTheDocument();

    // Check pagination
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    render(<FeedbackList />);

    const nextButton = screen.getByLabelText('next button');
    const prevButton = screen.getByLabelText('prev button');

    //next page click
    fireEvent.click(nextButton);
    await expect(useFetchFeedbacks).toHaveBeenCalledWith(2, 10);

    //previous page click
    fireEvent.click(prevButton);
    await expect(useFetchFeedbacks).toHaveBeenCalledWith(1, 10);
  });

  it('handles disable on next pagination when page is equal to total pages', () => {
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

  it('handles disable on prev pagination when page is 1', () => {
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

  it('handles loading state while fetching feedbacks', () => {
    useFetchFeedbacks.mockReturnValue({
      feedbacks: [],
      pagination: {},
      isFeedbackLoading: true,
      isFeedbackError: '',
    });

    render(<FeedbackList />);
    expect(screen.getByText('loading...')).toBeInTheDocument();

    const nextButton = screen.getByLabelText('next button');
    const prevButton = screen.getByLabelText('prev button');
    expect(nextButton).toHaveClass('disabled');
    expect(prevButton).toHaveClass('disabled');
  });

  it('handles error when fetching feedbacks', () => {
    useFetchFeedbacks.mockReturnValue({
      feedbacks: [],
      pagination: {},
      isFeedbackLoading: false,
      isFeedbackError: 'An error occurred',
    });

    render(<FeedbackList />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('handles error when me call fails and retry', () => {
    GetUserDetails.mockReturnValue({
      isError: true,
    });

    render(<FeedbackList />);

    //expect error on screen
    expect(
      screen.getByText(`Oops! We’re having trouble connecting right now.`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'try again' })
    ).toBeInTheDocument();
  });

  it('handles if there are no feedbacks in the list', async () => {
    useFetchFeedbacks.mockReturnValue({
      feedbacks: [],
      pagination: { page: 1, totalPages: 0, totalFeedbacks: 0 },
      isFeedbackLoading: false,
      isFeedbackError: '',
    });

    render(<FeedbackList />);

    //expect 0 feedbacks
    expect(screen.getByText('S-0')).toBeInTheDocument();

    // Check default text
    expect(
      screen.getByText('There are no feedbacks to list')
    ).toBeInTheDocument();

    // Check pagination
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });
});
