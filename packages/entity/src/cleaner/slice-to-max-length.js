/**
 * Cleaner to trim a value to the maxLength specified on the field.
 *
 * If maxLength is not specified, this is a no-op.
 *
 * @param {string} value
 * @param {object} options
 * @param {import('../field').Field} options.field
 *
 */
export default (value, { field }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof value !== 'string') throw new Error('cleaners.removeMultiSpace: value must be of type string');
  }

  return field.maxLength
    ? value.slice(0, field.maxLength)
    : value;
};
