/**
 * Currently just renders the code as text
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
    onChange: PropTypes.func.isRequired,
    code: PropTypes.string.isRequired,
    newRanges: PropTypes.array
  };

  static defaultProps = {
    newRanges: []
  };

  // onSelectionChange(selection) {
  // }

  render() {
    return (
      <AceEditor
        cursorStart={1}
        mode="javascript"
        ref={(editor) => { this.aceEditor = editor; }}
        name="blah2"
        fontSize={14}
        theme="github"
        onChange={this.props.onChange}
        // onSelectionChange={ (s) => { this.onSelectionChange(s); } }
        showPrintMargin={true}
        showGutter={true}
        markers={this.props.newRanges.map((range) => {
          return {
            startRow: range.startLineNumber,
            startCol: range.startColumn,
            endRow: range.endLineNumber,
            endCol: range.endColumn,
            type: 'text',
            className: 'changed-code'
          }
        })}
        width={"100%"}
        highlightActiveLine={true}
        value={this.props.code}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}/>
      );
  }

  componentDidMount() {
    this.aceEditor.editor.session.setScrollTop(0);
  }

  componentDidUpdate() {
    this.aceEditor.editor.session.setScrollTop(0);
  }

}

export default Code;
