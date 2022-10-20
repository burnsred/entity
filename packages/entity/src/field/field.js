import { fromJS, isImmutable, List, Map } from 'immutable';

import isRequired from '../validator/is-required';

/**
 * @typedef {import('.').FieldOptions} FieldOptions
 */

/**
 * Field base class for Entity Fields
 *
 * @class Field
 * @property {string?} type
 * @property {boolean} blank
 * @property {import('../cleaner').Cleaner[]} cleaners
 * @property {boolean} many
 * @property {import("immutable").List<any>} options
 * @property {Function | import("../validator").Validator[]} validators
 */
export default class Field {
  /**
   * @param {FieldOptions} options
   */
  constructor({
    type,
    blank = false,
    cleaners = [],
    many = false,
    options,
    validators,
    ...extra
  } = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (options && !List.isList(options)) throw new Error(`Field.constructor (${this.constructor.name}): options.options must be a an immutable List`);
      if (options && options.size !== options.toSet().size) throw new Error(`Field.constructor (${this.constructor.name}): options.options must have unique items.`);
    }

    const defaultValidators = blank ? [] : [isRequired];

    this.type = type;
    this.blank = blank;
    this.cleaners = cleaners;
    this.many = many;
    this.options = options;
    this.validators = (validators instanceof Function)
      ? validators(defaultValidators)
      : validators || defaultValidators;

    Object.assign(this, extra);
  }

  /**
   * Apply our configured cleaner functions to an Entity.
   *
   * Sets `configs.field` to this field when calling cleaners.
   *
   * @param {import('..').Record} record
   * @param {object} [configs]
   *
   * @returns {import('..').Record}
   */
  clean(record, configs = {}) {
    const newOptions = { ...configs, field: this };

    return this.cleaners.reduce(
      (prev, cleaner) => cleaner(prev, newOptions),
      record,
    );
  }

  /**
   * @param {any} data
   * @param {object} [configs]
   *
   * @returns {any}
   */
  dataToValue(data, configs = {}) {
    return fromJS(data);
  }

  /**
   * Get the default value for this field.
   *
   * @returns {List<any> | any}
   */
  default() {
    return this.many ? List() : null;
  }

  getErrors(errors, configs = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (configs.name) throw new Error(`Field.getErrors (${this.constructor.name}): option "name" is not supported.`);
    }

    return errors;
  }

  getErrorsArray(errors, options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (options.index === undefined) throw new Error(`Field.getErrorsArray (${this.constructor.name}): option "index" is required.`);
    }

    return errors
      .filter(error => Map.isMap(error) && error.get('list'))
      .flatMap(error => error.getIn(['errors', options.index]));
  }

  /**
   * For compatibility with ?? interface.
   *
   * @param {object} [options]
   *
   * @returns {Field} this
   */
  getField(options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (options.name) throw new Error(`Field.getField (${this.constructor.name}): method with option name is not supported.`);
    }

    return options.name ? null : this;
  }

  getId() {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Field.getId (${this.constructor.name}): method is not supported.`);
    }
  }

  getKey(value) {
    return this.toString(value);
  }

  getOptions() {
    return this.options || List();
  }

  getValue(value, options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (options.name) throw new Error(`Field.getValue (${this.constructor.name}): option "name" is not supported.`);
    }

    return options.name ? null : value;
  }

  /**
   * Test if this value is considered blank.
   *
   * Default implementation considers blank to be `null` for single values
   * fields, or empty-list for multi.
   *
   * @param {any} value
   * @param {object} [options]
   *
   * @returns {boolean}
   */
  isBlank(value = null, options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (options.name) throw new Error(`Field.isBlank (${this.constructor.name}): method with option name is not supported.`);
    }

    return value === null || (
      this.many
        ? value.size === 0
        : value === ''
    );
  }

  /**
   * Convert a value to raw data
   *
   * @param {import("immutable").Collection} value
   * @param {object} [options]
   * @returns {any}
   */
  toData(value, options) {
    return isImmutable(value)
      ? value.toJS()
      : value;
  }

  /**
   * Convert this value to a querystring appropriate format.
   *
   * @param {any} value
   *
   * @returns {string}
   */
  toParams(value) {
    return (value && value.toString()) || '';
  }

  toString(value = null) {
    return value === null
      ? ''
      : value.toString();
  }

  /**
   * Apply configured validators
   *
   * @param {any} value
   * @param {object} [options]
   *
   * @returns {List<import('..').ErrorMap>}
   */
  validate(value, options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.many && !List.isList(value)) throw new Error(`Field.validate (${this.constructor.name}-${options.fieldName}): "value" must be an "Immutable List" with field option "many"`);
    }

    const validators = (options.validators instanceof Function)
      ? options.validators(this.validators)
      : (options.validators || this.validators);

    return List(validators)
      .map(validator => validator(value, { ...options, field: this }))
      .filter(error => error);
  }
}
