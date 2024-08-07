import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useLogin from 'src/handlers/login';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mock = new MockAdapter(axios);

describe('Login Hook', () => {
  const mockPush = jest.fn();
  const user = { email: 'test@example.com', password: 'Password123' };

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    mock.reset();
  });

  it('handles successful login', async () => {
    const userData = {
      message: 'Login successful',
      role: 1,
    };

    mock.onPost('/api/users/login').reply(200, userData);
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.onLogin(user);
    });

    expect(result.current).toMatchObject({
      isLoginLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isLoginLoading: false,
        disable: false,
        isLoginSuccess: 'Redirecting...',
      })
    );

    expect(mockPush).toHaveBeenCalledWith('/feedbacklist');
  });

  it('handles error when logging in', async () => {
    const userData = {
      error: { message: 'User doesnt exist', type: 1 },
    };

    mock.onPost('/api/users/login').reply(401, userData);
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.onLogin(user);
    });

    expect(result.current).toMatchObject({
      isLoginLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isLoginLoading: false,
        disable: false,
        isLoginError: 'User doesnt exist',
      })
    );
  });

  it('displays a default error message when no message is provided', async () => {
    const userData = {
      error: { message: '' },
    };

    mock.onPost('/api/users/login').reply(500, userData);
    const { result } = renderHook(() => useLogin());
    act(() => {
      result.current.onLogin(user);
    });

    expect(result.current).toMatchObject({
      isLoginLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isLoginLoading: false,
        disable: false,
        isLoginError: 'An error occurred',
      })
    );
  });
});
