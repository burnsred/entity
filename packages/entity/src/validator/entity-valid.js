/**
 * Validator to ensure the Entity value passes Field validations
 *
 * @type {import("../validator").Validator}
 * @param {object} options
 * @param {import("../field").EntityField} options.field
 */
export default (value, options) => {
  const errors = options.field.entity.validate(value, options);

  return !!errors && errors.size > 0 && errors;
};
