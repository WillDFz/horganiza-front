import { render, screen } from '@testing-library/react';
import TabContainer from './index';

describe('TabContainer', () => {
  it('should render children when value matches index', () => {
    render(
      <TabContainer value={0} index={0} key="test">
        <div>Tab Content</div>
      </TabContainer>
    );

    expect(screen.getByText(/tab content/i)).toBeInTheDocument();
  });

  it('should not render children when value does not match index', () => {
    render(
      <TabContainer value={0} index={1} key="test">
        <div>Tab Content</div>
      </TabContainer>
    );

    expect(screen.queryByText(/tab content/i)).not.toBeInTheDocument();
  });

  it('should have correct role and aria attributes', () => {
    render(
      <TabContainer value={0} index={0} key="test">
        <div>Tab Content</div>
      </TabContainer>
    );

    const tabPanel = screen.getByRole('tabpanel');
    expect(tabPanel).toHaveAttribute('id', 'simple-tabpanel-0');
    expect(tabPanel).toHaveAttribute('aria-labelledby', 'simple-tab-0');
  });

  it('should be hidden when value does not match index', () => {
    render(
      <TabContainer value={0} index={1} key="test">
        <div>Tab Content</div>
      </TabContainer>
    );

    const tabPanel = screen.getByRole('tabpanel', { hidden: true });
    expect(tabPanel).toHaveAttribute('hidden');
  });
});

