import { List, Map } from 'immutable';

/**
 * Validator factory to produce a validator which applies the supplied list of
 * validators to each item in the values list.
 *
 * @param {module:validator~fieldValidatorFunc[]} validators
 *
 * @returns {module:validator~fieldValidatorFunc}
 */
export default function list(validators) {
  return (values, configs) => {
    if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line unicorn/no-lonely-if
      if (!List.isList(values)) throw new Error('validators.list: "values" must be a list');
    }

    const errors = values.map(
      value => List(validators)
        .map(validator => validator(value, configs))
        .filter(Boolean),
    );

    return errors.some(error => error.size > 0) && Map({
      errors,
      list: true,
      message: 'Invalid list',
    });
  };
}
