/**
 * Validator to ensure the value is not blank according to the rules of the field.
 *
 * @type {import("../validator").Validator}
 */
export default (value, configs = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!configs.field) throw new Error('validators.isRequired: "field" option is required');
  }

  return configs.field.isBlank(value, configs)
    && 'May not be blank';
};
