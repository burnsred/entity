import { allowBlank } from '..';

describe('allowBlank', () => {
  it.each([
    0,
    'test',
    null,
    undefined,
    {},
    [],
  ])('should accept %o', value => {
    expect(allowBlank(value)).toBeFalsy();
  });
});
