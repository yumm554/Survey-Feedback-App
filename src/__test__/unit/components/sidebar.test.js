import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Sidebar from 'src/components/Sidebar';
import useDeleteAccount from 'src/handlers/deleteAccount';
import useLogout from 'src/handlers/logout';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('src/handlers/deleteAccount', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('src/handlers/logout', () => ({
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
      isAdmin: true,
    },
  };

  it('calls the logout function correctly', () => {
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

  it('handles loading state when logging in', () => {
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

  it('handles error state when login fails', () => {
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

  it('handles success state when login is successful', () => {
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

    const reallySubmitButton = screen.getByText('Really Delete?');
    expect(reallySubmitButton).toBeInTheDocument();
    expect(reallySubmitButton).toHaveClass('disabled');
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('shows loading state while deleting account', () => {
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

  it('shows error message when there is an error in deleting', () => {
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

  it('shows success message when account is deleted successfully', () => {
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

  it('handles visibility when active is list', () => {
    const defaultPropsActive = {
      data: {
        ...defaultProps.data,
        active: 'list',
      },
    };
    render(<Sidebar {...defaultPropsActive} />);

    expect(
      screen.getByText('Feedback Submissions').parentElement.parentElement
    ).toHaveClass('highlight-background');
    expect(screen.queryByText('Delete Account')).not.toBeInTheDocument();
  });

  it('handles visibility when isAdmin is false', () => {
    const defaultPropsIsAdmin = {
      data: {
        ...defaultProps.data,
        isAdmin: false,
      },
    };
    render(<Sidebar {...defaultPropsIsAdmin} />);

    expect(screen.queryByText('Feedback Submissions')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Reports')).not.toBeInTheDocument();
  });

  it('handles visibility when mobNav is true', () => {
    const defaultPropsMobNav = {
      data: {
        ...defaultProps.data,
        mobNav: true,
      },
    };
    render(<Sidebar {...defaultPropsMobNav} />);

    expect(screen.getByText('Open the survey')).toBeInTheDocument();
  });

  it('handles visibility when loading is true', () => {
    const defaultPropsLoading = {
      data: {
        ...defaultProps.data,
        isLoading: true,
      },
    };
    render(<Sidebar {...defaultPropsLoading} />);

    expect(
      screen.getAllByLabelText('sidebar item loader').length
    ).toBeGreaterThan(0);
  });
});
