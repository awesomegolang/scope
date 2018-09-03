import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Search } from 'weaveworks-ui-components';
import styled from 'styled-components';

import { doSearch, toggleHelp } from '../actions/app-actions';
import { searchMatchCountByTopologySelector } from '../selectors/search';
import { isResourceViewModeSelector } from '../selectors/topology';
import { slugify } from '../utils/string-utils';
import { isTopologyNodeCountZero } from '../utils/topology-utils';
import { trackAnalyticsEvent } from '../utils/tracking-utils';


function shortenHintLabel(text) {
  return text
    .split(' ')[0]
    .toLowerCase()
    .substr(0, 12);
}

const SearchHint = styled.div`
  font-size: ${props => props.theme.fontSizes.tiny};
  color: ${props => props.theme.colors.purple400};
  transition: transform 0.3s 0s ease-in-out, opacity 0.3s 0s ease-in-out;
  text-align: left;
  padding: 0 1em;
  opacity: 0;

  ${props => props.active && `
    opacity: 1;
  `};
`;

const SearchHintIcon = styled.span`
  font-size: ${props => props.theme.fontSizes.normal};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.purple600};
  }
`;

const SearchContainer = styled.div`
  transition: width 0.3s 0s ease-in-out;
  display: inline-block;
  position: relative;
  width: 10em;

  ${props => props.focused && `
    width: 100%;
  `};
`;


// dynamic hint based on node names
function getHint(nodes) {
  let label = 'mycontainer';
  let metadataLabel = 'ip';
  let metadataValue = '10.1.0.1';

  const node = nodes.filter(n => !n.get('pseudo') && n.has('metadata')).last();
  if (node) {
    [label] = shortenHintLabel(node.get('label')).split('.');
    if (node.get('metadata')) {
      const metadataField = node.get('metadata').first();
      metadataLabel = shortenHintLabel(slugify(metadataField.get('label')))
        .split('.').pop();
      metadataValue = shortenHintLabel(metadataField.get('value'));
    }
  }

  return `Try "${label}", "${metadataLabel}:${metadataValue}", or "cpu > 2%".`;
}


class SearchWrapper extends React.Component {
  state = {
    value: '',
    focused: false,
  };

  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.doSearch = debounce(this.doSearch.bind(this), 200);
  }

  handleChange(ev) {
    const inputValue = ev.target.value;
    let value = inputValue;
    // In render() props.searchQuery can be set from the outside, but state.value
    // must have precedence for quick feedback. Now when the user backspaces
    // quickly enough from `text`, a previouse doSearch(`text`) will come back
    // via props and override the empty state.value. To detect this edge case
    // we instead set value to null when backspacing.
    if (this.state.value && value === '') {
      value = null;
    }
    this.setState({ value });
    this.doSearch(inputValue);
  }

  doSearch(value) {
    if (value !== '') {
      trackAnalyticsEvent('scope.search.query.change', {
        layout: this.props.topologyViewMode,
        topologyId: this.props.currentTopology.get('id'),
        parentTopologyId: this.props.currentTopology.get('parentId'),
      });
    }
    this.props.doSearch(value);
  }

  componentWillReceiveProps(nextProps) {
    // when cleared from the outside, reset internal state
    if (this.props.searchQuery !== nextProps.searchQuery && nextProps.searchQuery === '') {
      this.setState({ value: '' });
    }
  }

  handleChange = () => {}

  handleFocus = () => {
    this.setState({ focused: true });
  }

  handleBlur = () => {
    this.setState({ focused: false });
  }

  render() {
    const {
      nodes, pinnedSearches, searchMatchCountByTopology,
      isResourceViewMode, searchQuery, topologiesLoaded
    } = this.props;
    const { focused } = this.state;

    const hidden = !topologiesLoaded || isResourceViewMode;
    const disabled = this.props.isTopologyNodeCountZero && !hidden;
    const showPinnedSearches = pinnedSearches.size > 0;

    // manual clear (null) has priority, then props, then state
    const classNames = classnames('search', 'hideable', {
      hide: hidden,
      'search-disabled': disabled
    });

    const matchCount = searchMatchCountByTopology
      .reduce((count, topologyMatchCount) => count + topologyMatchCount, 0);
    const title = matchCount ? `${matchCount} matches` : undefined;

    console.log(classNames, searchQuery, pinnedSearches.toJS());

    return (
      <div className="search-wrapper">
        <SearchContainer focused={focused} title={title}>
          <Search
            placeholder="search"
            query={searchQuery}
            pinnedTerms={pinnedSearches.toJS()}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {!showPinnedSearches &&
            <SearchHint active={focused}>
              {getHint(nodes)} <SearchHintIcon
                className="fa fa-question-circle"
                onMouseDown={this.props.toggleHelp}
              />
            </SearchHint>
          }
        </SearchContainer>
      </div>
    );
  }
}


export default connect(
  state => ({
    nodes: state.get('nodes'),
    topologyViewMode: state.get('topologyViewMode'),
    isResourceViewMode: isResourceViewModeSelector(state),
    isTopologyNodeCountZero: isTopologyNodeCountZero(state),
    currentTopology: state.get('currentTopology'),
    topologiesLoaded: state.get('topologiesLoaded'),
    pinnedSearches: state.get('pinnedSearches'),
    searchQuery: state.get('searchQuery'),
    searchMatchCountByTopology: searchMatchCountByTopologySelector(state),
  }),
  {
    doSearch, toggleHelp
  }
)(SearchWrapper);
