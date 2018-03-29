/**
 * Render and link the code
 */

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'brace';
import 'brace/theme/tomorrow';
import 'brace/theme/ambiance';
import 'brace/theme/terminal';
import 'brace/theme/gob';
import 'brace/mode/markdown';
import 'brace/mode/c_cpp';
import 'brace/ext/language_tools.js';

class Code extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onUpdate: PropTypes.func,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onChange: function() {},
    onUpdate: function() {},
    mode: 'c_cpp',
    width: '100%',
    fontSize: 12,
    //cursorStart: 1,
    readOnly: true,
    showLines: false,
    showGutter: false,
    theme: 'tomorrow',
    wrapEnabled: true,
    showPrintMargin: false,
    highlightActiveLine: false,
    value: 'void setup() {\n\n}\n\nvoid loop() {\n\n}',
  };

  // Alias mounting flash with component flash
  componentWillUpdate = e => this.props.onUpdate(e);
  componentWillMount = this.componentWillUpdate;

  render() {
    const editProps = {
      $blockScrolling: Infinity,
    };

    const options = {
      //maxLines: Infinity,
      //enableLiveAutocompletion: true,
      enableBasicAutocompletion: true,
      showLineNumbers: this.props.showLines,
      scrollPastEnd: true,
      tabSize: 2,
    };

    return (
      <AceEditor
        {...this.props}
        editorProps={editProps}
        setOptions={options}
        ref={editor => {
          this.aceEditor = editor;
        }}
      />
    );
  }
}

export default Code;
