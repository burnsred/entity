import _ from 'lodash';
import { List, Map } from 'immutable';

import EntityField from '../field/field-entity';
import IdField from '../field/field-id';

/**
 * @typedef {module:entity~ErrorMap} ErrorMap
 * @typedef {module:cleaner~cleanerFunc} cleanerFunc
 */

/**
 * Entity class
 *
 * Defines an entity, its fields, cleaners, etc.
 *
 * @interface
 */
export default class Entity {
  /**
   * A list of cleaner functions
   *
   * @type {cleanerFunc[]}
   */
  static cleaners = [];

  /**
   * Which field should be used to uniquely identify records.
   */
  static idField = 'uuid';

  /**
   * A map of name => Field instances
   */
  static fields = {
    uuid: new IdField({ blank: true, mock: 'random.uuid' }),
  };

  /**
   * A map of well known names to URL paths for operating with this Entity on the server.
   */
  static paths = {};

  /**
   * Remove an Entity from a list of Entities
   *
   * @param {List<Entity>} records
   * @param {object} options
   * @param {number} options.index
   *
   * @returns {List<Entity>}
   */
  static actionArrayDeleteAtIndex(records, { index = null } = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (!List.isList(records)) throw new Error(`Entity.actionArrayDeleteAt (${this.name}): "records" must be an immutable List.`);
      if (index === null) throw new Error(`Entity.actionArrayDeleteAt (${this.name}): "index" option must be set.`);
    }

    return records.delete(index);
  }

  /**
   * Reposition an Entity in a list of Entities.
   *
   * @param {List<Map>} records
   * @param {object} options
   * @param {number} options.index - index of record to move
   * @param {number} options.indexTo - index to move it to
   *
   * @returns {List<Map>}
   */
  static actionArrayMoveAtIndex(records, { index = null, indexTo = null } = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (!List.isList(records)) throw new Error(`Entity.actionArrayMoveAtIndex (${this.name}): "records" must be an immutable List.`);
      if (index === null) throw new Error(`Entity.actionArrayMoveAtIndex (${this.name}): "index" option must be set.`);
      if (indexTo === null) throw new Error(`Entity.actionArrayMoveAtIndex (${this.name}): "indexTo" option must be set.`);
    }

    return records.delete(index).insert(indexTo, records.get(index));
  }

  /**
   * Create a new record with all default values
   *
   * @param {Map} record
   * @param {object} configs
   * @param {Map} [configs.valueInitial] - supplied new record to use.
   *
   * @returns {Map}
   */
  static actionReset(record, configs = {}) {
    return configs.valueInitial || this.dataToRecord({
      [this.idField]: record.get(this.idField),
    });
  }

  /**
   * Apply all cleaners to the given record.
   *
   * @param {Map} record
   * @param {object} configs
   *
   * @returns {Map}
   */
  static clean(record, configs = {}) {
    const newOptions = { ...configs, entity: this };

    return this.cleaners.reduce(
      (prev, cleaner) => cleaner(prev, newOptions),
      record,
    );
  }

  /**
   * Factory function to produce a Record for this Entity from supplied data.
   *
   * @param {object} data
   *
   * @returns {Map}
   */
  static dataToRecord(data = null) {
    const values = Map(data)
      .filter((value, key) => key in this.fields)
      .filterNot(value => value === undefined)
      .map(
        (value, key) => (
          (List.isList(value) || Array.isArray(value))
            ? List(value).map(val => this.fields[key].dataToValue(val, { data }))
            : this.fields[key].dataToValue(value, { data })
        ),
      );

    return data && Map(this.fields)
      .filter((value, key) => data[key] === undefined)
      .map(
        field => (
          (field.default instanceof Function)
            ? field.default({ data })
            : field.default
        ),
      )
      .merge(values);
  }

  /**
   * Factory to produce an EntityField for this Entity type.
   *
   * @param {object} [configs]
   *
   * @returns {EntityField}
   */
  static getEntityField(configs = {}) {
    return new EntityField({ entity: this, ...configs });
  }

  static getId(record = null) {
    return record === null
      ? undefined
      : record.get(this.idField);
  }

  static getPaths() {
    return this.paths;
  }

  static getSize() {
    return 0;
  }

  /**
   * Test if the provided object is an Entity instance
   *
   * @param {any} maybeEntity
   *
   * @returns {boolean}
   */
  static isEntity(maybeEntity) {
    return !!maybeEntity && maybeEntity.prototype instanceof Entity;
  }

  /**
   * Test if the provided object is an instance of this Entity.
   *
   * @param {any} maybeDescendant
   *
   * @returns {boolean}
   */
  static isEntityDescendant(maybeDescendant) {
    return !!maybeDescendant && maybeDescendant.prototype instanceof this;
  }

  static isValid(record, configs) {
    return this.validate(record, configs).size === 0;
  }

  /**
   * Given a Map of error records, do any of them apply to our fields?
   *
   * If `name` is provided, only errors for names in the list are considered.
   *
   * @param {Map} errors
   * @param {object} [configs]
   * @param {string[]} [configs.name]
   *
   * @returns {boolean}
   */
  static isValidFromErrors(errors, configs = {}) {
    return configs.name
      ? configs.name.some(
        n => errors
          .filter(error => Map.isMap(error) && error.get('detail'))
          .flatMap(error => error.getIn(['errors', n]))
          .filter(Boolean)
          .size > 0,
      )
      : !errors || errors.size === 0;
  }

  /**
   * Construct an instance of this Entity type with mocked data.
   *
   * @param {*} faker
   * @param {*} index
   * @param {*} mockData
   *
   * @returns {Entity}
   */
  static mock(faker, index, mockData) {
    return _.flowRight([
      record => this.toData(record),
      data => this.dataToRecord(data),
      fields => ({
        ..._.mapValues(
          fields,
          field => {
            if (field instanceof EntityField && !field.blank && field.entity.store) {
              return field.many
                ? _.sampleSize(Object.values(field.entity.store))
                : _.sample(Object.values(field.entity.store));
            }

            return field.mock && (
              field.mock === 'index'
                ? index
                : _.get(faker, field.mock)(...(field.mockConfigs || []))
            );
          },
        ),
        ...mockData,
      }),
    ])(this.fields);
  }

  /**
   * Construct a map of mock instances, indexed by their idField.
   *
   * @param {*} faker
   * @param {*} configs
   *
   * @returns {object}
   */
  static mockMany(faker, configs = {}) {
    return _.keyBy(
      _.range(configs.size).map(index => this.mock(faker, index)),
      this.idField,
    );
  }

  /**
   * Convert an Entity to its raw data.
   *
   * @param {Entity} record
   * @returns {object}
   */
  static toData(record) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line unicorn/no-lonely-if
      if (record && !Map.isMap(record)) throw new Error(`Entity.toData (${this.name}): record must be either a Map or null or undefined`);
    }

    return record && record
      .filter((value, key) => key in this.fields)
      .filterNot((value, key) => this.fields[key].local)
      .map((value, key) => (
        List.isList(value)
          ? value.map(val => this.fields[key].toData(val, { record })).toArray()
          : this.fields[key].toData(value, { record })
      ))
      .toObject();
  }

  static toString(record) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line unicorn/no-lonely-if
      if (record && !Map.isMap(record)) throw new Error(`Entity.toString (${this.name}): record must be either a Map or null or undefined`);
    }

    return (record && record.get(this.idField)) || '';
  }

  /**
   * Apply all per-field validators
   *
   * @param {Map} record
   * @param {object} [configs]
   * @param {object} [configs.fields] - An object mapping field name -> array of additional validators.
   *
   * @returns {ErrorMap}
   */
  static validate(record, configs = {}) {
    if (!record) return record;

    const detailErrors = Map(this.fields)
      .filter((field, key) => !configs.fields || configs.fields[key])
      .map((field, key) => field.validate(
        record.get(key),
        {
          ...configs,
          fieldName: key,
          record,
          validators: configs.fields && configs.fields[key],
        },
      )).filterNot(errors => errors.size === 0);

    return detailErrors.size === 0
      ? null
      : Map({
        detail: true,
        message: 'Invalid Entity',
        errors: detailErrors,
      });
  }
}
