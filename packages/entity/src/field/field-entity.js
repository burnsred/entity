import _ from 'lodash';
import { List, Map } from 'immutable';

import AnyField from './field-any';
import entityValid from '../validator/entity-valid';
import list from '../validator/list';

/**
 * @typedef {module:entity~ErrorMap} ErrorMap
 */

/**
 * Field for referencing another Entity.
 */
export default class EntityField extends AnyField {
  constructor(configs = {}) {
    const defaults = {
      nested: true, // TODO(cjm): nothing appears to ever refence this?
      type: 'entity',
    };

    const entityValidators = configs.many
      ? [list([entityValid])]
      : [entityValid];

    super(Object.assign(
      defaults,
      configs,
      {
        validators: defaultValidators => (
          (configs.validators instanceof Function)
            ? configs.validators([...defaultValidators, ...entityValidators])
            : configs.validators || [...defaultValidators, ...entityValidators]
        ),
      },
    ));

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line unicorn/no-lonely-if
      if (!configs.entity) throw new Error(`${this.constructor.name}.constructor: "entity" option is required`);
    }
  }

  dataToValue(data) {
    return this.entity.dataToRecord(data);
  }

  default() {
    if (this.many) return List();

    return this.blank ? null : this.entity.dataToRecord({});
  }

  /**
   * Get errors from a list of errors.
   *
   * If `name` is provided, will extract nested errors for only the specified field.
   *
   * @param {List<ErrorMap>} errors
   * @param {object} [configs]
   * @param {string} [configs.name] - limit to errors for a specific field
   * @returns {List<ErrorMap>}
   */
  getErrors(errors, configs = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (configs.name && !_.isString(configs.name)) throw new Error(`EntityField.getErrors (${this.entity.name}): "name" option must be either a string or undefined`);
      if (configs.name && !this.entity.fields[configs.name]) throw new Error(`EntityField.getErrors (${this.entity.name}): field "${configs.name}" not found`);
    }

    return configs.name
      ? errors
        // Filter out string errors; they have no field name
        .filter(error => Map.isMap(error) && error.get('detail'))
        .flatMap(error => {
          const val = error.getIn(['errors', configs.name]);
          // If the `errors` value is a Map we must wrap it in a List to protect
          // from `flatMap` flattening it to [key, value] pairs.
          return Map.isMap(val) ? List[val] : val;
        })
        // Filter any empty values
        .filter(Boolean)
      : errors;
  }

  getField(configs = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (configs.name && !_.isString(configs.name)) throw new Error(`EntityField.getField (${this.entity.name}): "name" option must be either a string or undefined`);
      if (configs.name && !this.entity.fields[configs.name]) throw new Error(`EntityField.getField (${this.entity.name}): field "${configs.name}" not found`);
    }

    return configs.name
      ? this.entity.fields[configs.name]
      : this;
  }

  getId(value, configs = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (configs.name && !_.isString(configs.name)) throw new Error(`EntityField.getId (${this.entity.name}): "name" option must be either a string or undefined`);
      if (configs.name && !this.entity.fields[configs.name]) throw new Error(`EntityField.getId (${this.entity.name}): field "${configs.name}" not found`);
    }

    return this.getField({ value, ...configs })
      .entity
      .getId(this.getValue(value, configs));
  }

  getKey(value) {
    return this.getId(value);
  }

  getOptions() {
    return this.options || this.entity.options || List();
  }

  getValue(value, configs = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (configs.name && !_.isString(configs.name)) throw new Error(`EntityField.getValue (${this.entity.name}): "name" option must be either a string or undefined`);
      if (configs.name && !this.entity.fields[configs.name]) throw new Error(`EntityField.getValue (${this.entity.name}): field "${configs.name}" not found`);
    }

    return configs.name && value
      ? value.get(configs.name)
      : value;
  }

  isBlank(value = null, configs = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (configs.name && !_.isString(configs.name)) throw new Error(`EntityField.isBlank (${this.entity.name}): "name" option must be either a string or undefined`);
      if (configs.name && !this.entity.fields[configs.name]) throw new Error(`EntityField.isBlank (${this.entity.name}): field "${configs.name}" not found`);
    }

    return value === null || (
      this.many
        ? value.size === 0
        : value === ''
    );
  }

  toData(value, configs = {}) {
    return this.entity.toData(value, configs);
  }

  valueToParam(value = null) {
    return value === null
      ? undefined
      : value.get(this.entity.idField);
  }

  toParams(value, configs) {
    return this.getId(value, configs);
  }

  toString(value, configs = {}) {
    return this.entity.toString(value, configs);
  }
}
