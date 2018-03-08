/**
 * Rendering and running tests
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Checkbox} from 'semantic-ui-react';
import {Statistic, Container, Message, Input} from 'semantic-ui-react';

class DynamicRunner extends React.Component {
  render() {
    return (
      <div className="full">
        <Message content={'dynamic test yet to be implemented'} />
        {this.props.test.description}
        <br />
        jsondata: {this.props.test.jsondata}
        <br />
        output: {this.props.test.output}
      </div>
    );
  }
}

class NumericRunner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  static maxSamples = 30;

  serialMonitor = () => {
    // Open up the serial port.
    // Read data from it.
    // Close on unmount.
  };

  generateAverage = () => {
    // Compute running average of last n frames to help with noise.
    return 1;
  };

  componentDidMount = () => {
    return 1;
  };

  render() {
    const input = this.generateAverage();
    const output = this.props.test.output;

    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <br />
        <Container textAlign="center">
          <Statistic color="grey">
            <Statistic.Value>{input}</Statistic.Value>
            <Statistic.Label>measured</Statistic.Label>
          </Statistic>
          <Statistic color="green">
            <Statistic.Value>{output}</Statistic.Value>
            <Statistic.Label>expected</Statistic.Label>
          </Statistic>
        </Container>
      </div>
    );
  }
}

class MultipleRunnerField extends Component {
  render() {
    return (
      <Form.Field>
        <Checkbox {...this.props} radio name="checkboxRadioGroup" />
      </Form.Field>
    );
  }
}
class MultipleRunner extends Component {
  state = {};
  handleChange = (e, {value}) => this.setState({value});

  render() {
    const opts = JSON.parse(this.props.test.jsondata);

    return (
      <Form className="full">
        <Form.Field>{this.props.test.description}</Form.Field>
        {opts.map((opt, i) => {
          return (
            <MultipleRunnerField
              onChange={this.handleChange}
              checked={this.state.value === i}
              key={`key-${i}-${opt}`}
              label={opt}
              value={i}
            />
          );
        })}
      </Form>
    );
  }
}

class QuestionRunner extends Component {
  render() {
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <br />
        <Input fluid placeholder="Answer here..." />
      </div>
    );
  }
}

class ManualRunner extends Component {
  render() {
    return <div className="full">{this.props.test.description}</div>;
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
      case 'info':
        return <Message error content={`info is not an accepted test types`} />;
      default:
        return <Message error content={`unknown: ${this.props.test.form}`} />;
    }
  }
}

export default TestRunner;
