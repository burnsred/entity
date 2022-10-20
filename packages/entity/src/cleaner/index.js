/**
 * Entity cleaner functions are similar to Validators, but work on whole Entities.
 */

/**
 * @typedef CleanerOptions
 * @property {import("../field").Field} [field] - the invoking field
 */

/**
 * @callback Cleaner
 * @param {any} value
 * @param {CleanerOptions} options
 */

export { default as removeMultiSpace } from './remove-multi-space';

export { default as sliceToMaxLength } from './slice-to-max-length';
