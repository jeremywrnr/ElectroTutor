import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MarkdownView from '../MarkdownView.js';
import {Message} from 'semantic-ui-react';

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
    const fail = this.props.pdata.state === 'fail';
    const help = this.props.test.onerror;
    const sel = this.props.selected;
    const show = fail && help;

    return (
      <div className="full">
        <MarkdownView source={this.props.test.description} />
        {show ? <Message info content={help} /> : <br />}
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
