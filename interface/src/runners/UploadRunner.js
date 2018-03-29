import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MeasuringMessage from '../MeasuringMessage.js';
import MarkdownView from '../MarkdownView.js';
import {Message} from 'semantic-ui-react';

// Upload code testing

class UploadRunner extends Component {
  state = {};
  verify = () => {
    this.setState({loading: true});
    this.props
      .handleUpload()
      .then(() => this.setState({loading: false}))
      .then(() => {
        const ok = this.props.compile.code === 0;
        this.props.patch(ok);
      });
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    const fail = this.props.pdata.state === 'fail';
    const help = this.props.test.onerror;
    const show = fail && help;

    const ok = this.props.compile.code === 0;
    const err = this.props.compile.error;
    return (
      <div className="full">
        {this.state.loading && (
          <MeasuringMessage
            head="Uploading code..."
            text="Uploading the code for testing."
          />
        )}
        {show ? <Message info content={help} /> : <br />}
        <MarkdownView source={this.props.test.description} />
        {!ok && err && <SyntaxHighlighter>{err}</SyntaxHighlighter>}
      </div>
    );
  }
}

export default UploadRunner;
