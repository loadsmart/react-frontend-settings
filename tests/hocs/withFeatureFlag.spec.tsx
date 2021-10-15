import type { ReactNode } from 'react';
import React from 'react';
import { render, screen } from '@testing-library/react';

import { withFeatureFlag } from '~/src/hocs/withFeatureFlag';
import type { SettingsProviderValue } from '~/src/context/context';
import { SettingsContext } from '~/src/context/context';

describe('withFeatureFlag', () => {
  const Component = () => <div data-testid="component" />;
  const FallbackComponent = () => <div data-testid="fallbackComponent" />;
  const LoadingComponent = () => <div data-testid="loadingComponent" />;

  const setup = (ui: ReactNode, { providerProps, ...renderOptions }: { providerProps: SettingsProviderValue }) => {
    render(<SettingsContext.Provider value={providerProps}>{ui}</SettingsContext.Provider>, renderOptions);
  };

  it('render default component if enabled', async () => {
    const providerProps = {
      settings: {},
      flags: { ENABLED: true },
      isLoading: false,
    };

    const Wrapped = withFeatureFlag(Component, {
      flags: ['flags.ENABLED'],
      loadingComponent: LoadingComponent,
      fallbackComponent: FallbackComponent,
    });

    setup(<Wrapped />, { providerProps });

    expect(screen.getByTestId('component')).toBeVisible();
    expect(screen.queryByTestId('fallbackComponent')).toBeFalsy();
    expect(screen.queryByTestId('loadingComponent')).toBeFalsy();
  });

  it('render fallback component if disabled', async () => {
    const providerProps = {
      settings: {},
      flags: { DISABLED: false },
      isLoading: false,
    };

    const Wrapped = withFeatureFlag(Component, {
      flags: ['flags.DISABLED'],
      loadingComponent: LoadingComponent,
      fallbackComponent: FallbackComponent,
    });

    setup(<Wrapped />, { providerProps });

    expect(screen.getByTestId('fallbackComponent')).toBeVisible();
    expect(screen.queryByTestId('component')).toBeFalsy();
    expect(screen.queryByTestId('loadingComponent')).toBeFalsy();
  });

  it('render loading component if loading', async () => {
    const providerProps = {
      settings: {},
      flags: { DISABLED: false },
      isLoading: true,
    };

    const Wrapped = withFeatureFlag(Component, {
      flags: ['flags.DISABLED'],
      loadingComponent: LoadingComponent,
      fallbackComponent: FallbackComponent,
    });

    setup(<Wrapped />, { providerProps });

    expect(screen.getByTestId('loadingComponent')).toBeVisible();
    expect(screen.queryByTestId('component')).toBeFalsy();
    expect(screen.queryByTestId('fallbackComponent')).toBeFalsy();
  });
});
