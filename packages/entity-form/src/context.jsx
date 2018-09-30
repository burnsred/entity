import exact from 'prop-types-exact';
import PropTypes from 'prop-types';
import PropTypesEntity from '@gnowth/prop-types-entity';
import PropTypesImmutable from 'react-immutable-proptypes';
import PropTypesPlus from '@gnowth/prop-types-plus';
import React from 'react';

const { Provider, Consumer } = React.createContext({});


// TODO:REMOVE if not being used
export const withForm = ComposedComponent => function withFormConsumer(props) {
  return (
    <FormConsumer>
      { context => <ComposedComponent {...context} {...props} /> }
    </FormConsumer>
  );
};


export const FormConsumer = Consumer;


// TODO:OPTIMISE? props is being generated and it will rerender all the time when children changes
export const FormProvider = ({ children, ...props }) => (
  <Provider value={props}>
    { children }
  </Provider>
);

FormProvider.propTypes = exact({
  children: PropTypes.node.isRequired,
  formDisabled: PropTypes.bool,
  formField: PropTypesEntity.field.isRequired,
  formIndex: PropTypes.number,
  formInitialValue: PropTypesImmutable.map,
  formName: PropTypesPlus.string,
  formNameMapper: PropTypes.shape({}),
  formOnChange: PropTypes.func.isRequired,
  formReadOnly: PropTypes.bool,
  formValue: PropTypes.oneOfType([
    PropTypesImmutable.map,
    PropTypesImmutable.list,
  ]).isRequired,
});

FormProvider.defaultProps = {
  formDisabled: false,
  formIndex: undefined,
  formInitialValue: null,
  formName: undefined,
  formNameMapper: {},
  formReadOnly: false,
};
