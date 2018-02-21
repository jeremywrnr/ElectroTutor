/**
 * Render and link the code
 */

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'brace';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/mode/c_cpp';

class Code extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    code: PropTypes.string.isRequired,
  };

  static defaultProps = {
    code: "void setup() {\n\n}\nvoid loop() {\n\n}",
    onChange: () => {},
    onUpdate: () => {},
    readOnly: true,
  };

  componentWillUpdate = e => {
    this.props.onUpdate(e)
  }

  // Alias mounting flash with component flash
  componentWillMount = this.componentWillUpdate

  render() {
    return (
      <AceEditor
        name={this.props.name}
        onChange={this.props.onChange}
        mode="c_cpp"
        cursorStart={1}
        bottom={ 0 }
        fontSize={11}
        theme="github"
        showPrintMargin={true}
        showGutter={true}
        readOnly={this.props.readOnly}
        wrapEnabled={true}
        width="100%"
        highlightActiveLine={true}
        value={this.props.code}
        ref={ (editor) => { this.aceEditor = editor } }
        editorProps={{
        $blockScrolling: Infinity,
        }}
        setOptions={{
        showLineNumbers: true,
        tabSize: 2,
        }}/>
      );
  };
}

export default Code
