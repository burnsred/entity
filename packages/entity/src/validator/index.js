/**
 * Validator functions are applied to Field values.
 *
 * @module validator
 */

/**
 * @typedef {module:field} Field
 * @typedef {module:entity} ErrorMap
 */

/**
 * @callback fieldValidatorFunc
 * @param {any} value
 * @param {object} options
 * @param {Field} options.field - the invoking field
 * @returns {?string | ?ErrorMap} - error message(s)
 */

export { default as allowBlank } from './allow-blank';

export { default as entityValid } from './entity-valid';

export { default as isRequired } from './is-required';

export { default as isRequiredIf } from './is-required-if';

export { default as list } from './list';

export { default as mayNotBeBlank } from './may-not-be-blank';
