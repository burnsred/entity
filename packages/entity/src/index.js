import * as cleaners from './cleaner';
import * as validators from './validator';
import * as Fields from './field';

/**
 * @typedef {Map<string, any>} Record
 */

/**
 * ErrorMaps always contain the same keys:
 * detail: {boolean}
 * message: {string}
 * list: {boolean} - indicates errors are over a list of values
 * errors: {List | ErrorMap}
 *
 * @typedef {import("immutable").Map} ErrorMap
 */

export {
  cleaners,
  validators,
  Fields,
};
