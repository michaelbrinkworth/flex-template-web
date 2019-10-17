import React, { Component } from 'react';
import { func, number, string } from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from '../../util/reactIntl';
import debounce from 'lodash/debounce';
import { FieldTextInput } from '../../components';

import { FilterPopup, FilterPlain } from '../../components';
import css from './CustomForm.css';
import SearchIcon from '../../components/Topbar/SearchIcon';

// When user types, we wait for new keystrokes a while before searching new content
const DEBOUNCE_WAIT_TIME = 600;
// Short search queries (e.g. 2 letters) have a longer timeout before search is made
const TIMEOUT_FOR_SHORT_QUERIES = 2000;

class KeywordFilter2 extends Component {
  constructor(props) {
    super(props);

    this.filter = null;
    this.filterContent = null;
    this.shortKeywordTimeout = null;
    this.mobileInputRef = React.createRef();

    this.positionStyleForContent = this.positionStyleForContent.bind(this);
  }

  componentWillUnmount() {
    window.clearTimeout(this.shortKeywordTimeout);
  }

  positionStyleForContent() {
    if (this.filter && this.filterContent) {
      // Render the filter content to the right from the menu
      // unless there's no space in which case it is rendered
      // to the left
      const distanceToRight = window.innerWidth - this.filter.getBoundingClientRect().right;
      const labelWidth = this.filter.offsetWidth;
      const contentWidth = this.filterContent.offsetWidth;
      const contentWidthBiggerThanLabel = contentWidth - labelWidth;
      const renderToRight = distanceToRight > contentWidthBiggerThanLabel;
      const contentPlacementOffset = this.props.contentPlacementOffset;

      const offset = renderToRight
        ? { left: contentPlacementOffset }
        : { right: contentPlacementOffset };
      // set a min-width if the content is narrower than the label
      const minWidth = contentWidth < labelWidth ? { minWidth: labelWidth } : null;

      return { ...offset, ...minWidth };
    }
    return {};
  }

  render() {
    const {
      rootClassName,
      className,
      id,
      name,
      label,
      initialValues,
      contentPlacementOffset,
      onSubmit,
      urlParam,
      intl,
      showAsPopup,
      ...rest
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);

    const hasInitialValues = !!initialValues && initialValues.length > 0;
    const labelForPopup = hasInitialValues
      ? intl.formatMessage({ id: 'KeywordFilter.labelSelected' }, { labelText: initialValues })
      : label;

    const labelForPlain = hasInitialValues
      ? intl.formatMessage(
          { id: 'KeywordFilterPlainForm.labelSelected' },
          { labelText: initialValues }
        )
      : label;

    const filterText = intl.formatMessage({ id: 'KeywordFilter.filterText' });

    const placeholder = intl.formatMessage({ id: 'KeywordFilter.placeholder' });

    const contentStyle = this.positionStyleForContent();

    // pass the initial values with the name key so that
    // they can be passed to the correct field
    const namedInitialValues = { [name]: initialValues };

    const handleSubmit = (urlParam, values) => {
      const usedValue = values ? values[name] : values;
      onSubmit(urlParam, usedValue);
    };

    const debouncedSubmit = debounce(handleSubmit, DEBOUNCE_WAIT_TIME, {
      leading: false,
      trailing: true,
    });
    // Use timeout for shart queries and debounce for queries with any length
    const handleChangeWithDebounce = (urlParam, values) => {
      // handleSubmit gets urlParam and values as params.
      // If this field ("keyword") is short, create timeout
      const hasKeywordValue = values && values[name];
      const keywordValue = hasKeywordValue ? values && values[name] : '';
      if (urlParam && (!hasKeywordValue || (hasKeywordValue && keywordValue.length >= 3))) {
        if (this.shortKeywordTimeout) {
          window.clearTimeout(this.shortKeywordTimeout);
        }
        return debouncedSubmit(urlParam, values);
      } else {
        this.shortKeywordTimeout = window.setTimeout(() => {
          // if mobileInputRef exists, use the most up-to-date value from there
          return this.mobileInputRef && this.mobileInputRef.current
            ? handleSubmit(urlParam, { ...values, [name]: this.mobileInputRef.current.value })
            : handleSubmit(urlParam, values);
        }, TIMEOUT_FOR_SHORT_QUERIES);
      }
    };

    // Uncontrolled input needs to be cleared through the reference to DOM element.
    const handleClear = () => {
      if (this.mobileInputRef && this.mobileInputRef.current) {
        this.mobileInputRef.current.value = '';
      }
    };

    return showAsPopup ? (
      <FilterPopup
        className={classes}
        rootClassName={rootClassName}
        popupClassName={css.popupSize}
        name={name}
        label={labelForPopup}
        isSelected={hasInitialValues}
        id={`${id}.popup`}
        showAsPopup
        labelMaxWidth={250}
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        initialValues={namedInitialValues}
        urlParam={urlParam}
        keepDirtyOnReinitialize
        {...rest}
      >
        <FieldTextInput
          className={css.field}
          name={name}
          id={`${id}-input`}
          type="text"
          label={filterText}
          placeholder={placeholder}
          autoComplete="off"
        />
      </FilterPopup>
    ) : (
      <FilterPlain style={{marigin:'0', border:'none', padding: '0' }}
        isTwo
        // className={className}
        // rootClassName={rootClassName}
        label={labelForPlain}
        isSelected={hasInitialValues}
        id={`${id}.plain`}
        liveEdit
        contentPlacementOffset={contentStyle}
        onSubmit={handleChangeWithDebounce}
        onClear={handleClear}
        initialValues={namedInitialValues}
        urlParam={urlParam}
        {...rest}
      >
        <div className={css.customInp}>
          {/* <label>{filterText}</label> */}
          <div style={{marginRight:'8px', marginTop:'-8px'}}>
          <SearchIcon ></SearchIcon>
          </div>
          <FieldTextInput
            name={name}
            id={`${id}-input`}
            style={{width:'100%'}}
            isUncontrolled
            inputRef={this.mobileInputRef}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
          />
        </div>
      </FilterPlain>
    );
  }
}

KeywordFilter2.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
};

KeywordFilter2.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  name: string.isRequired,
  urlParam: string.isRequired,
  label: string.isRequired,
  onSubmit: func.isRequired,
  initialValues: string,
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(KeywordFilter2);
