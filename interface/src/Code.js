/**
 * Render and link the code
 */

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/theme/github';

class Code extends React.Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    code: 'Hello world!'
  };

  render() {
    return (
      <AceEditor
        cursorStart={1}
        mode="javascript"
        ref={(editor) => { this.aceEditor = editor; }}
        name="codeEditor"
        fontSize={14}
        theme="github"
        onChange={this.props.onChange}
        showPrintMargin={true}
        showGutter={true}
        bottom={ 0 }
        width={"100%"}
        highlightActiveLine={true}
        value={this.props.code}
        setOptions={{
        //$blockScrolling = Infinity
        showLineNumbers: true,
        tabSize: 2,
        }}/>
      );
  };
}

export default Code
