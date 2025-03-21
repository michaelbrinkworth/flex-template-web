import React, { Component } from 'react';
import { object, string, bool, number, func, shape, array } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { withRouter } from 'react-router-dom';
import omit from 'lodash/omit';
import { parse } from '../../util/urlHelpers';
import config from '../../config';

import routeConfiguration from '../../routeConfiguration';
import { parseDateFromISO8601, stringifyDateToISO8601 } from '../../util/dates';
import { createResourceLocatorString } from '../../util/routes';
import {
  ModalInMobile,
  Button,
  KeywordFilter,
  PriceFilter,
  SelectSingleFilter,
  SelectMultipleFilter,
  BookingDateRangeFilter,
} from '../../components';
import { TopbarSearchForm } from '../../forms';
import CustomSearchForm from '../../forms/CustomForm/CustomForm';
import KeyWordFilter2 from '../../forms/CustomForm2/CustomForm2';
import { propTypes } from '../../util/types';
import css from './SearchFiltersMobile.css';

const RADIX = 10;
const MODAL_BREAKPOINT = 768; // Search is in modal on mobile layout

class SearchFiltersMobileComponent extends Component {
  constructor(props) {
    super(props);
    this.customFilters = { paramName: '', options: [] };
    this.state = {
      isFiltersOpenOnMobile: false,
      typesFilter: { paramName: '', options: [] },
      initialQueryParams: null,
    };

    this.openFilters = this.openFilters.bind(this);
    this.cancelFilters = this.cancelFilters.bind(this);
    this.closeFilters = this.closeFilters.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.handleSelectSingle = this.handleSelectSingle.bind(this);
    this.handleSelectMultiple = this.handleSelectMultiple.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleDateRange = this.handleDateRange.bind(this);
    this.handleKeyword = this.handleKeyword.bind(this);
    this.initialValue = this.initialValue.bind(this);
    this.initialValues = this.initialValues.bind(this);
    this.handleSubmit =this.handleSubmit.bind(this);
    this.initialPriceRangeValue = this.initialPriceRangeValue.bind(this);
    this.initialDateRangeValue = this.initialDateRangeValue.bind(this);
  }

  // Open filters modal, set the initial parameters to current ones
  openFilters() {
    const { onOpenModal, urlQueryParams } = this.props;
    onOpenModal();
    this.setState({ isFiltersOpenOnMobile: true, initialQueryParams: urlQueryParams });
  }

  // Close the filters by clicking cancel, revert to the initial params
  cancelFilters() {
    const { history, onCloseModal } = this.props;

    history.push(
      createResourceLocatorString(
        'SearchPage',
        routeConfiguration(),
        {},
        this.state.initialQueryParams
      )
    );
    onCloseModal();
    this.setState({ isFiltersOpenOnMobile: false, initialQueryParams: null });
  }

  // Close the filter modal
  closeFilters() {
    this.props.onCloseModal();
    this.setState({ isFiltersOpenOnMobile: false });
  }

  handleSelectSingle(urlParam, option) {
    const { urlQueryParams, history } = this.props;

    // query parameters after selecting the option
    // if no option is passed, clear the selection for the filter
    const queryParams = option
      ? { ...urlQueryParams, [urlParam]: option }
      : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  handleSelectMultiple(urlParam, options) {
    const { urlQueryParams, history } = this.props;

    const queryParams =
      options && options.length > 0
        ? { ...urlQueryParams, [urlParam]: options.join(',') }
        : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  handlePrice(urlParam, range) {
    const { urlQueryParams, history } = this.props;
    const { minPrice, maxPrice } = range || {};
    const queryParams =
      minPrice != null && maxPrice != null
        ? { ...urlQueryParams, [urlParam]: `${minPrice},${maxPrice}` }
        : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  handleDateRange(urlParam, dateRange) {
    const { urlQueryParams, history } = this.props;
    const hasDates = dateRange && dateRange.dates;
    const { startDate, endDate } = hasDates ? dateRange.dates : {};

    const start = startDate ? stringifyDateToISO8601(startDate) : null;
    const end = endDate ? stringifyDateToISO8601(endDate) : null;

    const queryParams =
      start != null && end != null
        ? { ...urlQueryParams, [urlParam]: `${start},${end}` }
        : omit(urlQueryParams, urlParam);
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  handleKeyword(urlParam, keywords) {
    const { urlQueryParams, history } = this.props;
    const queryParams = urlParam
      ? { ...urlQueryParams, [urlParam]: keywords }
      : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  // Reset all filter query parameters
  resetAll(e) {
    const { urlQueryParams, history, filterParamNames } = this.props;

    const queryParams = omit(urlQueryParams, filterParamNames);
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));

    // blur event target if event is passed
    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
  }

  // resolve initial value for a single value filter
  initialValue(paramName) {
    return this.props.urlQueryParams[paramName];
  }

  // resolve initial values for a multi value filter
  initialValues(paramName) {
    const urlQueryParams = this.props.urlQueryParams;
    return !!urlQueryParams[paramName] ? urlQueryParams[paramName].split(',') : [];
  }

  initialPriceRangeValue(paramName) {
    const urlQueryParams = this.props.urlQueryParams;
    const price = urlQueryParams[paramName];
    const valuesFromParams = !!price ? price.split(',').map(v => Number.parseInt(v, RADIX)) : [];

    return !!price && valuesFromParams.length === 2
      ? {
          minPrice: valuesFromParams[0],
          maxPrice: valuesFromParams[1],
        }
      : null;
  }

  initialDateRangeValue(paramName) {
    const urlQueryParams = this.props.urlQueryParams;
    const dates = urlQueryParams[paramName];
    const rawValuesFromParams = !!dates ? dates.split(',') : [];
    const valuesFromParams = rawValuesFromParams.map(v => parseDateFromISO8601(v));
    const initialValues =
      !!dates && valuesFromParams.length === 2
        ? {
            dates: { startDate: valuesFromParams[0], endDate: valuesFromParams[1] },
          }
        : { dates: null };

    return initialValues;
  }

  handleSubmit(values) {
    const { currentSearchParams } = this.props;
    const { search, selectedPlace } = values.location;
    const { history } = this.props;
    const { origin, bounds } = selectedPlace;
    const originMaybe = config.sortSearchByDistance ? { origin } : {};
    const searchParams = {
      ...currentSearchParams,
      ...originMaybe,
      address: search,
      bounds,
    };
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, searchParams));
  }

  componentDidMount() {
    this.updateTypes(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateTypes(this.props);
    }
  }

  updateTypes = props => {
    if (props.urlQueryParams.pub_category) {
      const makeChange = () => {
        this.setState({ new: !this.state.new });
        this.customFilters = { ...props.typesFilter };
      };
      const { pub_category, pub_types } = props.urlQueryParams;
      if (!pub_category && !pub_types) return;
      // (pub_types === 'Traditional,Open-Air' || pub_types === 'Open-Air,Traditional') &&
      pub_category === 'Photo Booth'
        ? this.filterTypes(props.typesFilter)
        : makeChange();
    } else {
      this.customFilters = props.typesFilter;
      this.setState({ customFilters: props.typesFilter });
    }
    return;
  };

  filterTypes = types => {
    const newTypes = types.options.filter(
      typ => typ.key === 'Open-Air' || typ.key === 'Traditional'
    );
    let typesFilter = { paramName: 'pub_types', options: [...newTypes] };
    this.setState({ new: true });
    this.customFilters = typesFilter;
  };

  render() {
    const {
      rootClassName,
      customState,
      className,
      listingsAreLoaded,
      resultsCount,
      searchInProgress,
      showAsModalMaxWidth,
      onMapIconClick,
      onManageDisableScrolling,
      selectedFiltersCount,
      categoryFilter,
      priceFilter,
      dateRangeFilter,
      keywordFilter,
      intl,
      location
    } = this.props;

    const typesFilter = this.state.typesFilter;

    if (this.state.isFiltersOpenOnMobile !== customState) {
      this.openFilters();
    }

    const classes = classNames(rootClassName || css.root, className);

    const resultsFound = (
      <FormattedMessage id="SearchFilters.foundResults" values={{ count: resultsCount }} />
    );
    const noResults = <FormattedMessage id="SearchFilters.noResultsMobile" />;
    const loadingResults = <FormattedMessage id="SearchFilters.loadingResultsMobile" />;
    const filtersHeading = intl.formatMessage({ id: 'SearchFiltersMobile.heading' });
    const modalCloseButtonMessage = intl.formatMessage({ id: 'SearchFiltersMobile.cancel' });

    const showListingsLabel = intl.formatMessage(
      { id: 'SearchFiltersMobile.showListings' },
      { count: resultsCount }
    );

    const filtersButtonClasses =
      selectedFiltersCount > 0 ? css.filtersButtonSelected : css.filtersButton;

    const categoryLabel = intl.formatMessage({
      id: 'SearchFiltersMobile.categoryLabel',
    });
    const initialCategory = categoryFilter ? this.initialValue(categoryFilter.paramName) : null;

    const categoryFilterElement = categoryFilter ? (
      <SelectSingleFilter
        urlParam={categoryFilter.paramName}
        label={categoryLabel}
        onSelect={this.handleSelectSingle}
        liveEdit
        options={categoryFilter.options}
        initialValue={initialCategory}
        intl={intl}
      />
    ) : null;

    const typesLabel = intl.formatMessage({ id: 'SearchFiltersMobile.typesLabel' });

    const initialTypes = this.initialValues(this.customFilters.paramName);

    const typesFilterElement = typesFilter ? (
      <SelectMultipleFilter
        id="SearchFiltersMobile.typesFilter"
        name="types"
        urlParam={this.customFilters.paramName}
        label={typesLabel}
        onSubmit={this.handleSelectMultiple}
        liveEdit
        options={this.customFilters.options}
        initialValues={initialTypes}
      />
    ) : null;

    const initialPriceRange = this.initialPriceRangeValue(priceFilter.paramName);

    const priceFilterElement = priceFilter ? (
      <PriceFilter
        id="SearchFiltersMobile.priceFilter"
        urlParam={priceFilter.paramName}
        onSubmit={this.handlePrice}
        liveEdit
        {...priceFilter.config}
        initialValues={initialPriceRange}
      />
    ) : null;

    const initialDateRange = this.initialDateRangeValue(dateRangeFilter.paramName);

    const dateRangeFilterElement =
      dateRangeFilter && dateRangeFilter.config.active ? (
        <BookingDateRangeFilter
          id="SearchFiltersMobile.dateRangeFilter"
          urlParam={dateRangeFilter.paramName}
          onSubmit={this.handleDateRange}
          liveEdit
          showAsPopup={false}
          initialValues={initialDateRange}
        />
      ) : null;

    const initialKeyword = this.initialValue(keywordFilter.paramName);
    const keywordLabel = intl.formatMessage({
      id: 'SearchFiltersMobile.keywordLabel',
    });
    const keywordFilterElement =
      keywordFilter && keywordFilter.config.active ? (
        <KeywordFilter
          id={'SearchFiltersMobile.keywordFilter'}
          name="keyword"
          urlParam={keywordFilter.paramName}
          label={keywordLabel}
          onSubmit={this.handleKeyword}
          liveEdit
          showAsPopup={false}
          initialValues={initialKeyword}
        />
      ) : null;

      const { mobilemenu, mobilesearch, address, origin, bounds } = parse(location.search, {
        latlng: ['origin'],
        latlngBounds: ['bounds'],
      });
      const locationFieldsPresent = config.sortSearchByDistance
        ? address && origin && bounds
        : address && bounds;
      const initialSearchFormValues = {
        location: locationFieldsPresent
          ? {
              search: address,
              electedPlace: { address, origin, bounds },
            }
          : null,
      };
  
      const locationFilter = (
        <div style={{ paddingTop: '15px', borderBottom: '#4928D7 2px solid' }}>
          <span className={css.showSpan}>Location Search</span>
          <TopbarSearchForm
            onSubmit={this.handleSubmit}
            initialValues={initialSearchFormValues}
            isMobile={false}
          />
        </div>);

    return (
      <div>
        {window && window.innerWidth < MODAL_BREAKPOINT ? (
          <div className={css.cusNav}>
            {/* <CustomSearchForm
              id={'SearchFiltersMobile.keywordFilter'}
              name="keyword"
              urlParam={keywordFilter.paramName}
              label={keywordLabel}
              onSubmit={this.handleKeyword}
              liveEdit
              showAsPopup={false}
              initialValues={initialKeyword}
            /> */}
            <KeyWordFilter2
            id={'SearchFiltersMobile.keywordFilter'}
            name="keyword"
            urlParam={keywordFilter.paramName}
            label={keywordLabel}
            onSubmit={this.handleKeyword}
            liveEdit
            showAsPopup={false}
            initialValues={initialKeyword}
            />
            {/* <KeywordFilter
              id={'SearchFiltersMobile.keywordFilter'}
              name="keyword"
              urlParam={keywordFilter.paramName}
              label={keywordLabel}
              onSubmit={this.handleKeyword}
              liveEdit
              showAsPopup={false}
              initialValues={initialKeyword}
            /> */}
          </div>
        ) : null}
        <div className={classes}>
          <div className={css.searchResultSummary}>
            {listingsAreLoaded && resultsCount > 0 ? resultsFound : null}
            {listingsAreLoaded && resultsCount === 0 ? noResults : null}
            {searchInProgress ? loadingResults : null}
          </div>
          <div className={css.buttons}>
          <Button rootClassName={filtersButtonClasses} onClick={this.openFilters}>
              <FormattedMessage id="SearchFilters.filtersButtonLabel" className={css.mapIconText} />
            </Button>
            <div className={css.mapIcon} onClick={onMapIconClick}>
              <FormattedMessage id="SearchFilters.openMapView" className={css.mapIconText} />
            </div>
          {this.state.isFiltersOpenOnMobile ? (
            <div className={css.filtersWrapper}>
              {/* {keywordFilterElement} */}
              {categoryFilterElement}
              {locationFilter}
              {typesFilterElement}
              {priceFilterElement}
              {dateRangeFilterElement}
            </div>
          ) : null}

          <div className={css.showListingsContainer}>
            <Button className={css.showListingsButton} onClick={this.closeFilters}>
              {showListingsLabel}

            </Button>
            
          </div>
          <ModalInMobile
            id="SearchFiltersMobile.filters"
            isModalOpenOnMobile={this.state.isFiltersOpenOnMobile}
            onClose={this.cancelFilters}
            showAsModalMaxWidth={showAsModalMaxWidth}
            onManageDisableScrolling={onManageDisableScrolling}
            containerClassName={css.modalContainer}
            closeButtonMessage={modalCloseButtonMessage}
          >
            <div className={css.modalHeadingWrapper}>
              <span className={css.modalHeading}>{filtersHeading}</span>
              <button className={css.resetAllButton} onClick={e => this.resetAll(e)}>
                <FormattedMessage id={'SearchFiltersMobile.resetAll'} />
              </button>
            </div>
            {this.state.isFiltersOpenOnMobile ? (
              <div className={css.filtersWrapper}>
                {categoryFilterElement}
                {typesFilterElement}
                {locationFilter}
                {priceFilterElement}
                {dateRangeFilterElement}
              </div>
            ) : null}

            <div className={css.showListingsContainer}>
              <Button className={css.showListingsButton} onClick={this.closeFilters}>
                {showListingsLabel}
              </Button>
            </div>
          </ModalInMobile>
        </div>
      </div>
      </div>
    );
  }
}

SearchFiltersMobileComponent.defaultProps = {
  rootClassName: null,
  className: null,
  resultsCount: null,
  searchingInProgress: false,
  selectedFiltersCount: 0,
  filterParamNames: [],
  categoryFilter: null,
  typesFilter: null,
  priceFilter: null,
  dateRangeFilter: null,
};

SearchFiltersMobileComponent.propTypes = {
  rootClassName: string,
  className: string,
  urlQueryParams: object.isRequired,
  listingsAreLoaded: bool.isRequired,
  resultsCount: number,
  searchingInProgress: bool,
  showAsModalMaxWidth: number.isRequired,
  onMapIconClick: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onOpenModal: func.isRequired,
  onCloseModal: func.isRequired,
  selectedFiltersCount: number,
  filterParamNames: array,
  categoriesFilter: propTypes.filterConfig,
  typesFilter: propTypes.filterConfig,
  priceFilter: propTypes.filterConfig,
  dateRangeFilter: propTypes.filterConfig,

  // from injectIntl
  intl: intlShape.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

const SearchFiltersMobile = injectIntl(withRouter(SearchFiltersMobileComponent));

export default SearchFiltersMobile;
