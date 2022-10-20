import DateField from './field-date';

export default class DateTimeField extends DateField {
  /**
   *
   * @param {import('./field-date').DateFieldOptions} configs
   */
  constructor({
    dateFormat = 'YYYY-MM-DD HH:mm',
    allowTime = true,
    ...configs
  }) {
    super({
      type: 'datetime',
      ...configs,
    });

    this.dateFormat = dateFormat;
    this.allowTime = allowTime;
  }
}
