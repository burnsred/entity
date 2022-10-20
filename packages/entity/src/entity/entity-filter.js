import { List, Map } from 'immutable';

import Entity from './entity';

import IdField from '../field/field-id';
import IntegerField from '../field/field-integer';

/**
 * Base Entity for pagination state.
 */
export default class Filter extends Entity {
  static fields = {
    page: new IntegerField({ default: 1 }),
    page_size: new IntegerField({ default: 20 }),
    uuid: new IdField({ blank: true, mock: 'random.uuid' }),
  };

  /**
   * Convert this record into params suitable for passing to the back end.
   *
   * NOTE(thierry): returning a map from field.toParams will flatten the output
   *
   * @param {import('..').Record} record
   * @param {object} [options]
   *
   * @returns {import('..').Record}
   */
  static toParams(record, options = {}) {
    const fieldValueToParams = (value, key) => (
      List.isList(value)
        ? value
          .map(val => this.fields[key].toParams(val, { record, ...options }))
          .reduce(
            (prev, param) => prev.mergeWith(
              (prevParam, nextParam) => (prevParam ? `${prevParam},${nextParam}` : nextParam),
              Map.isMap(param) ? param : Map({ [key]: param }),
            ),
            Map(),
          )
        : this.fields[key].toParams(value, { record, ...options })
    );

    return record
      ? record
        .filter((_, key) => key in this.fields)
        .filterNot((_, key) => this.fields[key].local)
        .filterNot(value => value === undefined)
        .map(fieldValueToParams)
        .flatten()
      : Map();
  }
}
