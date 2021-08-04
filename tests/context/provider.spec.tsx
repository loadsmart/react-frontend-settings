import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { SettingsProvider } from '@/context/provider';
import { SettingsContext } from '@/context/context';

describe('SettingsProvider', () => {
  const settings = {
    flags: {
      AAA: true,
      BBB: false,
      CCC: true,
    },
    settings: {
      DDD: 'foo',
      EEE: 'bar',
      FFF: 'baz',
    },
  };

  const stringify = (settings) => JSON.stringify(settings, null, 2);
  const getRendered = () => JSON.parse(document.querySelector('pre').textContent);

  const Children = () => (
    <SettingsContext.Consumer>{(value) => <pre>{stringify(value)}</pre>}</SettingsContext.Consumer>
  );

  const setup = () => {
    const queryClient = new QueryClient();
    const getSettings = jest.fn().mockResolvedValue(settings);
    render(
      <QueryClientProvider client={queryClient}>
        <SettingsProvider getSettings={getSettings}>
          <Children />
        </SettingsProvider>
      </QueryClientProvider>,
    );
    return { getSettings };
  };

  it('renders without crashing', () => {
    setup();
  });

  it('injects setting in the context', async () => {
    const { getSettings } = setup();

    expect(getRendered()).toStrictEqual({
      flags: {},
      settings: {},
      isLoading: true,
    });

    await waitFor(() => expect(getSettings).toHaveBeenCalled());

    expect(getRendered()).toStrictEqual({ ...settings, isLoading: false });
  });
});
