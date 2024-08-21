import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserFeedback from 'src/app/userFeedback/page';
import { useRouter } from 'next/navigation';
import GetUserDetails from 'src/handlers/me';
import useFeedbackForm from 'src/handlers/feedbackForm';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('src/handlers/me', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('src/handlers/feedbackForm', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('UserFeedback Component', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    GetUserDetails.mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com', role: 0 },
      isAdmin: false,
      isLoading: false,
    });

    useFeedbackForm.mockReturnValue({
      isFeedbackFormLoading: false,
      isFeedbackFormError: '',
      isFeedbackFormSuccess: '',
      onSubmit: jest.fn(),
      disable: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the feedback form with all fields', () => {
    render(<UserFeedback />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('rate 5 stars')).toBeInTheDocument();
    expect(screen.getByLabelText('rate 4 stars')).toBeInTheDocument();
    expect(screen.getByLabelText('rate 3 stars')).toBeInTheDocument();
    expect(screen.getByLabelText('rate 2 stars')).toBeInTheDocument();
    expect(screen.getByLabelText('rate 1 star')).toBeInTheDocument();

    expect(screen.getByLabelText('Comments')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Submit Feedback' })
    ).toBeInTheDocument();
  });

  it('updates rating state on rating click', () => {
    render(<UserFeedback />);
    const rating3 = screen.getByLabelText('rate 3 stars');
    const rating5 = screen.getByLabelText('rate 5 stars');

    fireEvent.click(rating5);
    expect(rating5).toHaveClass('active');
    expect(rating3).not.toHaveClass('active');
  });

  it('submits the form with correct data', async () => {
    const mockOnSubmit = jest.fn();
    useFeedbackForm.mockReturnValue({
      isFeedbackFormLoading: false,
      isFeedbackFormError: '',
      isFeedbackFormSuccess: '',
      onSubmit: mockOnSubmit,
      disable: false,
    });

    render(<UserFeedback />);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Comments'), {
      target: { value: 'Great service!' },
    });

    const rating5 = screen.getByLabelText('rate 5 stars');
    fireEvent.click(rating5);
    expect(rating5).toHaveClass('active');

    fireEvent.click(screen.getByRole('button', { name: 'Submit Feedback' }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      {
        name: 'Test User',
        email: 'test@example.com',
        rating: 5,
        comments: 'Great service!',
      },
      expect.any(Function)
    );
  });

  it('shows loading state while submitting', () => {
    useFeedbackForm.mockReturnValue({
      isFeedbackFormLoading: true,
      isFeedbackFormError: '',
      isFeedbackFormSuccess: '',
      onSubmit: jest.fn(),
      disable: true,
    });

    render(<UserFeedback />);
    expect(
      screen.getByRole('button', { name: 'Submitting Feedback' })
    ).toBeDisabled();
  });

  it('shows error message when there is an error', () => {
    useFeedbackForm.mockReturnValue({
      isFeedbackFormLoading: false,
      isFeedbackFormError: 'An error occurred',
      isFeedbackFormSuccess: '',
      onSubmit: jest.fn(),
      disable: false,
    });

    render(<UserFeedback />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('shows success message when feedback is successfully submitted', () => {
    useFeedbackForm.mockReturnValue({
      isFeedbackFormLoading: false,
      isFeedbackFormError: '',
      isFeedbackFormSuccess: 'Feedback submitted successfully',
      onSubmit: jest.fn(),
      disable: false,
    });

    render(<UserFeedback />);
    expect(
      screen.getByText('Feedback submitted successfully')
    ).toBeInTheDocument();
  });

  it('handles error when me call fails and retry', () => {
    GetUserDetails.mockReturnValue({
      isError: true,
    });

    render(<UserFeedback />);

    //expect error on screen
    expect(
      screen.getByText(`Oops! We’re having trouble connecting right now.`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'try again' })
    ).toBeInTheDocument();
  });
});
