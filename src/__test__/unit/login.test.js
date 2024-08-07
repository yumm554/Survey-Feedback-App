import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Login from 'src/app/login/page';
import useLogin from 'src/handlers/login';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('src/handlers/login', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    useLogin.mockReturnValue({
      isLoginLoading: false,
      isLoginError: '',
      isLoginSuccess: '',
      onLogin: jest.fn(),
      disable: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<Login />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' }));
  });

  it('toggles the password visibility', () => {
    render(<Login />);
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

  it('submits the form', () => {
    const mockOnLogin = jest.fn();
    useLogin.mockReturnValue({
      isLoginLoading: false,
      isLoginError: '',
      isLoginSuccess: '',
      onLogin: mockOnLogin,
      disable: false,
    });

    render(<Login />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    expect(mockOnLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('shows loading state', () => {
    useLogin.mockReturnValue({
      isLoginLoading: true,
      isLoginError: '',
      isLoginSuccess: '',
      onLogin: jest.fn(),
      disable: true,
    });

    render(<Login />);
    const submitButton = screen.getByRole('button', { name: 'Logging In' });
    expect(submitButton).toBeDisabled();
  });

  it('shows error message', () => {
    useLogin.mockReturnValue({
      isLoginLoading: false,
      isLoginError: 'An error occurred',
      isLoginSuccess: '',
      onLogin: jest.fn(),
      disable: false,
    });

    render(<Login />);
    const errorMessage = screen.getByText('An error occurred');
    expect(errorMessage).toBeInTheDocument();
  });

  it('shows success message', () => {
    useLogin.mockReturnValue({
      isLoginLoading: false,
      isLoginError: '',
      isLoginSuccess: 'Redirecting...',
      onLogin: jest.fn(),
      disable: false,
    });

    render(<Login />);
    const successMessage = screen.getByText('Redirecting...');
    expect(successMessage).toBeInTheDocument();
  });
});
