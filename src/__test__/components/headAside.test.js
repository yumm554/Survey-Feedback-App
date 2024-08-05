import { render, screen, fireEvent } from '@testing-library/react';
import HeadAside from '../../components/HeadAside';

describe('Head Aside Component', () => {
  const defaultProps = {
    colors: {
      normal: 'sample',
      lighter: 'lighter-sample',
      light: 'light-sample',
    },
  };

  it('elements on screen to render must', () => {
    render(<HeadAside {...defaultProps} />);
    const headerLogo = screen.getAllByAltText('PS logo');
    expect(headerLogo.length).toBe(2);

    headerLogo.forEach((logo) => {
      expect(logo).toHaveAttribute('src', expect.stringMatching('PS-logo.png'));
    });
  });

  it('check if correct props are rendered', () => {
    render(<HeadAside {...defaultProps} />);

    expect(screen.getByText('Your Voice Matters').previousSibling).toHaveClass(
      'sample'
    );
    expect(screen.getByText('Real Impact').previousSibling).toHaveClass(
      'lighter-sample'
    );
    expect(screen.getByText('Easy Participation').previousSibling).toHaveClass(
      'light-sample'
    );
  });
});
