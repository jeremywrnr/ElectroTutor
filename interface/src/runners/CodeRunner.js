import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MarkdownView from '../MarkdownView.js';

//
// Code Analysis
//

class CodeRunner extends Component {
  verify = () => {
    const code = this.props.selected;
    const data = JSON.parse(this.props.test.jsondata);
    const regex = new RegExp(data.match, data.flag || '');
    const pass = regex.test(code);
    this.props.patch(pass);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    const sel = this.props.selected;
    return (
      <div className="full">
        <MarkdownView source={this.props.test.description} />
        <br />
        {sel && (
          <SyntaxHighlighter language="arduino">
            {this.props.selected}
          </SyntaxHighlighter>
        )}
      </div>
    );
  }
}

export default CodeRunner;
