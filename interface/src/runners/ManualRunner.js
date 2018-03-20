import React, {Component} from 'react';

// Always set to true. (or toggle?)

class ManualRunner extends Component {
  verify = () => {
    console.log('verifying manual runner...');
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    return <div className="full">{this.props.test.description}</div>;
  }
}

export default ManualRunner;
