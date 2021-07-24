import React, { ComponentType } from 'react';

import { useSettings } from '@/hooks/useSettings';

interface Options<T> {
  flags: string[];
  loadingComponent?: ComponentType;
  fallbackComponent?: ComponentType<T>;
}

export function withFeatureFlag<T>(WrappedComponent: ComponentType<T>, options: Options<T>): ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const Component = (props: T) => {
    const { values, isLoading } = useSettings(options.flags);
    const isDisabled = values.filter((flag) => !flag).length > 0;

    if (!isDisabled && !isLoading) {
      return <WrappedComponent {...props} />;
    }

    if (isLoading && options.loadingComponent) {
      const LoadingComponent = options.loadingComponent;
      return <LoadingComponent />;
    }

    if (options.fallbackComponent) {
      const FallbackComponent = options.fallbackComponent;
      return <FallbackComponent {...props} />;
    }

    return null;
  };

  Component.displayName = `withFeatureFlag(${displayName})`;

  return Component;
}
