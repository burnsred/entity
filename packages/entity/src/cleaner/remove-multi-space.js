import _ from 'lodash';

/**
 * Normalise multiple whitespace spans with a single space.
 *
 * @type {import('.').Cleaner}
 */
export default (value) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!_.isString(value)) throw new Error('cleaners.removeMultiSpace: value must be of type string');
  }

  return value.replace(/\s\s+/g, ' ');
};
