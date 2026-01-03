import type { IconProps } from '@iconify/react';

import { Icon } from '@iconify/react';
import { forwardRef } from 'react';

export function createIconifyIcon(icon: string) {
  const IconComponent = forwardRef<SVGSVGElement, Omit<IconProps, 'icon'>>((props, ref) => {
    return <Icon icon={icon} ref={ref} {...props} />;
  });

  IconComponent.displayName = `Icon-${icon}`;
  return IconComponent;
}
