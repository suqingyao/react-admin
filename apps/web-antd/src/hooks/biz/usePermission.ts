import { useUserStore } from '@/store';
import { useCallback } from 'react';

export function usePermission() {
  const { roles } = useUserStore();

  /**
   * 检查是否有权限
   * @param value 角色数组或单个角色
   * @returns boolean
   */
  const hasPermission = useCallback((value?: string | string[]) => {
    if (!value) {
      return true;
    }
    if (!roles) {
      return false;
    }
    
    if (Array.isArray(value)) {
      return roles.some(role => value.includes(role));
    }
    
    return roles.includes(value);
  }, [roles]);

  return { hasPermission };
}
