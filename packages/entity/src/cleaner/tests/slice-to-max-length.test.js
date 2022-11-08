import { sliceToMaxLength } from '..';

describe('sliceToMaxLength', () => {
  it('should throw an error if value is not a string', () => {
    expect(() => sliceToMaxLength(123, {})).toThrow('cleaners.removeMultiSpace: value must be of type string');
  });

  it.each([
    ['test', 'tes'],
    ['yes', 'yes'],
    ['no', 'no'],
  ])('should trim long strings', (value, expected) => {
    const result = sliceToMaxLength(value, { field: { maxLength: 3 } });

    expect(result).toBe(expected);
  });

  it('should do nothing when maxLength not specified', () => {
    const value = 'a long value';
    const result = sliceToMaxLength(value, { field: {} });

    expect(result).toBe(result);
  });
});
