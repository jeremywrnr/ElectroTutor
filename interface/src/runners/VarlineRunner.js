import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

//
// Varline Analysis
//

class VarlineRunner extends Component {
  verify = () => {
    const code = this.props.selected;
    const data = this.props.test.jsondata;
    const pass = data !== undefined;
    this.props.patch(pass);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    const sel = this.props.selected;
    return (
      <div className="full">
        {this.props.test.description}
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

export default VarlineRunner;
