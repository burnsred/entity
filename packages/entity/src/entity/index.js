/**
 *
 * @module entity
 */

/**
 * @typedef ErrorMap
 *
 * ErrorMaps always contain the same 3 keys:
 * detail: {boolean}
 * message: {string}
 * list: {boolean} - indicates errors are over a list of values
 * errors: {List | ErrorMap}
 */

export { default as Entity } from './entity';

export { default as EntityEnum } from './entity-enum';

export { default as EntityFilter } from './entity-filter';

export { default as EntityLocale } from './entity-locale';

export { default as EntityTitle } from './entity-title';
