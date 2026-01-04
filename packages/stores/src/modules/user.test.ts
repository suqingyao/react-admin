import { beforeEach, describe, expect, it } from 'vitest';
import { useUserStore } from './user';

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({ userInfo: null, userRoles: [] });
  });

  it('returns correct userInfo', () => {
    const userInfo: any = { name: 'Jane Doe', roles: ['user'] };
    useUserStore.getState().setUserInfo(userInfo);
    expect(useUserStore.getState().userInfo).toEqual(userInfo);
  });

  it('clears userInfo and userRoles when setting null userInfo', () => {
    useUserStore.getState().setUserInfo({
      roles: ['user'],
    } as any);
    expect(useUserStore.getState().userInfo).not.toBeNull();
    expect(useUserStore.getState().userRoles.length).toBeGreaterThan(0);

    useUserStore.getState().setUserInfo(null);
    expect(useUserStore.getState().userInfo).toBeNull();
    expect(useUserStore.getState().userRoles).toEqual([]);
  });

  it('returns an empty array for userRoles if not set', () => {
    expect(useUserStore.getState().userRoles).toEqual([]);
  });
});
