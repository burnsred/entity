import sliceToMaxLength from '../slice-to-max-length';

describe('sliceToMaxLength', () => {
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
