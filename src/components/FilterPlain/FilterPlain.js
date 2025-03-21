import React, { Component } from 'react';
import { bool, func, node, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';

import { FilterForm } from '../../forms';
import css from './FilterPlain.css';

class FilterPlainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true };

    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  handleChange(values) {
    const { onSubmit, urlParam } = this.props;
    onSubmit(urlParam, values);
  }

  handleClear() {
    const { onSubmit, onClear, urlParam } = this.props;

    if (onClear) {
      onClear();
    }

    onSubmit(urlParam, null);
  }

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const {
      rootClassName,
      className,
      plainClassName,
      id,
      label,
      isSelected,
      children,
      initialValues,
      keepDirtyOnReinitialize,
      contentPlacementOffset,
      isTwo
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    const labelClass = isSelected ? css.filterLabelSelected : css.filterLabel;

    return (
      <div className={ !isTwo ? classes : ''}>
        {!isTwo ? (<div className={labelClass}>
          <button type="button" className={css.labelButton} onClick={this.toggleIsOpen}>
            <span className={labelClass}>{label}</span>
          </button>
          <button type="button" className={css.clearButton} onClick={this.handleClear}>
            <FormattedMessage id={'FilterPlain.clear'} />
          </button>
        </div>) : null}
        <div
          id={id}
          className={classNames(plainClassName, css.plain, { [css.isOpen]: this.state.isOpen })}
          ref={node => {
            this.filterContent = node;
          }}
        >
          <FilterForm
            id={`${id}.form`}
            liveEdit
            contentPlacementOffset={contentPlacementOffset}
            onChange={this.handleChange}
            initialValues={initialValues}
            keepDirtyOnReinitialize={keepDirtyOnReinitialize}
          >
            { children ? children : null}
          </FilterForm>
        </div>
      </div>
    );
  }
}

FilterPlainComponent.defaultProps = {
  rootClassName: null,
  className: null,
  plainClassName: null,
  initialValues: null,
  keepDirtyOnReinitialize: false,
};

FilterPlainComponent.propTypes = {
  rootClassName: string,
  className: string,
  plainClassName: string,
  id: string.isRequired,
  onSubmit: func.isRequired,
  label: node.isRequired,
  isSelected: bool.isRequired,
  children: node.isRequired,
  initialValues: object,
  keepDirtyOnReinitialize: bool,

  // form injectIntl
  intl: intlShape.isRequired,
};

const FilterPlain = injectIntl(FilterPlainComponent);

export default FilterPlain;
