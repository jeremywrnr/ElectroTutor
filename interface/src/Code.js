/**
 * Render and link the code
 */

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'brace';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';

class Code extends React.Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    code: '...',
    onChange: () => {},
    readOnly: true,
  };

  render() {
    const read = this.props.readOnly

    return (
      <AceEditor
        name={this.props.name}
        onChange={this.props.onChange}
        mode="c_cpp"
        cursorStart={1}
        bottom={ 0 }
        fontSize={12}
        theme="github"
        showPrintMargin={true}
        showGutter={true}
        readOnly={read}
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
