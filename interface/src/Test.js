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
      return 'announcement'
    else
      return 'bug'
  }

  render() {
    let pass = this.props.pass
    return (
      <Message
        header={'Step ' + this.props.i }
        icon={ this.handlePassIcon(pass) }
        content={this.props.task}
      />
      ) };
}

export default Test
