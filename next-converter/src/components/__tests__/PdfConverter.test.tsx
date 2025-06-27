import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PdfConverter from '../PdfConverter';
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
  signOut: jest.fn(),
}));

describe('PdfConverter component', () => {
  test('shows page input when split selected', () => {
    render(<PdfConverter />);
    fireEvent.change(screen.getByLabelText('작업 선택:'), { target: { value: 'split' } });
    expect(screen.getByLabelText('페이지 번호:')).toBeInTheDocument();
  });
});
