import { render, screen } from '@testing-library/react';
import IconRenderer from './index';

describe('IconRenderer', () => {
  it('should render dashboard icon', () => {
    render(<IconRenderer icon="dashboardOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('DashboardOutlinedIcon')).toBeInTheDocument();
  });

  it('should render business icon', () => {
    render(<IconRenderer icon="businessOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('BusinessOutlinedIcon')).toBeInTheDocument();
  });

  it('should render event icon', () => {
    render(<IconRenderer icon="eventOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('EventOutlinedIcon')).toBeInTheDocument();
  });

  it('should render services icon', () => {
    render(<IconRenderer icon="servicesOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('BuildOutlinedIcon')).toBeInTheDocument();
  });

  it('should render person icon', () => {
    render(<IconRenderer icon="personOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('PersonOutlinedIcon')).toBeInTheDocument();
  });

  it('should render person add icon', () => {
    render(<IconRenderer icon="personAddOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('PersonAddOutlinedIcon')).toBeInTheDocument();
  });

  it('should render settings icon', () => {
    render(<IconRenderer icon="settingsOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('SettingsOutlinedIcon')).toBeInTheDocument();
  });

  it('should render home icon', () => {
    render(<IconRenderer icon="homeOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
  });

  it('should render devices icon', () => {
    render(<IconRenderer icon="devicesOutlined" color="primary" size="24px" />);
    expect(screen.getByTestId('DevicesOutlinedIcon')).toBeInTheDocument();
  });

  it('should return null for unknown icon', () => {
    const { container } = render(<IconRenderer icon="unknownIcon" color="primary" size="24px" />);
    expect(container.firstChild).toBeNull();
  });
});

