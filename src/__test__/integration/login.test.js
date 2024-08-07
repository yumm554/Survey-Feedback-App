import axios from 'axios';
import Login from 'src/app/login/page';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mock = new MockAdapter(axios);

describe('Login Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    mock.reset();
  });

  it('handles login successfully and display success msg on screen', async () => {
    //setup mock api
    const userData = {
      message: 'Login successful',
      role: 1,
    };

    mock.onPost('/api/users/login').reply(200, userData);

    //render the component and required field
    render(<Login />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    //submit form with values
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    //check loading
    const loadingButton = screen.getByRole('button', { name: 'Logging In' });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    //check success msg on screen and redirection
    await waitFor(() => {
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
    });
    expect(mockPush).toHaveBeenCalledWith('/feedbacklist');
  });

  it('handles error logging in and show error msg on screen', async () => {
    //setup mock api
    const userData = {
      error: { message: 'User doesnt exist', type: 1 },
    };

    mock.onPost('/api/users/login').reply(401, userData);

    //render the component and required field
    render(<Login />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    //submit form with values
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    //check loading
    expect(
      screen.getByRole('button', { name: 'Logging In' })
    ).toBeInTheDocument();

    //check error msg on screen
    await waitFor(() => {
      expect(screen.getByText('User doesnt exist')).toBeInTheDocument();
    });
  });

  it('displays a default message when no msg is provided', async () => {
    //setup mock api
    const userData = {
      error: { message: '', type: 1 },
    };

    mock.onPost('/api/users/login').reply(500, userData);

    //render the component and required field
    render(<Login />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    //submit form with values
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    //check loading
    expect(
      screen.getByRole('button', { name: 'Logging In' })
    ).toBeInTheDocument();

    //check default error msg on screen
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
