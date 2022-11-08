/**
 * Validatory factory to produce a Validator which ...?
 *
 * @param {Function | object} validatorOptions
 *
 * @returns {module:validator~fieldValidatorFunc}
 */
export default function validatorOptions(value, options) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line unicorn/no-lonely-if
    if (!options.field) throw new Error('validator.validatorOptions: "field" option is required');
  }

  return (validatorOptions instanceof Function)
    ? validatorOptions({
      record: value,
      entity: options.field.entity,
      ...options,
    })
    : options.field.entity.validate(value, validatorOptions);
}
