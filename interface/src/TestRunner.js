/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Message} from 'semantic-ui-react';

class NumericRunner extends React.Component {
  render() {
    return <Message content={'hello'} />;
  }
}

class TestRunner extends React.Component {
  static propTypes = {
    type: PropTypes.string,
  };

  static defaultProps = {
    type: undefined,
  };

  render() {
    let pass = this.props.pass;
    return (
      <Message
        header={this.props.head}
        icon={this.handlePassIcon[pass]}
        success={pass === 'pass'}
        error={pass === 'fail'}
        content={this.props.task}
      />
    );
  }
}

export default TestRunner;
