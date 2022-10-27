import { fromJS, isImmutable, List, Map } from 'immutable';

import isRequired from '../validator/is-required';

/**
 * @typedef {module:entity} Entity
 * @typedef {module:entity} ErrorMap
 * @typedef {module:cleaner} cleanerFunc
 * @typedef {module:validator} fieldValidatorFunc
 */

/**
 * Field base class for Entity classes
 */
export default class Field {
  /**
   *
   * @param {object} [options]
   * @param {string} [options.type]
   * @param {boolean} [options.blank = false]
   * @param {cleanerFunc[]} [options.cleaners = []]
   * @param {boolean} [options.many = false]
   * @param {List} [options.options]
   * @param {Function | fieldValidatorFunc[]} [options.validators] - If passed a function,
   *  will invoke the function, passing the default list of validators, and use
   *  its result as the list of validators.
   */
  constructor(options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (options.options && !List.isList(options.options)) throw new Error(`Field.constructor (${this.constructor.name}): options.options must be a an immutable List`);
      if (options.options && options.options.size !== options.options.toSet().size) throw new Error(`Field.constructor (${this.constructor.name}): options.options must have unique items.`);
    }

    const defaults = {
      blank: false,
      cleaners: [],
      many: false,
      validators: options.blank ? [] : [isRequired],
    };

    Object.assign(
      this,
      defaults,
      options,
      {
        validators: (options.validators instanceof Function)
          ? options.validators(defaults.validators)
          : (options.validators || defaults.validators),
      },
    );
  }

  /**
   * Apply our configured cleaner functions to an Entity.
   *
   * Sets `configs.field` to this field when calling cleaners.
   *
   * @param {Entity} record
   * @param {object} [configs]
   *
   * @returns {Entity}
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
   *
   * @returns {any}
   */
  dataToValue(data) {
    return fromJS(data);
  }

  /**
   * Get the default value for this field.
   *
   * @returns {List | null}
   */
  default() {
    return this.many ? List() : null;
  }

  getErrors(errors, configs = {}) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line unicorn/no-lonely-if
      if (configs.name) throw new Error(`Field.getErrors (${this.constructor.name}): option "name" is not supported.`);
    }

    return errors;
  }

  getErrorsArray(errors, options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line unicorn/no-lonely-if
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
      // eslint-disable-next-line unicorn/no-lonely-if
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
      // eslint-disable-next-line unicorn/no-lonely-if
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
      // eslint-disable-next-line unicorn/no-lonely-if
      if (options.name) throw new Error(`Field.isBlank (${this.constructor.name}): method with option name is not supported.`);
    }

    return value === null || (
      this.many
        ? value.size === 0
        : value === ''
    );
  }

  toData(value) {
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
   * @returns {ErrorMap[]}
   */
  validate(value, options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line unicorn/no-lonely-if
      if (this.many && !List.isList(value)) throw new Error(`Field.validate (${this.constructor.name}-${options.fieldName}): "value" must be an "Immutable List" with field option "many"`);
    }

    const validators = (options.validators instanceof Function)
      ? options.validators(this.validators)
      : (options.validators || this.validators);

    return List(validators)
      .map(validator => validator(value, { ...options, field: this }))
      .filter(Boolean);
  }
}
