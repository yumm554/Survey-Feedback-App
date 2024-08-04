import { render, screen } from '@testing-library/react';
import Login from '../app/login/page';

describe('Login', () => {
  it('renders without crashing', () => {
    const { getByLabelText, getByRole } = render(<Login />);

    // Check if the email and password fields are rendered
    expect(getByLabelText(/Email/i)).toBeInTheDocument();
    expect(getByLabelText(/Password/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });
});
