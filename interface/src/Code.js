/**
 * Render and link the code
 */

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'brace';
import 'brace/theme/tomorrow';
import 'brace/mode/c_cpp';

class Code extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onUpdate: PropTypes.func,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onChange: function(){},
    onUpdate: function(){},
    mode: "text",
    readOnly: true,
    showLines: false,
    showGutter: false,
    wrapEnabled: true,
    showPrintMargin: true,
    highlightActiveLine: false,
    value: "void setup() {\n\n}\n\nvoid loop() {\n\n}",
  };

  // Alias mounting flash with component flash
  componentWillUpdate = e => this.props.onUpdate(e)
  componentWillMount = this.componentWillUpdate

  render() {
    const editProps = {
      $blockScrolling: Infinity,
    }

    const options = {
      showLineNumbers: this.props.showLines,
      //maxLines: Infinity,
      scrollPastEnd: true,
      tabSize: 2,
    }

    return (
      <AceEditor
        {...this.props}
        cursorStart={1}
        fontSize={12}
        width="100%"
        theme="tomorrow"
        editorProps={editProps}
        setOptions={options}
        ref={ (editor) => { this.aceEditor = editor } }
      />
      );
  };
}

export default Code
