/** A message value is a string, a list of strings, or a nested group of either. */
export type MessageValue = string | string[] | { [key: string]: MessageValue };
export type MessageTree = Record<string, MessageValue>;
type FlatMessages = Record<string, string | string[]>;

/**
 * Collapses a nested dictionary into dot-delimited keys, e.g.
 * `{ nav: { works: 'Works' } }` -> `{ 'nav.works': 'Works' }`.
 *
 * Arrays are treated as leaf values, not groups, so `hero.roles` stays a list.
 */
export function flattenMessages(tree: MessageTree, prefix = ''): FlatMessages {
  return Object.entries(tree).reduce<FlatMessages>((acc, [key, value]) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flattenMessages(value, prefixedKey));
    } else {
      acc[prefixedKey] = value;
    }

    return acc;
  }, {});
}
