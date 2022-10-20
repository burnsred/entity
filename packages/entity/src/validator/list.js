import { List, Map } from 'immutable';

/**
 * Validator factory to produce a validator which applies the supplied list of
 * validators to each item in the values list.
 *
 * @param {import('../validator').Validator[]} validators
 *
 * @returns {import('../validator').Validator}
 */
export default validators => (values, configs) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!List.isList(values)) throw new Error('validators.list: "values" must be a list');
  }

  const errors = values.map(
    value => List(validators)
      .map(validator => validator(value, configs))
      .filter(Boolean),
  );

  return errors.some(error => error.size > 0)
    && Map({
      errors,
      list: true,
      message: 'Invalid list',
    });
};
