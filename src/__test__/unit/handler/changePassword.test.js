import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useChangePassword from 'src/handlers/changePassword';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Change Password Hook', () => {
  const setPassword = jest.fn();
  const password = {
    old_password: 'oldPassword123',
    password: 'newPassword123',
    password_confirmation: 'newPassword123',
  };
  const email = 'test@example.com';

  afterEach(() => {
    mock.reset();
  });

  it('changes password successfully', async () => {
    const userData = {
      message: 'Password Successfully Updated',
    };

    mock.onPatch('/api/users/changepassword').reply(200, userData);
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.onUpdate(email, password, setPassword);
    });

    expect(result.current).toMatchObject({
      isPasswordLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isPasswordLoading: false,
        disable: false,
        isPasswordSuccess: 'Password Successfully Updated',
      })
    );

    expect(setPassword).toHaveBeenCalledWith({
      old_password: '',
      password: '',
      password_confirmation: '',
    });
  });

  it('it displays error when password does not match', async () => {
    const password = {
      old_password: 'oldPassword123',
      password: 'newPassword123',
      password_confirmation: 'newPassword124',
    };

    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.onUpdate(email, password, setPassword);
    });

    expect(result.current).toMatchObject({
      isPasswordLoading: false,
      disable: false,
      isPasswordError: 'Password does not match',
    });

    expect(setPassword).toHaveBeenCalledWith({
      old_password: '',
      password: '',
      password_confirmation: '',
    });
  });

  it('handles error when changing password fails', async () => {
    const userData = {
      error: { message: 'Old password is incorrect', type: 2 },
    };

    mock.onPatch('/api/users/changepassword').reply(400, userData);
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.onUpdate(email, password, setPassword);
    });

    expect(result.current).toMatchObject({
      isPasswordLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isPasswordLoading: false,
        disable: false,
        isPasswordError: 'Old password is incorrect',
      })
    );
  });

  it('displays a default error message when no message is provided', async () => {
    const userData = {
      error: { message: '' },
    };

    mock.onPatch('/api/users/changepassword').reply(500, userData);
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.onUpdate(email, password, setPassword);
    });

    expect(result.current).toMatchObject({
      isPasswordLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isPasswordLoading: false,
        disable: false,
        isPasswordError: 'An error occurred',
      })
    );
  });
});
