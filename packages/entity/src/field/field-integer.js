import NumberField from './field-number';

/**
 * Field subclass for holding an Integer.
 *
 * Unparseable values will yield a `null`.
 */
export default class IntegerField extends NumberField {
  dataToValue(data) {
    const value = parseInt(data, 10);

    return Number.isNaN(value) ? null : value;
  }
}
