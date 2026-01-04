import { NovaIconButton } from '@/components/core/widget/nova-icon-button';

export function NovaBackToTop() {
  return (
    <NovaIconButton icon="ri:arrow-up-line">
      <span className="sr-only">Back to top</span>
    </NovaIconButton>
  );
}
