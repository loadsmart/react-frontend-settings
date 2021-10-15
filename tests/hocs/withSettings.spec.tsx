import type { ReactNode } from 'react';
import React from 'react';
import { render, screen } from '@testing-library/react';

import { withSettings } from '~/src/hocs/withSettings';
import type { SettingsProviderValue } from '~/src/context/context';
import { SettingsContext } from '~/src/context/context';

describe('withSettings', () => {
  const Component = ({ dataTestId, children }: { dataTestId?: string; children: ReactNode }) => (
    <div data-testid={dataTestId}>{children}</div>
  );
  const LoadingComponent = () => <div data-testid="loadingComponent" />;

  const setup = (ui: ReactNode, { providerProps, ...renderOptions }: { providerProps: SettingsProviderValue }) => {
    render(<SettingsContext.Provider value={providerProps}>{ui}</SettingsContext.Provider>, renderOptions);
  };

  it('passes props down to wrapped component', async () => {
    const providerProps = {
      settings: { TEST_ID: 'with-settings' },
      flags: { ENABLED: true },
      isLoading: false,
    };

    const Wrapped = withSettings(Component, {
      settingsMap: { dataTestId: 'settings.TEST_ID' },
      loadingComponent: LoadingComponent,
    });

    setup(
      <Wrapped>
        <div data-testid="children" />
      </Wrapped>,
      { providerProps },
    );

    expect(screen.getByTestId(providerProps.settings.TEST_ID)).toBeVisible();
    expect(screen.queryByTestId('loadingComponent')).toBeFalsy();
  });

  it('allows user to override the prop', async () => {
    const providerProps = {
      settings: { TEST_ID: 'with-settings' },
      flags: { ENABLED: true },
      isLoading: false,
    };

    const Wrapped = withSettings(Component, {
      settingsMap: { dataTestId: 'settings.TEST_ID' },
      loadingComponent: LoadingComponent,
    });

    const newProp = 'new-prop-value';

    setup(
      <Wrapped dataTestId={newProp}>
        <div data-testid="children" />
      </Wrapped>,
      { providerProps },
    );

    expect(screen.getByTestId(newProp)).toBeVisible();
    expect(screen.queryByTestId('loadingComponent')).toBeFalsy();
  });

  it('renders loader when loading', async () => {
    const providerProps = {
      settings: { TEST_ID: 'with-settings' },
      flags: { ENABLED: true },
      isLoading: true,
    };

    const Wrapped = withSettings(Component, {
      settingsMap: { dataTestId: 'settings.TEST_ID' },
      loadingComponent: LoadingComponent,
    });

    setup(
      <Wrapped>
        <div data-testid="children" />
      </Wrapped>,
      { providerProps },
    );

    expect(screen.getByTestId('loadingComponent')).toBeVisible();
    expect(screen.queryByTestId(providerProps.settings.TEST_ID)).toBeFalsy();
  });

  it('pass down other props', async () => {
    const providerProps = {
      settings: { TEST_ID: 'with-settings' },
      flags: { ENABLED: true },
      isLoading: false,
    };

    const Wrapped = withSettings(Component, {
      settingsMap: { dataTestId: 'settings.TEST_ID' },
      loadingComponent: LoadingComponent,
    });

    setup(
      <Wrapped>
        <div data-testid="children" />
      </Wrapped>,
      { providerProps },
    );

    expect(screen.getByTestId('children')).toBeVisible();
  });
});
