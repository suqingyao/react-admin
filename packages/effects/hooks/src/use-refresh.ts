import { useTabbarStore } from '@nova/stores';
import { useRouter } from 'vue-router';

export function useRefresh() {
  const router = useRouter();
  const tabbarStore = useTabbarStore();

  async function refresh() {
    await tabbarStore.refresh(router);
  }

  return {
    refresh,
  };
}
