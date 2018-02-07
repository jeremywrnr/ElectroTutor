/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react'

class Test extends React.Component {
  static propTypes = {
    task: PropTypes.string.isRequired,
  };

  static defaultProps = {
    task: '...',
    pass: false,
  };

  //className={ pass ? 'success' : 'info' }
  //icon={ pass ? 'check' : 'info' }

  render() {
    let pass = this.props.pass
    return (
      <Message
        header={'Step ' + this.props.key }
        content={pass + this.props.task}
      />
      );
};
}

export default Test
