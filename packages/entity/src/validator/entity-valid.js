/**
 * Validator to ensure the Entity value passes Field validations
 *
 * @type {module:validator~fieldValidatorFunc}
 */
export default function entityValid(value, options = {}) {
  const errors = options.field.entity.validate(value, options);

  return !!errors && errors.size > 0 && errors;
}
