import { List } from 'immutable';

import { Field } from '../../field';
import { isRequired } from '..';

describe('isRequired', () => {
  const field = new Field();
  const listField = new Field({ many: true });

  it('should throw an error if field is not in options', () => {
    expect(() => isRequired('value', {})).toThrow('validators.isRequired: "field" option is required');
  });

  it('should succeed if the value is not blank', () => {
    const result = isRequired('test', { field });
    expect(result).toBeFalsy();
  });

  it('should fail if the value is blank', () => {
    const result = isRequired('', { field });
    expect(result).toBe('May not be blank');
  });

  it('should pass for non-empty lists on many fields', () => {
    const result = isRequired(List(['1']), { field: listField });
    expect(result).toBeFalsy();
  });

  it('should fail for empty lists on many fields', () => {
    const result = isRequired(List(), { field: listField });
    expect(result).toBe('May not be blank');
  });
});
