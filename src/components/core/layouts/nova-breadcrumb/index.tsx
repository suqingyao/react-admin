import { NovaIconButton } from '../../widget/nova-icon-button';

export function NovaBreadcrumb() {
  return (
    <div className="flex items-center space-x-2">
      <NovaIconButton icon="ri:home-2-line">
        <span className="sr-only">Home</span>
      </NovaIconButton>
    </div>
  );
}
