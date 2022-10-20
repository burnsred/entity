import isRequired from './is-required';

/**
 * Validator factory to produce a Validator which requires a value only if the
 * supplied `predicate` is satisfied.
 *
 * @param {(object) => boolean} predicate
 *
 * @returns {import('../validator').Validator}
 */
export default predicate => (value, configs) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!(predicate instanceof Function)) throw new Error('validators.isRequiredIf: predicate argument must be of type function');
  }

  return predicate({ value, ...configs }) && isRequired(value, configs);
};
