/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default class MarkdownView extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
  };

  codeTagProps = {
    className: 'myCode',
  };

  dragstart = ev => {
    // set the data to move into the editor
    ev.dataTransfer.setData('text', `\n${ev.target.innerText}\n`);
  };

  // disabled the drag - jeremy

  renderers = {
    code: node => (
      <SyntaxHighlighter
        draggable={true}
        onDragStart={this.dragstart}
        language="arduino"
        children={node.value}
      />
    ),
  };

  componentDidMount = () => {
    window.addEventListener('dragstart', this.dragstart);
  };

  transformImageUri = input => {
    return /^https?:/.test(input) ? input : `/tutorial/${input}`;
  };

  render() {
    return (
      <ReactMarkdown
        transformImageUri={this.transformImageUri}
        codeTagProps={this.codeTagProps}
        renderers={this.renderers}
        source={this.props.source}
      />
    );
  }
}
