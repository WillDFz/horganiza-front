import { render, screen } from '@testing-library/react';
import StaffPage from './page';

jest.mock('@/components/features/staff/MembersList', () => {
  return function MockStaffList() {
    return <div data-testid="staff-list">Staff List Component</div>;
  };
});

describe('Staff Page', () => {
  it('should render StaffList component', () => {
    render(<StaffPage />);
    
    expect(screen.getByTestId('staff-list')).toBeInTheDocument();
  });

  it('should render StaffList inside container div', () => {
    const { container } = render(<StaffPage />);
    
    const wrapperDiv = container.querySelector('div');
    expect(wrapperDiv).toBeInTheDocument();
    expect(screen.getByTestId('staff-list')).toBeInTheDocument();
  });

  it('should have correct structure', () => {
    const { container } = render(<StaffPage />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.tagName).toBe('DIV');
    expect(mainDiv.querySelector('[data-testid="staff-list"]')).toBeInTheDocument();
  });
});

