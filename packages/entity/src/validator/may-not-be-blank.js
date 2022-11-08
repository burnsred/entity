import isRequired from './is-required';

/**
 * Validator requiring the value not be what the Field considers blank.
 *
 * @type {module:validator~fieldValidatorFunc}
 *
 * @param {any} value
 * @param {object} configs
 * @param {module:field~Field} configs.field
 * @param {string} [configs.flag]
 */
export default function mayNotBeBlank(value, configs = {}) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (!configs.field) throw new Error('validator.mayNotBeBlank: "field" option is required');
  }

  const validator = configs.flag && configs.field.flags[configs.flag];

  const defaultError = !configs.field.blank
    && isRequired(value, configs);

  if (!validator) return defaultError;

  const flagError = validator(value, configs);

  return defaultError
    ? flagError && defaultError
    : flagError && 'May not be blank';
}
