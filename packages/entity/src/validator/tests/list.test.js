import { List, Map } from 'immutable';

import { list } from '..';

describe('list', () => {
  const validators = Array.from({ length: 5 }, () => jest.fn());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validator = list(validators);

  it('should throw an error if value is not a list', () => {
    expect(() => validator('scalar')).toThrow('validators.list: "values" must be a list');
  });

  it('should apply all validators when invoked', () => {
    validator(List(['a', 'b']));
    validators.every(fn => expect(fn).toHaveBeenCalled());
  });

  it('should produce a list flagged Error Map', () => {
    const valFunc = (value, options) => 'Not Valid';
    const val = list([valFunc]);

    const result = val(List([1]));

    expect(result).toBeInstanceOf(Map);
    expect(result.get('message')).toBe('Invalid list');
    expect(result.get('list')).toBeTruthy();
  });
});
