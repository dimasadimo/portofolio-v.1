import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    const hidden = false;
    expect(cn('a', hidden && 'b', undefined, null)).toBe('a');
  });

  it('lets a later tailwind class win over an earlier conflicting one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('keeps non-conflicting tailwind classes', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
  });
});
