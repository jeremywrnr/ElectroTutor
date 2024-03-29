/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Message} from 'semantic-ui-react';

class Test extends React.Component {
  static propTypes = {
    task: PropTypes.string,
    head: PropTypes.string,
  };

  static defaultProps = {
    pass: undefined,
    head: 'Quick Check',
    task: '',
  };

  //className={ pass ? 'success' : 'info' }

  handlePassIcon = {
    pass: 'check',
    fail: 'info',
    info: false,
  };

  render() {
    let pass = this.props.pass;
    return (
      <Message
        attached
        header={this.props.head}
        icon={this.handlePassIcon[pass]}
        content={this.props.task}
      />
    );
  }
}

export default Test;
