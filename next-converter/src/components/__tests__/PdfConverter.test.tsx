import { render, screen, fireEvent } from '@testing-library/react';
import PdfConverter from '../PdfConverter';

describe('PdfConverter component', () => {
  test('shows page input when split selected', () => {
    render(<PdfConverter />);
    fireEvent.change(screen.getByLabelText('작업 선택:'), { target: { value: 'split' } });
    expect(screen.getByLabelText('페이지 번호:')).toBeInTheDocument();
  });
});
