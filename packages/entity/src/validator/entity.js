/**
 * Validatory factory to produce a Validator which ...?
 *
 * @param {}
 */
export default validatorOptions => (value, options) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!options.field) throw new Error('validator.validatorOptions: "field" option is required');
  }

  return (validatorOptions instanceof Function)
    ? validatorOptions({
      record: value,
      entity: options.field.entity,
      ...options,
    })
    : options.field.entity.validate(value, validatorOptions);
};
