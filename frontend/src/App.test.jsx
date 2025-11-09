import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders task manager heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/MERN Task Manager/i);
  expect(headingElement).toBeInTheDocument();
});
