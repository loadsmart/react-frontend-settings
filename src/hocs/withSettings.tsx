import type { ComponentType } from 'react';
import React from 'react';

import { useSettings } from '../hooks/useSettings';

interface Options {
  settingsMap: Record<string, string>;
  loadingComponent?: ComponentType;
}

function settingsToProps(settings: Array<boolean | null | unknown>, keys: string[]) {
  return keys.reduce<Record<string, boolean | null | unknown>>(
    (acc, curr, index) => ({ ...acc, [curr]: settings[index] }),
    {},
  );
}

export function withSettings<T>(WrappedComponent: ComponentType<T>, options: Options): ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  const flags = Object.values(options.settingsMap);
  const keys = Object.keys(options.settingsMap);

  const Component = (props: T) => {
    const { values, isLoading } = useSettings(flags);
    const settingsProps = settingsToProps(values, keys);

    if (isLoading && options.loadingComponent) {
      const LoadingComponent = options.loadingComponent;
      return <LoadingComponent />;
    }

    return <WrappedComponent {...settingsProps} {...props} />;
  };

  Component.displayName = `withSettings(${displayName})`;

  return Component;
}
