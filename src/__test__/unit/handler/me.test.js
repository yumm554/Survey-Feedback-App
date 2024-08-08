import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import GetUserDetails from 'src/handlers/me';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Me Hook', () => {
  afterEach(() => {
    mock.reset();
  });

  it('handles successful me call when role is 0', async () => {
    const userData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 0,
        email: 'testuser@example.com',
        isAdmin: false,
      },
    };

    mock.onGet('/api/users/me').reply(200, userData);
    const { result } = renderHook(() => GetUserDetails());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isLoading: false,
        user: { username: 'testuser', role: 0, email: 'testuser@example.com' },
        isAdmin: false,
      })
    );
  });

  it('handles successful me call when role is 1', async () => {
    const userData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 1,
        email: 'testuser@example.com',
        isAdmin: true,
      },
    };

    mock.onGet('/api/users/me').reply(200, userData);
    const { result } = renderHook(() => GetUserDetails());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isLoading: false,
        user: {
          username: 'testuser',
          role: 1,
          email: 'testuser@example.com',
        },
        isAdmin: true,
      })
    );
  });

  it('handles error when fetching user', async () => {
    const userData = {
      error: 'Get user details failed',
    };
    mock.onGet('/api/users/me').reply(400, userData);
    const { result } = renderHook(() => GetUserDetails());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isLoading: false,
        user: { username: '', role: 0, email: '' },
        isAdmin: false,
        isError: 'Get user details failed',
      })
    );
  });
});
