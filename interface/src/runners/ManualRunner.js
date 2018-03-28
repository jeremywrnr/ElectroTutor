import React, {Component} from 'react';
import {Message, Button} from 'semantic-ui-react';
import MarkdownView from '../MarkdownView.js';

// Show on-error message when the user notes a failure

class ManualRunner extends Component {
  pass = () => {
    console.log('verifying manual runner...');
    this.props.patch(true);
  };

  fail = () => {
    this.props.patch(false);
  };

  render() {
    const fail = this.props.pdata.state === 'fail';
    const help = this.props.test.onerror;
    const show = fail && help;
    return (
      <div className="full">
        <MarkdownView source={this.props.test.description} />
        {show ? <Message info content={help} /> : <br />}
        <Button.Group widths="2">
          <Button as="a" basic onClick={this.fail} color="red">
            No
          </Button>
          <Button as="a" basic onClick={this.pass} color="green">
            Yes
          </Button>
        </Button.Group>
      </div>
    );
  }
}

export default ManualRunner;
