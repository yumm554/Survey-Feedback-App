import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import useDeleteAccount from '../../handlers/deleteAccount';
import useLogout from '../../handlers/logout';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../handlers/deleteAccount', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../handlers/logout', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    useDeleteAccount.mockReturnValue({
      isDeleteLoading: false,
      isDeleteError: '',
      isDeleteSuccess: '',
      onDelete: jest.fn(),
      disable: false,
    });

    useLogout.mockReturnValue({
      isLogoutLoading: false,
      isLogoutError: '',
      isLogoutSuccess: '',
      logoutDisable: false,
      onLogout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    data: {
      user: { username: 'testuser', email: 'test@example.com', role: 1 },
      mobNav: false, //toggle it to test both mobile and desktop states
      setMobNav: jest.fn(),
      isLoading: false,
      active: 'settings',
      sidebar: true, //must toggle it when toggle mobNav
      isAdmin: true, //toggle it to test for the user and admin
    },
  };

  it('logout function call correctly', () => {
    const mockOnLogout = jest.fn();
    useLogout.mockReturnValue({
      isLogoutLoading: false,
      isLogoutError: '',
      isLogoutSuccess: '',
      logoutDisable: false,
      onLogout: mockOnLogout,
    });
    render(<Sidebar {...defaultProps} />);

    fireEvent.click(screen.getByText('Logout'));

    expect(mockOnLogout).toHaveBeenCalledWith();
  });

  it('logout function loading state', () => {
    useLogout.mockReturnValue({
      isLogoutLoading: true,
      isLogoutError: '',
      isLogoutSuccess: '',
      logoutDisable: true,
      onLogout: jest.fn(),
    });
    render(<Sidebar {...defaultProps} />);

    const submitButton = screen.getByText('Logging Out');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass('disabled');
  });

  it('logout function error state', () => {
    useLogout.mockReturnValue({
      isLogoutLoading: false,
      isLogoutError: 'An error occurred',
      isLogoutSuccess: '',
      logoutDisable: false,
      onLogout: jest.fn(),
    });
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('logout function success state', () => {
    useLogout.mockReturnValue({
      isLogoutLoading: false,
      isLogoutError: '',
      isLogoutSuccess: 'Redirecting...',
      logoutDisable: false,
      onLogout: jest.fn(),
    });
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });

  it('shows delete confirmation model', () => {
    useDeleteAccount.mockReturnValue({
      isDeleteLoading: false,
      isDeleteError: '',
      isDeleteSuccess: '',
      onDelete: jest.fn(),
      disable: true,
    });

    render(<Sidebar {...defaultProps} />);

    const submitButton = screen.getByText('Delete Account');

    fireEvent.click(submitButton);
    const cancelButton = screen.getByText('Cancel');
    expect(screen.getByText('Really Delete?')).toBeInTheDocument();

    //expect button to be disables
    expect(screen.getByText('Really Delete?')).toHaveClass('disabled');

    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('shows loading state while submitting', () => {
    useDeleteAccount.mockReturnValue({
      isDeleteLoading: true,
      isDeleteError: '',
      isDeleteSuccess: '',
      onDelete: jest.fn(),
      disable: true,
    });

    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('deleting...')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    useDeleteAccount.mockReturnValue({
      isDeleteLoading: false,
      isDeleteError: 'An error occurred',
      isDeleteSuccess: '',
      onDelete: jest.fn(),
      disable: false,
    });

    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('shows success message when feedback is successfully submitted', () => {
    useDeleteAccount.mockReturnValue({
      isDeleteLoading: false,
      isDeleteError: '',
      isDeleteSuccess: 'User deleted successfully',
      onDelete: jest.fn(),
      disable: false,
    });

    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('User deleted successfully')).toBeInTheDocument();
  });
});
