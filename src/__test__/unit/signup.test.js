import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignUp from 'src/app/signup/page';
import useSignup from 'src/handlers/signup';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('src/handlers/signup', () => ({
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

  it('renders the Signup form', () => {
    render(<SignUp />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    const userCheckbox = screen.getByRole('checkbox', { name: 'User' });
    expect(userCheckbox).toBeInTheDocument();
    expect(userCheckbox).toBeChecked();

    const adminCheckbox = screen.getByRole('checkbox', { name: 'Admin' });
    expect(adminCheckbox).toBeInTheDocument();
    expect(adminCheckbox).not.toBeChecked();

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Sign Up' }));
  });

  it('toggles the password visibility', () => {
    render(<SignUp />);
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText(
      'toggle eye visibility for password'
    );

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('toggles the confirm password visibility', () => {
    render(<SignUp />);
    const passwordInput = screen.getByLabelText('Confirm Password');
    const toggleButton = screen.getByLabelText(
      'toggle eye visibility for confirm password'
    );

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

  it('submits the form when role is user', () => {
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

  it('submits the form when role is admin', () => {
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
    const adminCheckbox = screen.getByRole('checkbox', { name: 'Admin' });
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(adminCheckbox);
    expect(adminCheckbox).toBeChecked();
    expect(userCheckbox).not.toBeChecked();

    const keyInput = screen.getByLabelText('Key');
    expect(keyInput).toBeInTheDocument();
    fireEvent.change(keyInput, { target: { value: 'AAAAAAAAA' } });

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });

    fireEvent.click(submitButton);

    expect(mockOnSignUp).toHaveBeenCalledWith(
      {
        username: 'testuser',
        email: 'test@example.com',
        role: 1,
        key: 'AAAAAAAAA',
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

  it('handles when user type the key for admin but select back user role, the key input should be empty', () => {
    render(<SignUp />);

    const userCheckbox = screen.getByRole('checkbox', { name: 'User' });
    const adminCheckbox = screen.getByRole('checkbox', { name: 'Admin' });

    //expect usercheckbox to be checked
    expect(userCheckbox).toBeChecked();

    //click admin checkbox
    fireEvent.click(adminCheckbox);

    const keyInput = screen.getByLabelText('Key');
    expect(keyInput).toBeInTheDocument();
    fireEvent.change(keyInput, { target: { value: 'AAAAAAAAA' } });

    //click user checkbox again
    fireEvent.click(userCheckbox);

    //click again admin
    fireEvent.click(adminCheckbox);

    //expect key input to be empty
    expect(screen.getByLabelText('Key').value).toBe('');
  });
});
