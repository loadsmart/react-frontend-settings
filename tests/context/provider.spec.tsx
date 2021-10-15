import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import { SettingsProvider } from '../../src/context/provider';
import type { SettingsProviderValue } from '../../src/context/context';
import { SettingsContext } from '../../src/context/context';

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

  const stringify = (settings: SettingsProviderValue) => JSON.stringify(settings, null, 2);
  const getRendered = () => JSON.parse(document.querySelector('pre')?.textContent ?? '{}');

  const Children = () => (
    <SettingsContext.Consumer>{(value) => <pre>{stringify(value)}</pre>}</SettingsContext.Consumer>
  );

  const setup = () => {
    const getSettings = jest.fn().mockResolvedValue(settings);
    render(
      <SettingsProvider getSettings={getSettings}>
        <Children />
      </SettingsProvider>,
    );
    return { getSettings };
  };

  it('renders without crashing', async () => {
    setup();

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });
  });

  it('injects setting in the context', async () => {
    const { getSettings } = setup();

    expect(getRendered()).toStrictEqual({
      flags: {},
      settings: {},
      isLoading: true,
    });

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
    });

    await waitFor(() => expect(getSettings).toHaveBeenCalled());

    expect(getRendered()).toStrictEqual({ ...settings, isLoading: false });
  });
});
