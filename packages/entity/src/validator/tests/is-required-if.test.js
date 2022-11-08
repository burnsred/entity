import { isRequiredIf } from '..';
import isRequired from '../is-required';

jest.mock('../is-required');

const value = Symbol.for('value');
const objects = Symbol.for('objects');

describe('isRequiredIf', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error if predicate is not a function', () => {
    expect(() => isRequiredIf('test')).toThrow('validators.isRequiredIf: predicate argument must be of type function');
  });

  it('should call isRequired if predicate is true', () => {
    const validator = isRequiredIf(() => true);
    validator(value, objects);
    expect(isRequired).toHaveBeenCalledWith(value, objects);
  });

  it('should not call isRequired if predicate is false', () => {
    const validator = isRequiredIf(() => false);
    validator(value, objects);
    expect(isRequired).not.toHaveBeenCalled();
  });
});
