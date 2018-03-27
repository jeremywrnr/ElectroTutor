import React, {Component} from 'react';
import {Message, Segment, Button} from 'semantic-ui-react';

// Show on-error message when the user notes a failure

class ManualRunner extends Component {
  state = {};

  pass = () => {
    console.log('verifying manual runner...');
    this.props.patch(true);
  };

  fail = () => {
    this.props.patch(false);
  };

  render() {
    const pass = this.props.pdata.state === 'pass';
    const help = this.props.test.onerror;

    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <br />
        {!pass && help && <Message info content={help} />}
        <Button.Group widths="2">
          <Button as="a" inverted onClick={this.fail} color="red">
            Error
          </Button>
          <Button as="a" inverted onClick={this.pass} color="green">
            Success
          </Button>
        </Button.Group>
      </div>
    );
  }
}

export default ManualRunner;
