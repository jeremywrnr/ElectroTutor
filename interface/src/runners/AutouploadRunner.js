import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MeasuringMessage from '../MeasuringMessage.js';
import MarkdownView from '../MarkdownView.js';
import {Message, Button} from 'semantic-ui-react';

// Autoupload code testing

class AutouploadRunner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      compile: {},
    };
  }

  pass = () => {
    this.props.patch(true);
  };

  fail = () => {
    this.props.patch(false);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  verify = () => {
    console.log('verifying autocode...');
    this.setState({loading: true});
    this.props.handleTestMode('autoupload');
    const data = JSON.parse(this.props.test.jsondata);
    const file = data.file;
    this.props.api
      .postAutoCode(file)
      .then(compile => this.setState({compile}))
      .then(() => this.setState({loading: false}));
  };

  render() {
    const load = this.state.loading;
    const ok = this.state.compile.code === 0;
    const err = this.state.compile.error;
    const fail = this.props.pdata.state === 'fail';
    const help = this.props.test.onerror;
    const show = fail && help;

    return (
      <div className="full">
        {load && (
          <MeasuringMessage
            head="Uploading hardware test code..."
            text="Uploading preset code to hardware for testing."
          />
        )}

        {show && <Message info content={help} />}

        <MarkdownView source={this.props.test.description} />

        {ok && (
          <div class="full">
            {!show && <br />}
            <Button.Group widths="2">
              <Button as="a" basic onClick={this.fail} color="red">
                No
              </Button>
              <Button as="a" basic onClick={this.pass} color="green">
                Yes
              </Button>
            </Button.Group>
          </div>
        )}

        {!ok && err && <SyntaxHighlighter>{err}</SyntaxHighlighter>}
      </div>
    );
  }
}

export default AutouploadRunner;
