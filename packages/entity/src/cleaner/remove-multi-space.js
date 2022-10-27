/**
 * Cleaner to replace multiple whitepace characters with a single space.
 *
 * @param {string} value
 *
 * @returns {string}
 */
export default function removeMultiSpace(value) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (typeof value !== 'string') throw new Error('cleaners.removeMultiSpace: value must be of type string');
  }

  return value.replace(/\s\s+/g, ' ');
}
