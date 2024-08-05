import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useDeleteAccount from '../../handlers/deleteAccount';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mock = new MockAdapter(axios);

describe('Delete Hook', () => {
  const mockPush = jest.fn();
  const email = 'test@example.com';

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    mock.reset();
  });

  it('should fetch user details', async () => {
    const userData = {
      message: 'User deleted successfully',
    };

    mock.onDelete('/api/users/deleteaccount').reply(200, userData);
    const { result } = renderHook(() => useDeleteAccount());
    act(() => {
      result.current.onDelete(email);
    });

    expect(result.current).toMatchObject({
      isDeleteLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isDeleteLoading: false,
        disable: false,
        isDeleteSuccess: 'User deleted successfully',
      })
    );

    expect(mockPush).toHaveBeenCalledWith('/signup');
  });

  it('error fetching data', async () => {
    const userData = {
      error: 'An error occurred',
    };

    mock.onDelete('/api/users/deleteaccount').reply(500, userData);
    const { result } = renderHook(() => useDeleteAccount());
    act(() => {
      result.current.onDelete(email);
    });

    expect(result.current).toMatchObject({
      isDeleteLoading: true,
      disable: true,
    });

    await waitFor(() =>
      expect(result.current).toMatchObject({
        isDeleteLoading: false,
        disable: false,
        isDeleteError: 'An error occurred',
      })
    );
  });
});
