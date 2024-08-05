import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Setting from '../app/settings/page';
import GetUserDetails from '../handlers/me';
import useChangePassword from '../handlers/changePassword';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the handlers
jest.mock('../handlers/me', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../handlers/changePassword', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Setting Component', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    GetUserDetails.mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com', role: 0 },
      isAdmin: false,
      isLoading: false,
    });

    useChangePassword.mockReturnValue({
      isPasswordLoading: false,
      isPasswordError: '',
      isPasswordSuccess: '',
      onUpdate: jest.fn(),
      disable: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<Setting />);

    expect(screen.getByLabelText('username')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('role')).toBeInTheDocument();
  });

  it('renders the feedback form with all fields', () => {
    render(<Setting />);

    expect(screen.getByLabelText('Old Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('toggles the password visibility', () => {
    render(<Setting />);
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('toggle eye visibility');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submits the form correctly', async () => {
    const mockOnUpdate = jest.fn();
    useChangePassword.mockReturnValue({
      isPasswordLoading: false,
      isPasswordError: '',
      isPasswordSuccess: '',
      onUpdate: mockOnUpdate,
      disable: false,
    });
    render(<Setting />);

    const oldPasswordInput = screen.getByLabelText('Old Password');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    const submitButton = screen.getByRole('button', {
      name: 'Update',
    });

    fireEvent.change(oldPasswordInput, {
      target: { value: 'oldPassword123' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newPassword123' },
    });

    // Trigger the form submission
    fireEvent.click(submitButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      'test@example.com',
      {
        old_password: 'oldPassword123',
        password: 'newPassword123',
        password_confirmation: 'newPassword123',
      },
      expect.any(Function)
    );
  });

  it('shows loading state while submitting', () => {
    useChangePassword.mockReturnValue({
      isPasswordLoading: true,
      isPasswordError: '',
      isPasswordSuccess: '',
      onSubmit: jest.fn(),
      disable: true,
    });

    render(<Setting />);
    expect(screen.getByRole('button', { name: 'Updating' })).toBeDisabled();
  });

  it('shows error message when there is an error', () => {
    useChangePassword.mockReturnValue({
      isPasswordLoading: false,
      isPasswordError: 'An error occurred',
      isPasswordSuccess: '',
      onSubmit: jest.fn(),
      disable: false,
    });

    render(<Setting />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('shows success message when feedback is successfully submitted', () => {
    useChangePassword.mockReturnValue({
      isPasswordLoading: false,
      isPasswordError: '',
      isPasswordSuccess: 'Password Successfully Updated',
      onSubmit: jest.fn(),
      disable: false,
    });

    render(<Setting />);
    expect(
      screen.getByText('Password Successfully Updated')
    ).toBeInTheDocument();
  });
});
