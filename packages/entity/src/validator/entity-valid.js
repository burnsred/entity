/**
 * @typedef {module:validator} fieldValidatorFunc
 */

/**
 * Validator to ensure the Entity value passes Field validations
 *
 * @type {fieldValidatorFunc}
 */
export default (value, options = {}) => {
  const errors = options.field.entity.validate(value, options);

  return !!errors && errors.size > 0 && errors;
};
