import { render, screen, fireEvent } from '@testing-library/react';
import Header from 'src/components/Header';

describe('Header Component', () => {
  const defaultProps = {
    data: {
      user: { username: 'testuser', role: 0 },
      mobNav: false,
      setMobNav: jest.fn(),
      isLoading: false,
      sidebar: true,
      isAdmin: false,
    },
  };

  it('renders elements on screen', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Open the survey')).toBeInTheDocument();
  });

  it('toggles mobile navigation', () => {
    render(<Header {...defaultProps} />);

    //clicking the hamburger icon
    fireEvent.click(screen.getByLabelText('mob nav toggle'));
    expect(defaultProps.data.setMobNav).toHaveBeenCalledWith(true);
  });

  it('renders a basic header for user when sidebar is false', () => {
    const defaultPropsWithoutSidebar = {
      data: { ...defaultProps.data, sidebar: false },
    };
    render(<Header {...defaultPropsWithoutSidebar} />);

    expect(screen.getByText('Settings')).toBeInTheDocument();

    const logo = screen.getByAltText('PS logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringMatching('PS-logo.png'));
  });

  it('renders a basic header for admin when sidebar is false', () => {
    const defaultPropsWithoutSidebar = {
      data: {
        ...defaultProps.data,
        sidebar: false,
        isAdmin: true,
      },
    };
    render(<Header {...defaultPropsWithoutSidebar} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows loader when isLoading is true', () => {
    const defaultPropsWithLoading = {
      data: { ...defaultProps.data, isLoading: true },
    };
    render(<Header {...defaultPropsWithLoading} />);

    expect(screen.getAllByLabelText('header item loader').length).toBe(2);
  });
});
