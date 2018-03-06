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
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    type: undefined,
  };

  render() {
    return <Message content={this.props.type} />;
  }
}

export default TestRunner;
