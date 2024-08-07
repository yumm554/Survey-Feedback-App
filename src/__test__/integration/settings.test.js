import axios from 'axios';
import Setting from 'src/app/settings/page';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mock = new MockAdapter(axios);

describe('Setting Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    mock.reset();
  });

  it('handles success on me call, password update, logout, and account deletion and display msgs on screen', async () => {
    /***************ME CALL***************/
    //setup mockup api for me call
    const userMeData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 0,
        email: 'testuser@example.com',
      },
    };
    mock.onGet('/api/users/me').reply(200, userMeData);

    //render the component
    render(<Setting />);

    //check user returned on screen
    await waitFor(() => {
      expect(screen.getByText('Username').nextSibling.textContent).toBe(
        'testuser'
      );
      expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
      expect(screen.getByText('Role').nextSibling.textContent).toBe('User');

      //expect username and role both in header and body
      expect(screen.getAllByText('testuser').length).toBe(2);
      expect(screen.getAllByText('User').length).toBe(2);
    });

    /***************UPDATE PASSWORD***************/
    //setup mock api to update password
    const userData = {
      message: 'Password Successfully Updated',
    };

    mock.onPatch('/api/users/changepassword').reply(200, userData);

    //render required values
    const oldPasswordInput = screen.getByLabelText('Old Password');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Update' });

    //submit form with values
    fireEvent.change(oldPasswordInput, {
      target: { value: 'oldPassword123' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newPassword123' },
    });
    fireEvent.click(submitButton);

    //check loading
    const loadingButton = screen.getByRole('button', { name: 'Updating' });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    //check success msg on screen and redirection
    await waitFor(() => {
      expect(
        screen.getByText('Password Successfully Updated')
      ).toBeInTheDocument();
      expect(oldPasswordInput.value).toBe('');
      expect(passwordInput.value).toBe('');
      expect(confirmPasswordInput.value).toBe('');
    });

    /***************LOGOUT***************/
    //mock for logout
    const userLogoutData = {
      message: 'logout successfully',
    };
    mock.onGet('/api/users/logout').reply(200, userLogoutData);

    //click the logout function
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    //check loading
    expect(screen.getByText('Logging Out')).toBeInTheDocument();

    //check success
    await waitFor(() => {
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
    });

    /***************DELETE ACCOUNT***************/
    //mock delete call
    const userDeleteData = {
      message: 'User deleted successfully',
    };

    mock.onDelete('/api/users/deleteaccount').reply(200, userDeleteData);

    //click delete button
    fireEvent.click(screen.getByText('Delete Account'));

    //check delete model to confirm
    const deleteButton = screen.getByText('Really Delete?');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    //expect loading
    expect(screen.getByText('deleting...')).toBeInTheDocument();

    //check success msg on screen
    await waitFor(() =>
      expect(screen.getByText('User deleted successfully')).toBeInTheDocument()
    );
  });

  it('handles error on password update, logout, and account deletion and display msgs on screen', async () => {
    //successful me call to check other failed api responses
    const userMeData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 0,
        email: 'testuser@example.com',
      },
    };
    mock.onGet('/api/users/me').reply(200, userMeData);

    //render the component
    render(<Setting />);

    /***************UPDATE PASSWORD***************/
    //setup mock api to update password
    const userData = {
      error: { message: 'Old password is incorrect', type: 2 },
    };

    mock.onPatch('/api/users/changepassword').reply(400, userData);

    //render required values
    const oldPasswordInput = screen.getByLabelText('Old Password');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Update' });

    //submit form with values
    fireEvent.change(oldPasswordInput, {
      target: { value: 'oldPassword123' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newPassword123' },
    });
    fireEvent.click(submitButton);

    //check loading
    expect(
      screen.getByRole('button', { name: 'Updating' })
    ).toBeInTheDocument();

    //check error msg on screen
    await waitFor(() => {
      expect(screen.getByText('Old password is incorrect')).toBeInTheDocument();
    });

    /***************LOGOUT***************/
    //mock for logout
    const userLogoutData = {
      error: 'An error occured',
    };

    mock.onPost('/api/users/logout').reply(500, userLogoutData);

    //click the logout function
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    //check loading
    expect(screen.getByText('Logging Out')).toBeInTheDocument();

    //check success
    await waitFor(() => {
      expect(screen.getByText('An error occured')).toBeInTheDocument();
    });

    /***************DELETE ACCOUNT***************/
    //mock delete call
    const userDeleteData = {
      error: 'An error occurred',
    };

    mock.onDelete('/api/users/deleteaccount').reply(500, userDeleteData);

    //click delete button
    fireEvent.click(screen.getByText('Delete Account'));

    //check delete model to confirm
    const deleteButton = screen.getByText('Really Delete?');
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    //expect loading
    expect(screen.getByText('deleting...')).toBeInTheDocument();

    //check success msg on screen
    await waitFor(() =>
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    );
  });

  it('handles when password does not match', async () => {
    //setup mock api
    const userData = {
      message: 'Password Successfully Updated',
    };

    mock.onPatch('/api/users/changepassword').reply(200, userData);

    //render the component and required field
    render(<Setting />);
    const oldPasswordInput = screen.getByLabelText('Old Password');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Update' });

    //submit form with values
    fireEvent.change(oldPasswordInput, {
      target: { value: 'oldPassword123' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newPassword124' },
    });
    fireEvent.click(submitButton);

    //check error msg for password does not match
    await waitFor(() => {
      expect(screen.getByText('Password does not match')).toBeInTheDocument();
      expect(passwordInput.value).toBe('');
      expect(confirmPasswordInput.value).toBe('');
    });
  });

  it('handles error on me call and retry', async () => {
    //setup mockup api for me call
    const userMeData = {
      error: 'Get user details failed',
    };
    mock.onGet('/api/users/me').reply(400, userMeData);

    //render the component
    render(<Setting />);

    //expect error on screen
    await waitFor(() => {
      expect(
        screen.getByText(`Couldn't connect to the internet!`)
      ).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: 'try again' });
    expect(retryButton).toBeInTheDocument();

    // Set up mock API response for retry call
    const userMeRetryData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 0,
        email: 'testuser@example.com',
      },
    };
    mock.onGet('/api/users/me').reply(200, userMeRetryData);

    //test retry button
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Username').nextSibling.textContent).toBe(
        'testuser'
      );
      expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
      expect(screen.getByText('Role').nextSibling.textContent).toBe('User');

      //expect username and role both in header and body
      expect(screen.getAllByText('testuser').length).toBe(2);
      expect(screen.getAllByText('User').length).toBe(2);
    });
  });
});
