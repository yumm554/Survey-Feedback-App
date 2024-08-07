import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useSignup from 'src/handlers/signup';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mock = new MockAdapter(axios);

describe('Signup Hook', () => {
  const mockPush = jest.fn();
  const setUser = jest.fn();
  const user = {
    username: 'testuser',
    email: 'test@example.com',
    role: 0,
    key: '',
    password: 'Password123',
    password_confirmation: 'Password123',
  };

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    mock.reset();
  });

  it('handles successful signup', async () => {
    const userData = {
      message: 'Successfully Signed Up',
    };

    mock.onPost('/api/users/signup').reply(200, userData);
    const { result } = renderHook(() => useSignup());
    act(() => {
      result.current.onSignUp(user, setUser);
    });

    expect(result.current).toMatchObject({
      isSignupLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isSignupLoading: false,
        disable: false,
        isSignupSuccess: 'Successfully Signed Up',
      })
    );

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('handles error when password does not match', async () => {
    const user = {
      username: 'testuser',
      email: 'test@example.com',
      role: 0,
      key: '',
      password: 'Password123',
      password_confirmation: 'Password124',
    };

    const { result } = renderHook(() => useSignup());
    act(() => {
      result.current.onSignUp(user, setUser);
    });

    expect(result.current).toMatchObject({
      isSignupLoading: false,
      disable: false,
      isSignupError: 'Password does not match',
    });

    expect(setUser).toHaveBeenCalledWith({
      ...user,
      password: '',
      password_confirmation: '',
    });
  });

  it('handles error when signing up', async () => {
    const userData = {
      error: { message: 'User already exists', type: 2 },
    };

    mock.onPost('/api/users/signup').reply(400, userData);
    const { result } = renderHook(() => useSignup());
    act(() => {
      result.current.onSignUp(user, setUser);
    });

    expect(result.current).toMatchObject({
      isSignupLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isSignupLoading: false,
        disable: false,
        isSignupError: 'User already exists',
      })
    );
  });

  it('displays a default error message when no message is provided', async () => {
    const userData = {
      error: { message: '' },
    };

    mock.onPost('/api/users/signup').reply(500, userData);
    const { result } = renderHook(() => useSignup());
    act(() => {
      result.current.onSignUp(user, setUser);
    });

    expect(result.current).toMatchObject({
      isSignupLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isSignupLoading: false,
        disable: false,
        isSignupError: 'An error occurred',
      })
    );
  });
});
