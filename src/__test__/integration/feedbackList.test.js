import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import FeedbackList from '@/app/feedbacklist/page';
import { useRouter } from 'next/navigation';

// Mocking Next.js useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mock = new MockAdapter(axios);

describe('FeedbackList Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });

  afterEach(() => {
    mock.reset();
  });

  it('displays feedback list, handles pagination and logout correctly', async () => {
    //setup API call data
    const userMeData = {
      message: 'User found',
      user: {
        username: 'testuser',
        role: 0,
        email: 'testuser@example.com',
      },
    };

    const limit = 10;
    const feedbackData = {
      feedbacks: [
        {
          _id: '1',
          name: 'Test User 1',
          email: 'user1@example.com',
          rating: 5,
        },
        {
          _id: '2',
          name: 'Test User 2',
          email: 'user2@example.com',
          rating: 4,
        },
      ],
      pagination: {
        page: 1,
        totalPages: 2,
        totalFeedbacks: 4,
      },
    };

    const feedbackData2 = {
      feedbacks: [
        {
          _id: '3',
          name: 'Test User 3',
          email: 'user3@example.com',
          rating: 3,
        },
        {
          _id: '4',
          name: 'Test User 4',
          email: 'user4@example.com',
          rating: 2,
        },
      ],
      pagination: {
        page: 2,
        totalPages: 2,
        totalFeedbacks: 4,
      },
    };

    const userLogoutData = {
      message: 'Logout successfully',
    };

    //setup mock API calls
    mock.onGet('/api/users/me').reply(200, userMeData);
    mock
      .onGet(`/api/users/feedbacks?page=1&limit=${limit}`)
      .reply(200, feedbackData);
    mock
      .onGet(`/api/users/feedbacks?page=2&limit=${limit}`)
      .reply(200, feedbackData2);
    mock.onGet('/api/users/logout').reply(200, userLogoutData);

    //render the component
    render(<FeedbackList />);

    /***************LIST FEEDBACKS***************/
    //check loading
    expect(screen.getByText('loading...')).toBeInTheDocument();
    //check pagination buttons to be disabled
    expect(screen.getByLabelText('next button')).toHaveClass('disabled');
    expect(screen.getByLabelText('prev button')).toHaveClass('disabled');

    //check feedback data is displayed
    await waitFor(() => {
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Test User 2')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();

      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      expect(screen.getByLabelText('prev button')).toHaveClass('disabled');
    });

    //test pagination buttons
    fireEvent.click(screen.getByLabelText('next button'));
    await waitFor(() => {
      expect(screen.getByText('Test User 3')).toBeInTheDocument();
      expect(screen.getByText('user3@example.com')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Test User 4')).toBeInTheDocument();
      expect(screen.getByText('user4@example.com')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();

      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
      expect(screen.getByLabelText('next button')).toHaveClass('disabled');
    });

    fireEvent.click(screen.getByLabelText('prev button'));
    await waitFor(() => {
      expect(screen.getByLabelText('prev button')).toHaveClass('disabled');
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    /***************ME CALL***************/
    await waitFor(() => {
      //expect username and role in header
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    /***************LOGOUT***************/
    //click the logout button
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    //check loading
    expect(screen.getByText('Logging Out')).toBeInTheDocument();

    //check success
    await waitFor(() => {
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
    });
  });

  it('displays errors when API responses fail', async () => {
    //setup API call data
    const userMeData = {
      error: 'Get user details failed',
    };

    const limit = 2;
    const feedbackData = {
      erorr: 'An error occurred',
    };

    const userLogoutData = {
      error: 'An error occured',
    };

    //setup mock API calls
    mock.onGet('/api/users/me').reply(400, userMeData);
    mock
      .onGet(`/api/users/feedbacks?page=1&limit=${limit}`)
      .reply(500, feedbackData);
    mock.onPost('/api/users/logout').reply(500, userLogoutData);

    //render the component
    render(<FeedbackList />);

    /***************LIST FEEDBACKS***************/
    //check loading
    expect(screen.getByText('loading...')).toBeInTheDocument();
    //check pagination buttons to be disabled
    expect(screen.getByLabelText('next button')).toHaveClass('disabled');
    expect(screen.getByLabelText('prev button')).toHaveClass('disabled');

    //check error msg is displayed on screen
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
      expect(screen.getByLabelText('next button')).toHaveClass('disabled');
      expect(screen.getByLabelText('prev button')).toHaveClass('disabled');
    });

    /***************ME CALL***************/
    await waitFor(() => {
      //expect couldn't fetch in header
      expect(screen.getByText(`couldn't fetch`)).toBeInTheDocument();
    });

    /***************LOGOUT***************/
    //click the logout button
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    //check loading
    expect(screen.getByText('Logging Out')).toBeInTheDocument();

    //check success
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
