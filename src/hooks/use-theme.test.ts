import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useTheme } from '@/hooks/use-theme';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  });

  it('starts null so the first render matches the server HTML', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).not.toBeUndefined();
  });

  it('adopts whatever the init script already put on <html>', () => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('falls back to dark when the attribute is missing or invalid', () => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'nonsense');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('setTheme updates the attribute, storage and state together', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));

    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(result.current.theme).toBe('light');
  });

  it('round-trips back to dark', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));
    act(() => result.current.setTheme('dark'));

    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
