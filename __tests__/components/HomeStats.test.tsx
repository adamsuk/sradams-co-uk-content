import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import HomeStats from '../../components/HomeStats';
import { FEED_URL } from '../../components/RecentActivity';

const axiosMock = new AxiosMockAdapter(axios);

describe('HomeStats', () => {
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.onGet(FEED_URL).reply(200, { activities: [], github: { accounts: [] } });
  });

  it('starts collapsed on the mobile disclosure and leaves a desktop copy open', async () => {
    render(<HomeStats />);
    const summary = await screen.findByText('This week');
    const details = summary.closest('details');
    expect(details).not.toHaveAttribute('open');
    expect(details?.className).toContain('md:hidden');
    await waitFor(() => {
      expect(screen.getAllByRole('region', { name: 'Last 7 days' }).length).toBeGreaterThan(0);
    });
  });
});
