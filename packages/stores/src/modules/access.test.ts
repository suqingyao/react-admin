import { beforeEach, describe, expect, it } from 'vitest';
import { useAccessStore } from './access';

describe('useAccessStore', () => {
  beforeEach(() => {
    useAccessStore.setState({
      accessMenus: [],
      accessToken: null,
      accessRoutes: [],
      accessCodes: [],
      isAccessChecked: false,
      isLockScreen: false,
      loginExpired: false,
      refreshToken: null,
    });
  });

  it('updates accessMenus state', () => {
    expect(useAccessStore.getState().accessMenus).toEqual([]);
    useAccessStore.getState().setAccessMenus([{ name: 'Dashboard', path: '/dashboard' }]);
    expect(useAccessStore.getState().accessMenus).toEqual([
      { name: 'Dashboard', path: '/dashboard' },
    ]);
  });

  it('updates accessToken state correctly', () => {
    expect(useAccessStore.getState().accessToken).toBeNull();
    useAccessStore.getState().setAccessToken('abc123');
    expect(useAccessStore.getState().accessToken).toBe('abc123');
  });

  it('returns the correct accessToken', () => {
    useAccessStore.getState().setAccessToken('xyz789');
    expect(useAccessStore.getState().accessToken).toBe('xyz789');
  });

  it('handles empty accessMenus correctly', () => {
    useAccessStore.getState().setAccessMenus([]);
    expect(useAccessStore.getState().accessMenus).toEqual([]);
  });

  it('handles empty accessRoutes correctly', () => {
    useAccessStore.getState().setAccessRoutes([]);
    expect(useAccessStore.getState().accessRoutes).toEqual([]);
  });
});
