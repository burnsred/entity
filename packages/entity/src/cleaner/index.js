/**
 * Entity cleaner functions are similar to Validators, but work on whole Entities.
 *
 * @module cleaner
 */

/**
 * @callback cleanerFunc
 * @param {any} value
 * @param {object} options
 * @param {module:field~Field} options.field - the invoking field
 * @returns {any}
 */

export { default as removeMultiSpace } from './remove-multi-space';

export { default as sliceToMaxLength } from './slice-to-max-length';
