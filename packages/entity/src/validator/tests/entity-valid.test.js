import { Map } from 'immutable';

import { entityValid } from '..';

const validEntity = {
  validate: () => false,
};

const invalidEntity = {
  validate: () => Map([['detail', true]]),
};

describe('entityValid', () => {
  it('should pass valid entities', () => {
    expect(entityValid(true, { field: { entity: validEntity } })).toBeFalsy();
  });

  it('should fail invalid entities', () => {
    expect(entityValid(true, { field: { entity: invalidEntity } })).toBeInstanceOf(Map);
  });
});
