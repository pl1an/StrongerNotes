import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';

jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    LineChart: () => <div data-testid="line-chart" />
  };
});

let mockCurrentInitialEntry = '/';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: any) => {
      const { MemoryRouter } = actual;
      return <MemoryRouter initialEntries={[mockCurrentInitialEntry]}>{children}</MemoryRouter>;
    }
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockCurrentInitialEntry = '/';
  localStorage.clear();
});

describe('AppRouting', () => {
  it('Landing page renders on /', async () => {
    mockCurrentInitialEntry = '/';
    render(<App />);
    expect(screen.getByText(/Scientific precision for/i)).toBeInTheDocument();
  });

  it('Login page renders on /login', async () => {
    mockCurrentInitialEntry = '/login';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('Register page renders on /register', async () => {
    mockCurrentInitialEntry = '/register';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
  });

  it('Protected routes redirect to /login when unauthenticated', async () => {
    mockCurrentInitialEntry = '/dashboard';
    
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    });
  });

  it('Protected routes render when authenticated', async () => {
    mockCurrentInitialEntry = '/dashboard';
    localStorage.setItem('auth_token', 'fake-token');
    localStorage.setItem('auth_user', JSON.stringify({ id: '1', name: 'User', email: 'test@test.com' }));

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, User!/i)).toBeInTheDocument();
    });
  });
});
