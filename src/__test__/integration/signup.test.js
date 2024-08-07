import axios from 'axios';
import SignUp from 'src/app/signup/page';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mock = new MockAdapter(axios);

describe('Signup Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    mock.reset();
  });

  it('signs up successfully as a User and displays a success message on the screen', async () => {
    //setup mock api
    const userData = {
      message: 'Successfully Signed Up',
    };

    mock.onPost('/api/users/signup').reply(200, userData);

    //render the component and required field
    render(<SignUp />);
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const userCheckbox = screen.getByRole('checkbox', { name: 'User' });
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    //submit form with values
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(userCheckbox);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });
    fireEvent.click(submitButton);

    //check loading
    const loadingButton = screen.getByRole('button', { name: 'Signing Up' });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    //check success msg on screen and redirection
    await waitFor(() => {
      expect(screen.getByText('Successfully Signed Up')).toBeInTheDocument();
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('signs up successfully as a User and displays a success message on the screen', async () => {
    //setup mock api
    const userData = {
      message: 'Successfully Signed Up',
    };

    mock.onPost('/api/users/signup').reply(200, userData);

    //render the component and required field
    render(<SignUp />);
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const adminCheckbox = screen.getByRole('checkbox', { name: 'Admin' });
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    //submit form with values
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(adminCheckbox);
    fireEvent.change(screen.getByLabelText('Key'), {
      target: { value: 'AAAAAAAAA' },
    });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });
    fireEvent.click(submitButton);

    //check loading
    expect(
      screen.getByRole('button', { name: 'Signing Up' })
    ).toBeInTheDocument();

    //check success msg on screen and redirection
    await waitFor(() => {
      expect(screen.getByText('Successfully Signed Up')).toBeInTheDocument();
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('displays an error message when passwords do not match', async () => {
    //setup mock api
    const userData = {
      message: 'Successfully Signed Up',
    };

    mock.onPost('/api/users/signup').reply(200, userData);

    //render the component and required field
    render(<SignUp />);
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const userCheckbox = screen.getByRole('checkbox', { name: 'User' });
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    //submit form with values
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(userCheckbox);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password124' },
    });
    fireEvent.click(submitButton);

    //check error msg for password does not match
    await waitFor(() => {
      expect(screen.getByText('Password does not match')).toBeInTheDocument();
      expect(passwordInput.value).toBe('');
      expect(confirmPasswordInput.value).toBe('');
    });
  });

  it('displays an error message when sign-up fails', async () => {
    //setup mock api
    const userData = {
      error: { message: 'User already exists', type: 2 },
    };

    mock.onPost('/api/users/signup').reply(400, userData);

    //render the component and required field
    render(<SignUp />);
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const userCheckbox = screen.getByRole('checkbox', { name: 'User' });
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    //submit form with values
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(userCheckbox);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });
    fireEvent.click(submitButton);

    //check loading
    expect(
      screen.getByRole('button', { name: 'Signing Up' })
    ).toBeInTheDocument();

    //check error msg on screen
    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('displays a default error message when no message is provided', async () => {
    //setup mock api
    const userData = {
      error: { message: '' },
    };

    mock.onPost('/api/users/signup').reply(500, userData);

    //render the component and required field
    render(<SignUp />);
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const userCheckbox = screen.getByRole('checkbox', { name: 'User' });
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    //submit form with values
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(userCheckbox);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123' },
    });
    fireEvent.click(submitButton);

    //check loading
    expect(
      screen.getByRole('button', { name: 'Signing Up' })
    ).toBeInTheDocument();

    //check default error msg on screen
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
