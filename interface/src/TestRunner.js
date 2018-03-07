/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Message} from 'semantic-ui-react';

class DynamicRunner extends React.Component {
  render() {
    return (
      <div className="full">
        <Message content={'dynamic'} />;
        {this.props.test.description}
        <br />
        {this.props.test.jsondata}
      </div>
    );
  }
}

class NumericRunner extends React.Component {
  render() {
    return <Message content={'numeric'} />;
  }
}

class QuestionRunner extends React.Component {
  render() {
    return <Message content={'question'} />;
  }
}

class ManualRunner extends React.Component {
  render() {
    return <Message content={'manual'} />;
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
    switch (this.props.test.form) {
      case 'dynamic':
        return <DynamicRunner {...this.props} />;
      case 'numeric':
        return <NumericRunner {...this.props} />;
      case 'question':
        return <QuestionRunner {...this.props} />;
      case 'manual':
        return <ManualRunner {...this.props} />;
      default:
        return <Message error content={`unknown: ${this.props.test}`} />;
    }
  }
}

export default TestRunner;
