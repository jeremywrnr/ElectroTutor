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
    pass: undefined,
    task: '...',
  };

  //className={ pass ? 'success' : 'info' }

  handlePassIcon(p) {
    if (p === 'pass')
      return 'check'
    else if (p === 'fail')
      return 'info'
    else if (p === 'info')
      return false
    else
      return 'bug'
  }

  render() {
    let pass = this.props.pass
    return (
      <Message
        header={'Task ' + this.props.i }
        icon={ this.handlePassIcon(pass) }
        success={ pass === 'pass' }
        error={ pass === 'fail' }
        content={this.props.task}
      />
      ) };
}

export default Test
