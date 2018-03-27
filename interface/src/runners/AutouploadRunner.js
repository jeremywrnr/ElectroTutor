import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MeasuringMessage from '../MeasuringMessage.js';

// Autoupload code testing

class AutouploadRunner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      compile: {},
    };
  }

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  verify = () => {
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
    const ok = this.props.compile.code === 0;
    const err = this.props.compile.error;

    return (
      <div className="full">
        {this.props.test.description}
        <br />
        {this.state.loading && (
          <MeasuringMessage
            head="Uploading test code..."
            text="Uploading preset code to hardware for testing."
          />
        )}
        {!ok && err && <SyntaxHighlighter>{err}</SyntaxHighlighter>}
        {ok && <span> ok </span>}
      </div>
    );
  }
}

export default AutouploadRunner;
