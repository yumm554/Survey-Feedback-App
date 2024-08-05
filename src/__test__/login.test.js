import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Login from '../app/login/page';
import useLogin from '../handlers/login';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../handlers/login', () => ({
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
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i }));
  });

  it('toggles the password visibility', () => {
    render(<Login />);
    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleButton = screen.getByLabelText('toggle eye visibility');

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
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log In/i });

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
    const submitButton = screen.getByRole('button', { name: /Logging In/i });
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
    const errorMessage = screen.getByText(/An error occurred/i);
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
    const successMessage = screen.getByText(/Redirecting.../i);
    expect(successMessage).toBeInTheDocument();
  });
});
