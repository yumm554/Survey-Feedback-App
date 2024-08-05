import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component', () => {
  const defaultProps = {
    data: {
      user: { username: 'testuser', role: 0 },
      mobNav: false,
      setMobNav: jest.fn(),
      isLoading: false,
      sidebar: true,
    },
  };

  it('elements on screen to render must', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Open the survey')).toBeInTheDocument();
  });

  it('toggles mobile navigation', () => {
    render(<Header {...defaultProps} />);

    // Simulate clicking the hamburger icon
    fireEvent.click(screen.getByLabelText('mob nav toggle'));
    expect(defaultProps.data.setMobNav).toHaveBeenCalledWith(true);
  });

  it('renders settings link and PS logo when sidebar is false', () => {
    const defaultPropsWithoutSidebar = {
      data: { ...defaultProps.data, sidebar: false },
    };
    render(<Header {...defaultPropsWithoutSidebar} />);

    // Check if the settings link is rendered
    expect(screen.getByText('Settings')).toBeInTheDocument();

    //PS logo
    const logo = screen.getByAltText('PS logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringMatching('PS-logo.png'));
  });

  it('shows loader when isLoading is true', () => {
    const defaultPropsWithLoading = {
      data: { ...defaultProps.data, isLoading: true },
    };
    render(<Header {...defaultPropsWithLoading} />);

    // Check if the loaders are displayed
    expect(screen.getAllByLabelText('header loader').length).toBe(2);
  });
});
