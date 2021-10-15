import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import { SettingsProvider } from 'context/provider';
import type { SettingsProviderValue } from 'context/context';
import { SettingsContext } from 'context/context';

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

  type Props = React.ComponentProps<typeof SettingsProvider>;

  const setup = (props: Partial<Props> = {}) => {
    const getSettings = props.getSettings || jest.fn().mockResolvedValue(settings);
    const options = props.options || {};

    render(
      <SettingsProvider getSettings={getSettings} options={options}>
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

  describe('onGetSettingsFail', () => {
    beforeEach(jest.useFakeTimers);
    afterEach(jest.useRealTimers);

    it('keep-last', async () => {
      const getSettings = jest.fn().mockResolvedValueOnce(settings).mockRejectedValueOnce({}) as Props['getSettings'];
      const options = { onGetSettingsFail: 'keep-last' } as Props['options'];
      setup({ getSettings, options });

      expect(getRendered()).toStrictEqual({
        flags: {},
        settings: {},
        isLoading: true,
      });

      await waitFor(() => expect(getSettings).toHaveBeenCalledTimes(1));

      expect(getRendered()).toStrictEqual({ ...settings, isLoading: false });

      act(() => {
        jest.advanceTimersByTime(10 * 60 * 1000);
      });

      await waitFor(() => expect(getSettings).toHaveBeenCalledTimes(2));

      expect(getRendered()).toStrictEqual({ ...settings, isLoading: false });
    });

    it('reset', async () => {
      const getSettings = jest.fn().mockResolvedValueOnce(settings).mockRejectedValueOnce({}) as Props['getSettings'];
      const options = { onGetSettingsFail: 'reset' } as Props['options'];
      setup({ getSettings, options });

      expect(getRendered()).toStrictEqual({
        flags: {},
        settings: {},
        isLoading: true,
      });

      await waitFor(() => expect(getSettings).toHaveBeenCalledTimes(1));

      expect(getRendered()).toStrictEqual({ ...settings, isLoading: false });

      act(() => {
        jest.advanceTimersByTime(10 * 60 * 1000);
      });

      await waitFor(() => expect(getSettings).toHaveBeenCalledTimes(2));

      expect(getRendered()).toStrictEqual({ flags: {}, settings: {}, isLoading: false });
    });
  });
});
