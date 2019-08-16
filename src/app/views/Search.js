import React from 'react';
import PropTypes from 'prop-types';
// @TODO: in v6 we need to change the import
// import { findResultsState } from 'react-instantsearch-dom/server';
import { createInstantSearch } from 'react-instantsearch-dom/server';
import {
  // InstantSearch
  RefinementList,
  SearchBox,
  Hits,
  Configure,
} from 'react-instantsearch-dom';
import { Link } from 'react-router-dom';
import qs from 'qs';
import algoliasearch from 'algoliasearch/lite';

// @TODO: remove in v6
const { InstantSearch, findResultsState } = createInstantSearch();

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76',
  {
    _useRequestCache: true,
  }
);

const QUERY_TIMEOUT_MS = 700;

const QS_OPTIONS = {
  arrayFormat: 'repeat',
  arrayLimit: 99,
  addQueryPrefix: true,
  ignoreQueryPrefix: true,
  encodeValuesOnly: true,
};

// we don't serialize configure, because it's static
const createURL = ({ configure, ...state }) => qs.stringify(state, QS_OPTIONS);

const searchStateToUrl = location => searchState =>
  location.pathname + createURL(searchState);

const urlToSearchState = location => qs.parse(location.search, QS_OPTIONS);

const useRouting = ({ location, history }) => {
  const debouncedSetState = React.useRef();
  const [searchState, setSearchState] = React.useState(
    urlToSearchState(location)
  );

  const onSearchStateChange = newSearchState => {
    if (debouncedSetState.current) {
      clearTimeout(debouncedSetState);
    }
    debouncedSetState.current = setTimeout(() => {
      history.push(searchStateToUrl(location)(newSearchState), newSearchState);
    }, QUERY_TIMEOUT_MS);
    setSearchState(newSearchState);
  };

  return [searchState, onSearchStateChange];
};

const Search = ({ serverData, location, history }) => {
  const [searchState, onSearchStateChange] = useRouting({ location, history });

  const resultsState =
    serverData && serverData.find(data => data.dataType === 'algolia');

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="instant_search"
      resultsState={resultsState}
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
      createURL={searchStateToUrl(location)}
    >
      <h1>
        Back home: <Link to="/">Home</Link>
      </h1>
      <Configure hitsPerPage={3} />
      <SearchBox />
      <Hits />
      <RefinementList attribute="categories" />
    </InstantSearch>
  );
};
Search.propTypes = {
  serverData: PropTypes.array,
  initialSearchState: PropTypes.object,
  location: PropTypes.any,
  history: PropTypes.any,
};

export const route = {
  path: '/search',
  component: Search,
  loadData: (_match, { App }) =>
    findResultsState(App, { searchClient }).then(data => {
      return {
        // @TODO: change back to spreading data in v6
        state: data.state,
        _originalResponse: data._originalResponse,
        dataType: 'algolia',
      };
    }),
};
