import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useLogout from 'src/handlers/logout';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mock = new MockAdapter(axios);

describe('Logout Hook', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    mock.reset();
  });

  it('handles successful logout', async () => {
    const userData = {
      message: 'logout successfully',
    };

    mock.onGet('/api/users/logout').reply(200, userData);
    const { result } = renderHook(() => useLogout());
    act(() => {
      result.current.onLogout();
    });

    expect(result.current).toMatchObject({
      isLogoutLoading: true,
      logoutDisable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isLogoutLoading: false,
        logoutDisable: false,
        isLogoutSuccess: 'Redirecting...',
      })
    );

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('handles error when logging out', async () => {
    const userData = {
      error: 'An error occured',
    };

    mock.onPost('/api/users/logout').reply(500, userData);
    const { result } = renderHook(() => useLogout());
    act(() => {
      result.current.onLogout();
    });

    expect(result.current).toMatchObject({
      isLogoutLoading: true,
      logoutDisable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isLogoutLoading: false,
        logoutDisable: false,
        isLogoutError: 'An error occured',
      })
    );
  });
});
