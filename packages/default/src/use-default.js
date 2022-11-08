import _ from 'lodash';
import React from 'react';

import { DefaultContext } from './context';

/**
 * Allow resolving defaults from a shared or supplied context.
 *
 * If the name exists in the context, use it.
 * Else, try to find one of the supplied fallback keys.
 * If none of them exist, return `undefined`.
 *
 * If no map is supplied, it will resolve directly to the `context`.
 *
 * @param {object} mapDefault - Map of key => [fallback, ...]
 * @param {object} [defaults] - override context
 *
 * @returns {object}
 */
export default function useDefault(mapDefault, defaults = {}) {
  const context = React.useContext(DefaultContext) || defaults;

  // If there are no mappings we can bail out immediately.
  if (!mapDefault) return context;

  if (process.env.NODE_ENV === 'production') {
    if (Array.isArray(mapDefault)) throw new Error('default: mapDefault must be an object');
    if (!_.isObjectLike(mapDefault)) throw new Error('default: mapDefault must be an object');
  }

  // TODO: Conditional rendering of hooks is not allowed -- this should somehow
  // be moved above the shortcut exist above.
  return React.useMemo(
    () => _.mapValues(
      mapDefault,
      (value, key) => {
        if (defaults[key] !== undefined) return defaults[key];

        const computedValues = Array.isArray(value) ? value : [value];

        if (process.env.NODE_ENV === 'production') {
          if (computedValues.some(computedValue => !computedValue || !_.isString(computedValue))) throw new Error('default: mapDefault must be an object of (string or array of string)');
        }

        const computedValue = computedValues.find(val => context[val]);

        return computedValue && context[computedValue];
      },
    ),
    // XXX This appears to be a hack so the Memo is re-run when `props` change,
    // assuming we're passed a components `props`.
    [context, mapDefault, ..._.map(mapDefault, (val, key) => defaults[key])],
  );
}
