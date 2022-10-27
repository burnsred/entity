import removeMultiSpace from '../remove-multi-space';

describe('removeMultiSpace', () => {
  it.each([
    ['single space', 'single space'],
    ['multi  space', 'multi space'],
    ['single\ttab', 'single\ttab'],
    ['many  space  groups', 'many space groups'],
    ['mixed\t chars', 'mixed chars'],
  ])('should replace repeated spaces with a single space: %s', (input, expected) => {
    const result = removeMultiSpace(input);

    expect(result).toBe(expected);
  });

  it('should raise an error for non strings', () => {
    expect(() => removeMultiSpace(1)).toThrow();
  });
});
