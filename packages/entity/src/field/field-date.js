import moment from 'moment';

import AnyField from './field-any';

/**
 * @typedef {import('.').FieldOptions} FieldOptions
 */

/**
 * @typedef {FieldOptions} DateFieldOptions
 * @property {boolean} [allowTime]
 * @property {string} [dateFormat]
 */

/**
 * @class DateField
 * @property {boolean} allowTime
 * @property {string} dateFormat
 */
export default class DateField extends AnyField {
  /**
   * @param {DateFieldOptions} configs
   */
  constructor({
    dateFormat = 'YYYY-MM-DD',
    allowTime  = false,
    ...configs
  }) {
    super({
      type: 'date',
      ...configs,
    });

    this.allowTime = allowTime;
    this.dateFormat = dateFormat;
  }

  dataToValue(data) {
    return data && moment(data);
  }

  toData(value) {
    return value && value.format(this.dateFormat);
  }

  toParams(value) {
    return (value && value.format(this.dateFormat)) || '';
  }

  toString(value) {
    return (value && value.format(this.dateFormat)) || '';
  }
}
