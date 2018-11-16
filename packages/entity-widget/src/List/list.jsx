import _isFunction from 'lodash/isFunction';
import _isString from 'lodash/isString';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import PropTypesEntity from '@gnowth/prop-types-entity';
import PropTypesImmutable from 'react-immutable-proptypes';
import PropTypesPlus from '@gnowth/prop-types-plus';
import React from 'react';
import { withDefault } from '@gnowth/default';
import { is } from 'immutable';

import OptionText from './option-text';

const ListComponent = styled.ul`
  ${props => props.css}
`;

class WidgetList extends React.Component {
  getPropsOption(option) {
    const props = {
      disabled: this.props.disabled,
      field: this.props.field,
      readOnly: this.props.readOnly,
      selected: this.props.field.many
        ? this.props.value.includes(option)
        : is(option, this.props.value),
      value: option,
    };

    return Object.assign(
      { onClick: this.handleClickFactory(option) },
      props,
      _isString(this.props.optionComponent) && { field: undefined },
      _isFunction(this.props.optionComponentProps)
        ? this.props.optionComponentProps(props)
        : this.props.optionComponentProps,
    );
  }

  getShouldShow() {
    return {
      options: !this.props.processing
        && !this.props.processingDidFail
        && this.props.options,

      processingComponent: this.props.processing
        && this.props.processingComponent,

      processingDidFailComponent: this.props.processingDidFail
        && this.props.processingDidFailComponent,

      recordCountNoneComponent: !this.props.processing
        && !this.props.processingDidFail
        && this.props.recordCountNoneComponent
        && this.props.options
        && this.props.options.size === 0,
    };
  }

  handleClickFactory = option => () => {
    if (this.props.readOnly || this.props.disabled) return undefined;

    if (this.props.field.many) {
      return this.props.onChange({
        target: {
          name: this.props.name,
          value: this.props.value.includes(option)
            ? this.props.value.filterNot(val => is(val, option))
            : this.props.value.push(option),
        },
      });
    }

    return this.props.onChange({
      target: {
        name: this.props.name,
        value: is(option, this.props.value) ? null : option,
      },
    });
  }

  render() {
    const shouldShow = this.getShouldShow();

    return (
      <this.props.component {...this.props.componentProps}>
        { shouldShow.processingComponent && (
          <this.props.processingComponent {...(this.props.processingComponentProps || {})} />
        )}

        { shouldShow.processingDidFailComponent && (
          <this.props.processingDidFailComponent {...(this.props.processingDidFailComponentProps || {})} />
        )}

        { shouldShow.recordCoundNoneComponent && (
          <this.props.recordCountNoneComponent {...(this.props.recordCountNoneComponentProps || {})} />
        )}

        { shouldShow.options && this.props.options.map(option => (
          <this.props.optionComponent
            key={this.props.field.getKey(option)}
            {...this.getPropsOption(option)}
          />
        ))}
      </this.props.component>
    );
  }
}

WidgetList.propTypes = {
  component: PropTypesPlus.component,
  componentProps: PropTypes.shape({}),
  disabled: PropTypes.bool,
  field: PropTypesEntity.field.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypesImmutable.list,
  optionComponent: PropTypesPlus.component,
  optionComponentProps: PropTypesPlus.componentProps,
  processing: PropTypes.bool,
  processingComponent: PropTypesPlus.isRequiredIf('processingComponentProps', PropTypesPlus.component),
  processingComponentProps: PropTypes.shape({}),
  processingDidFail: PropTypes.bool,
  processingDidFailComponent: PropTypesPlus.isRequiredIf('processingDidFailComponentProps', PropTypesPlus.component),
  processingDidFailComponentProps: PropTypes.shape({}),
  readOnly: PropTypes.bool,
};

WidgetList.defaultProps = {
  component: ListComponent,
  componentProps: {},
  disabled: false,
  options: undefined,
  optionComponent: OptionText,
  optionComponentProps: {},
  processing: false,
  processingComponent: undefined,
  processingComponentProps: undefined,
  processingDidFail: false,
  processingDidFailComponent: undefined,
  processingDidFailComponentProps: undefined,
  readOnly: false,
};

export default withDefault({
  processingComponent: ['entityWidget_processing', 'component_processing'],
  processingDidFailComponent: ['entityWidget_processingDidFail', 'component_processingDidFail'],
  recordCountNoneComponent: ['entityWidget_recordCountNone', 'component_recordCountNone'],
})(WidgetList);
