import { describe, expect, it } from 'vitest';

import { flattenMessages } from '@/lib/flatten-messages';

describe('flattenMessages', () => {
  it('joins nested keys with dots', () => {
    expect(flattenMessages({ nav: { works: 'Works' } })).toEqual({ 'nav.works': 'Works' });
  });

  it('flattens more than one level deep', () => {
    expect(flattenMessages({ a: { b: { c: 'deep' } } })).toEqual({ 'a.b.c': 'deep' });
  });

  it('keeps arrays as leaf values rather than descending into them', () => {
    expect(flattenMessages({ hero: { roles: ['one', 'two'] } })).toEqual({
      'hero.roles': ['one', 'two'],
    });
  });

  it('keeps top-level strings unprefixed', () => {
    expect(flattenMessages({ title: 'Hi' })).toEqual({ title: 'Hi' });
  });

  it('returns an empty object for an empty tree', () => {
    expect(flattenMessages({})).toEqual({});
  });

  it('applies a caller-supplied prefix', () => {
    expect(flattenMessages({ works: 'Works' }, 'nav')).toEqual({ 'nav.works': 'Works' });
  });
});
