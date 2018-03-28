/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

export default class MarkdownView extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
  };

  transformImageUri = input => {
    return /^https?:/.test(input) ? input : `/tutorial/${input}`;
  };

  render() {
    return (
      <ReactMarkdown
        transformImageUri={this.transformImageUri}
        source={this.props.source}
      />
    );
  }
}
