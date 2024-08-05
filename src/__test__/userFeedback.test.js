import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserFeedback from '../app/userFeedback/page';
import { useRouter } from 'next/navigation';
import GetUserDetails from '../handlers/me';
import useFeedbackForm from '../handlers/feedbackForm';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../handlers/me', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../handlers/feedbackForm', () => ({
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
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comments/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Submit Feedback/i })
    ).toBeInTheDocument();
  });

  it('updates feedback state on input change', () => {
    render(<UserFeedback />);
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/Comments/i), {
      target: { value: 'Great service!' },
    });

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/Comments/i)).toHaveValue('Great service!');
  });

  it('updates rating state on rating click', () => {
    render(<UserFeedback />);
    const rating3 = screen.getByText('3');
    const rating5 = screen.getByText('5');

    fireEvent.click(rating5);
    expect(rating5.parentElement).toHaveClass('active');
    expect(rating3.parentElement).not.toHaveClass('active');
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
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/Comments/i), {
      target: { value: 'Great service!' },
    });
    fireEvent.click(screen.getByText('5'));

    fireEvent.click(screen.getByRole('button', { name: /Submit Feedback/i }));

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
      screen.getByRole('button', { name: /Submitting Feedback/i })
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
    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
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
      screen.getByText(/Feedback submitted successfully/i)
    ).toBeInTheDocument();
  });
});
