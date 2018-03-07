/**
 * Rendering and running tests
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Statistic, Icon, Message, Input} from 'semantic-ui-react';

class DynamicRunner extends React.Component {
  render() {
    return (
      <div className="full">
        <Message content={'dynamic'} />
        {this.props.test.description}
        <br />
        {this.props.test.jsondata}
        <br />
        {this.props.test.output}
      </div>
    );
  }
}

class NumericRunner extends React.Component {
  render() {
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        {this.props.test.jsondata}
        <br />
        {this.props.test.output}
        <br />
        <Statistic color="blue">
          <Statistic.Value>14</Statistic.Value>
          <Statistic.Label>measured</Statistic.Label>
        </Statistic>
        <Statistic color="green">
          <Statistic.Value>14</Statistic.Value>
          <Statistic.Label>expected</Statistic.Label>
        </Statistic>
      </div>
    );
  }
}

class MultipleRunner extends React.Component {
  render() {
    return (
      <div className="full">
        <Message content={'question'} />
        {this.props.test.description}
        <br />
        {this.props.test.jsondata}
      </div>
    );
  }
}

class QuestionRunner extends React.Component {
  render() {
    return (
      <div className="full">
        <Input placeholder="Answer here..." />
        {this.props.test.description}
        <br />
        {this.props.test.jsondata}
      </div>
    );
  }
}

class ManualRunner extends React.Component {
  render() {
    return (
      <div className="full">
        <Icon circular name="info" />
        {this.props.test.description}
      </div>
    );
  }
}

class TestRunner extends React.Component {
  static propTypes = {
    test: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    test: {},
    data: {},
  };

  render() {
    switch (this.props.test.form) {
      case 'dynamic':
        return <DynamicRunner {...this.props} />;
      case 'numeric':
        return <NumericRunner {...this.props} />;
      case 'multiple':
        return <MultipleRunner {...this.props} />;
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
