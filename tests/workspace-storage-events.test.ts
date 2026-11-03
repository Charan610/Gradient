import { afterEach, describe, expect, it } from 'vitest';
import { initializeWorkspace, isWorkspaceStorageEventKey, workspaceStorageKey } from '@/lib/account/workspace';

afterEach(() => initializeWorkspace(null));

describe('study-library storage event scoping', () => {
  it.each([
    ['foundation_career_os_local_user_profile', true],
    ['foundation_career_os_local_user_day_P0-D01', true],
    ['foundation_career_os_local_user_completion_journal', true],
    ['foundation_proj_reading-log', true],
    ['theme', false],
    ['gradient_accounts', false],
    ['', false],
  ])('active account key %s refreshes: %s', (key, refresh) => {
    initializeWorkspace('account-a');
    expect(isWorkspaceStorageEventKey(workspaceStorageKey(key))).toBe(refresh);
  });

  it.each([
    'gradient_workspace_account-b_foundation_career_os_local_user_profile',
    'gradient_workspace_account-ab_foundation_career_os_local_user_profile',
    'gradient_workspace_account-a-foundation_career_os_local_user_profile',
    'foundation_career_os_local_user_profile',
    'foundation_proj_reading-log',
    'theme',
  ])('ignores foreign or guest writes while signed in: %s', key => {
    initializeWorkspace('account-a');
    expect(isWorkspaceStorageEventKey(key)).toBe(false);
  });

  it.each([
    ['foundation_career_os_local_user_profile', true],
    ['foundation_career_os_local_user_day_P2-D01', true],
    ['foundation_proj_reading-log', true],
    ['gradient_workspace_account-a_foundation_career_os_local_user_profile', false],
    ['gradient_workspace_account-b_foundation_proj_reading-log', false],
    ['theme', false],
    ['', false],
  ])('guest key %s refreshes: %s', (key, refresh) => {
    initializeWorkspace(null);
    expect(isWorkspaceStorageEventKey(key)).toBe(refresh);
  });

  it.each([null, 'account-a', 'account-b'])('refreshes global clear events in workspace %s', account => {
    initializeWorkspace(account);
    expect(isWorkspaceStorageEventKey(null)).toBe(true);
  });

  it('uses the current account after switching, including returning to guest mode', () => {
    initializeWorkspace('account-a');
    const accountAKey = workspaceStorageKey('foundation_career_os_local_user_profile');
    expect(isWorkspaceStorageEventKey(accountAKey)).toBe(true);
    initializeWorkspace('account-b');
    expect(isWorkspaceStorageEventKey(accountAKey)).toBe(false);
    const accountBKey = workspaceStorageKey('foundation_career_os_local_user_profile');
    expect(isWorkspaceStorageEventKey(accountBKey)).toBe(true);
    initializeWorkspace(null);
    expect(isWorkspaceStorageEventKey(accountAKey)).toBe(false);
    expect(isWorkspaceStorageEventKey(accountBKey)).toBe(false);
    expect(isWorkspaceStorageEventKey('foundation_career_os_local_user_profile')).toBe(true);
  });
});
