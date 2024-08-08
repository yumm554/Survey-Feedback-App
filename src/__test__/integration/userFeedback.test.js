import axios from 'axios';
import UserFeedback from 'src/app/userfeedback/page';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mock = new MockAdapter(axios);

describe('User Feedback Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    mock.reset();
  });

  it('handles successful me call, submits feedback, and displays messages on screen', async () => {
    /***************ME CALL***************/
    //setup mockup api for me call
    const userMeData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 0,
        email: 'testuser@example.com',
      },
    };
    mock.onGet('/api/users/me').reply(200, userMeData);

    //render the component
    render(<UserFeedback />);

    //check user returned on screen
    await waitFor(() => {
      //expect username and role in header
      expect(screen.getAllByText('testuser').length).toBe(1);
      expect(screen.getAllByText('User').length).toBe(1);

      expect(screen.getByLabelText('Email').value).toBe('testuser@example.com');
    });

    /***************SUBMIT FEEDBACK***************/
    //mock data for api
    const feedbackData = {
      message: 'Feedback submitted successfully',
    };

    mock.onPost('/api/users/userfeedback').reply(200, feedbackData);

    //render the required field
    const nameInput = screen.getByLabelText('Name');
    const commentInput = screen.getByLabelText('Comments');
    const rating5 = screen.getByLabelText('rate 5 stars');

    //submit form with values
    fireEvent.change(nameInput, {
      target: { value: 'Test User' },
    });
    fireEvent.change(commentInput, {
      target: { value: 'Great service!' },
    });

    fireEvent.click(rating5);
    expect(rating5).toHaveClass('active');
    const submitButton = screen.getByRole('button', {
      name: 'Submit Feedback',
    });
    fireEvent.click(submitButton);

    //check loading
    const loadingButton = screen.getByRole('button', {
      name: 'Submitting Feedback',
    });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    //check success msg on screen and redirection
    await waitFor(() => {
      expect(
        screen.getByText('Feedback submitted successfully')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('rate 3 stars')).toHaveClass('active');
      expect(commentInput.value).toBe('');
    });
  });

  it('handles feedback submission and displays error message on screen', async () => {
    //successful me call to check other failed api responses
    const userMeData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 0,
        email: 'testuser@example.com',
      },
    };
    mock.onGet('/api/users/me').reply(200, userMeData);

    //render the component
    render(<UserFeedback />);

    /***************SUBMIT FEEDBACK***************/
    //setup mock api
    const feedbackData = {
      error: 'An error occurred',
    };

    mock.onPost('/api/users/userfeedback').reply(500, feedbackData);

    //render the required field
    const nameInput = screen.getByLabelText('Name');
    const commentInput = screen.getByLabelText('Comments');
    const rating5 = screen.getByLabelText('rate 5 stars');

    //submit form with values
    fireEvent.change(nameInput, {
      target: { value: 'Test User' },
    });
    fireEvent.change(commentInput, {
      target: { value: 'Great service!' },
    });

    fireEvent.click(rating5);
    expect(rating5).toHaveClass('active');
    const submitButton = screen.getByRole('button', {
      name: 'Submit Feedback',
    });
    fireEvent.click(submitButton);

    //check loading
    const loadingButton = screen.getByRole('button', {
      name: 'Submitting Feedback',
    });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    //check error msg on screen
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });

  it('handles error on me call and retry', async () => {
    //setup mockup api for me call
    const userMeData = {
      error: 'Get user details failed',
    };
    mock.onGet('/api/users/me').reply(400, userMeData);

    //render the component
    render(<UserFeedback />);

    //expect error on screen
    await waitFor(() => {
      expect(
        screen.getByText(`Couldn't connect to the internet!`)
      ).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: 'try again' });
    expect(retryButton).toBeInTheDocument();

    // Set up mock API response for retry call
    const userMeRetryData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 0,
        email: 'testuser@example.com',
      },
    };
    mock.onGet('/api/users/me').reply(200, userMeRetryData);

    //test retry button
    fireEvent.click(retryButton);

    await waitFor(() => {
      //expect username and role in header
      expect(screen.getAllByText('testuser').length).toBe(1);
      expect(screen.getAllByText('User').length).toBe(1);

      expect(screen.getByLabelText('Email').value).toBe('testuser@example.com');
    });
  });
});
