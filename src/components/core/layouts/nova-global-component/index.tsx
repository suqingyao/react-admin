import { Suspense } from 'react';
import { getEnabledGlobalComponents } from '@/config/modules/component';

export function NovaGlobalComponent() {
  const components = getEnabledGlobalComponents();

  return (
    <>
      {components.map((config) => {
        const Component = config.component;
        return (
          <Suspense fallback={null} key={config.key}>
            <Component />
          </Suspense>
        );
      })}
    </>
  );
}
