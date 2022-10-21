import _ from 'lodash';
import React from 'react';

import useDefault from './use-default';

/**
 * Helper function to resolve the name of a React component.
 *
 * @param {React.Component} ComposedComponent
 *
 * @returns {string} - Display name for the component.
 */
function getDisplayName(ComposedComponent) {
  return ComposedComponent.displayName
    || ComposedComponent.name
    || 'Component';
}

/**
 * HOC for applying `useDefault` to a components props
 *
 * @param {Function| object} configs
 * As a Function, it is applied to the `props` to provide the `defaultMap` for `useDefault`
 * Otherwise, passed directyle as `defaultMap`.
 *
 * @returns {React.Component}
 */
export default configs => (ComposedComponent) => {
  function withDefault(props) {
    const defaults = useDefault(_.isFunction(configs) ? configs(props) : configs, props); // eslint-disable-line react-hooks/rules-of-hooks

    return (
      <ComposedComponent
        {...props}
        {...(configs ? defaults : { defaults })}
      />
    );
  }

  withDefault.displayName = `withDefault(${getDisplayName(ComposedComponent)})`;

  return withDefault;
};
