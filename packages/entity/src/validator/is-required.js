/**
 * @typedef {module:validator~fieldValidatorFunc} fieldValidatorFunc
 */

/**
 * Validator to ensure the value is not blank according to the rules of the field.
 *
 * @type {fieldValidatorFunc}
 */
export default function isRequired(value, configs = {}) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (!configs.field) throw new Error('validators.isRequired: "field" option is required');
  }

  return configs.field.isBlank(value, configs)
    && 'May not be blank';
}
