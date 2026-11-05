import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { isTheme, THEME_ATTRIBUTE, THEME_INIT_SRC, THEME_STORAGE_KEY, THEMES } from '@/lib/theme';

const initScript = readFileSync(join(process.cwd(), 'public', 'theme-init.js'), 'utf8');

describe('isTheme', () => {
  it.each(THEMES)('accepts %s', (theme) => {
    expect(isTheme(theme)).toBe(true);
  });

  it('rejects an unknown theme', () => {
    expect(isTheme('solarized')).toBe(false);
  });

  it('rejects null, which is what an empty localStorage read returns', () => {
    expect(isTheme(null)).toBe(false);
  });
});

// The pre-paint script is plain JS outside the bundle, so it cannot import these
// constants. These tests fail if the two ever drift apart.
describe('public/theme-init.js', () => {
  it('is served from the path the layout references', () => {
    expect(THEME_INIT_SRC).toBe('/theme-init.js');
  });

  it('reads the same storage key the hook writes', () => {
    expect(initScript).toContain(`'${THEME_STORAGE_KEY}'`);
  });

  it('sets the same attribute the CSS selects on', () => {
    expect(initScript).toContain(`'${THEME_ATTRIBUTE}'`);
  });

  it('handles every supported theme by name', () => {
    for (const theme of THEMES) expect(initScript).toContain(`'${theme}'`);
  });

  it('falls back to the OS preference when nothing is stored', () => {
    expect(initScript).toContain('prefers-color-scheme: dark');
  });

  it('is wrapped in try/catch so blocked storage cannot break first paint', () => {
    expect(initScript).toMatch(/try\s*\{/);
    expect(initScript).toMatch(/catch\s*\(/);
  });
});
