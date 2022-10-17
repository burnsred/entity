/**
 * Entity cleaner functions are similar to Validators, but work on whole Entities.
 */

/**
 * @callback cleanerFunc
 * @param {Any} value
 * @param {object} options
 * @param {Field} options.field - the invoking field
 */

export { default as removeMultiSpace } from './remove-multi-space';

export { default as sliceToMaxLength } from './slice-to-max-length';
