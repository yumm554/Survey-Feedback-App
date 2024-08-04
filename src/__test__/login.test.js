import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../app/login/page';

describe('Login', () => {
  it('renders without crashing', () => {
    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check if the email and password fields are rendered
    expect(getByLabelText(/Email/i)).toBeInTheDocument();
    expect(getByLabelText(/Password/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });
});
