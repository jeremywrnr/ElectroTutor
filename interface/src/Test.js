/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react'

class Test extends React.Component {
  static propTypes = {
    task: PropTypes.string.isRequired,
  };

  static defaultProps = {
    task: '...',
    pass: false,
  };

  render() {
    let pass = this.props.pass
    return (
      <Message
        className={ pass ? 'success' : 'info' }
        icon={ pass ? 'check' : 'info' }
        header={'Step ' + this.state.key }
        content={this.state.task}
      />
      );
};
}

export default Test
