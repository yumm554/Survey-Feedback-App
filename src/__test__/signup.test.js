import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignUp from '../app/signup/page';
import useSignup from '../handlers/signup';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../handlers/signup', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    useSignup.mockReturnValue({
      isSignupLoading: false,
      isSignupError: '',
      isSignupSuccess: '',
      onSignUp: jest.fn(),
      disable: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<SignUp />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'User' }));
    expect(screen.getByRole('checkbox', { name: 'Admin' }));
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Sign Up' }));
  });

  it('toggles the password visibility', () => {
    render(<SignUp />);
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('toggle eye visibility');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('checks and unchecks the checkboxes', () => {
    render(<SignUp />);
    const userCheckbox = screen.getByRole('checkbox', { name: 'User' });
    const adminCheckbox = screen.getByRole('checkbox', { name: 'Admin' });

    expect(userCheckbox).toBeChecked();
    expect(adminCheckbox).not.toBeChecked();

    fireEvent.click(adminCheckbox);
    expect(adminCheckbox).toBeChecked();
    expect(userCheckbox).not.toBeChecked();

    fireEvent.click(userCheckbox);
    expect(userCheckbox).toBeChecked();
    expect(adminCheckbox).not.toBeChecked();
  });

  it('submits the form', () => {
    const mockOnSignUp = jest.fn();
    useSignup.mockReturnValue({
      isSignupLoading: false,
      isSignupError: '',
      isSignupSuccess: '',
      onSignUp: mockOnSignUp,
      disable: false,
    });

    render(<SignUp />);
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const userCheckbox = screen.getByRole('checkbox', { name: 'User' });
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(userCheckbox);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });

    fireEvent.click(submitButton);

    expect(mockOnSignUp).toHaveBeenCalledWith(
      {
        username: 'testuser',
        email: 'test@example.com',
        role: 0,
        key: '',
        password: 'Password123',
        password_confirmation: 'Password123',
      },
      expect.any(Function)
    );
  });

  it('shows loading state', () => {
    useSignup.mockReturnValue({
      isSignupLoading: true,
      isSignupError: '',
      isSignupSuccess: '',
      onSignUp: jest.fn(),
      disable: true,
    });

    render(<SignUp />);
    const submitButton = screen.getByRole('button', { name: 'Signing Up' });
    expect(submitButton).toBeDisabled();
  });

  it('shows error message', () => {
    useSignup.mockReturnValue({
      isSignupLoading: false,
      isSignupError: 'An error occurred',
      isSignupSuccess: '',
      onSignUp: jest.fn(),
      disable: false,
    });

    render(<SignUp />);
    const errorMessage = screen.getByText('An error occurred');
    expect(errorMessage).toBeInTheDocument();
  });

  it('shows success message', () => {
    useSignup.mockReturnValue({
      isSignupLoading: false,
      isSignupError: '',
      isSignupSuccess: 'Successfully Signed Up',
      onSignUp: jest.fn(),
      disable: false,
    });

    render(<SignUp />);
    const successMessage = screen.getByText('Successfully Signed Up');
    expect(successMessage).toBeInTheDocument();
  });
});
