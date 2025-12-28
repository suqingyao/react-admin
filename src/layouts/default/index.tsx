import { useEffect } from 'react';
import { useNavigation } from 'react-router';
import { NovaGlobalComponent } from '@/components/core/layouts/nova-global-component';
import { NovaHeaderBar } from '@/components/core/layouts/nova-header-bar';
import { NovaSidebarMenu } from '@/components/core/layouts/nova-menus/nova-sidebar-menu';
import { NovaPageContent } from '@/components/core/layouts/nova-page-content';
import { startProgress, stopProgress } from '@/lib/nprogress';
import { useSettingStore } from '@/store';
import './style.scss';

export function DefaultLayout() {
  const navigation = useNavigation();
  const { showNprogress } = useSettingStore();

  useEffect(() => {
    if (!showNprogress) {
      stopProgress();
      return;
    }

    if (navigation.state === 'idle') {
      stopProgress();
    } else {
      startProgress();
    }
  }, [navigation.state, showNprogress]);

  return (
    <div className="app-layout">
      <aside id="app-sidebar">
        <NovaSidebarMenu />
      </aside>
      <main id="app-main">
        <div id="app-header">
          <NovaHeaderBar />
        </div>
        <div id="app-content">
          <NovaPageContent />
        </div>
      </main>
      <div id="app-global">
        <NovaGlobalComponent />
      </div>
    </div>
  );
}
