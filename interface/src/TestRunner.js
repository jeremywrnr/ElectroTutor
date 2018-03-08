/**
 * Rendering and running tests
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withSerial} from './Serial.js';
import {Button, Segment} from 'semantic-ui-react';
import {
  Form,
  Checkbox,
  Statistic,
  Container,
  Message,
  Input,
} from 'semantic-ui-react';

class DynamicRunner extends React.Component {
  verify = () => {};

  componentDidMount = () => (this.props.button.onClick = this.verify);

  render() {
    return (
      <div className="full">
        <Segment attached basic color={this.props.color}>
          <Message content={'dynamic test yet to be implemented'} />
          {this.props.test.description}
          <br />
          jsondata: {this.props.test.jsondata}
          <br />
          output: {this.props.test.output}
        </Segment>
      </div>
    );
  }
}

class NumericRunnerShell extends Component {
  verify = () => {
    console.log('verify');
    return true;
  };

  // VERY hacky way to bind arbitary button to element specific event handler.
  // this should only be in the running once, like in component will mount

  componentWillMount = () => {
    if (this.props.button) {
      const button = this.props.button;
      button.handleClick = this.verify;
    }
  };

  // Compute running average of last n frames to help with noise.
  generateAverage = () => {
    return '-';
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

const NumericRunner = withSerial(NumericRunnerShell, 30);

class MultipleRunnerField extends Component {
  verify = () => {};

  render() {
    return (
      <div className="full">
        <Segment attached basic color={this.props.color}>
          <Form.Field>
            <Checkbox {...this.props} radio name="checkboxRadioGroup" />
          </Form.Field>
        </Segment>
        {!this.props.test.info && (
          <Button basic attached="bottom" content={this.props.rtext} />
        )}
      </div>
    );
  }
}
class MultipleRunner extends Component {
  verify = () => {};

  state = {};
  handleChange = (e, {value}) => this.setState({value});

  render() {
    const opts = JSON.parse(this.props.test.jsondata);

    return (
      <div className="full">
        <Segment attached basic color={this.props.color}>
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
        </Segment>
      </div>
    );
  }
}

class QuestionRunner extends Component {
  verify = () => {};

  render() {
    return (
      <div className="full">
        <Segment attached basic color={this.props.color}>
          {this.props.test.description}
          <br />
          <br />
          <Input fluid placeholder="Answer here..." />
        </Segment>
        {!this.props.test.info && (
          <Button basic attached="bottom" content={this.props.rtext} />
        )}
      </div>
    );
  }
}

class ManualRunner extends Component {
  verify = () => {};

  render() {
    return (
      <div className="full">
        <Segment attached basic color={this.props.color}>
          {this.props.test.description}
        </Segment>
        {!this.props.test.info && (
          <Button basic attached="bottom" content={this.props.rtext} />
        )}
      </div>
    );
  }
}

class TestRunner extends React.Component {
  state = {};

  static propTypes = {
    test: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    test: {},
    data: {},
  };

  generateTestRunner = tProps => {
    if (tProps.button) {
      switch (tProps.test.form) {
        case 'dynamic':
          return <DynamicRunner {...tProps} />;
        case 'numeric':
          return <NumericRunner {...tProps} />;
        case 'multiple':
          return <MultipleRunner {...tProps} />;
        case 'question':
          return <QuestionRunner {...tProps} />;
        case 'manual':
          return <ManualRunner {...tProps} />;
        case 'info':
          return (
            <Message error content={`info is not an accepted test type`} />
          );
        default:
          return <Message error content={`unknown: ${tProps.test.form}`} />;
      }
    } else {
      return <Segment basic loading={true} content="Loading..." />;
    }
  };

  // hacky way to get reference to sibling element and pass in as a prop
  // https://stackoverflow.com/questions/38864033

  render() {
    const button = this.state.button;
    const tProps = {button, ...this.props};
    return (
      <div className="full">
        <Segment attached basic color={tProps.color}>
          {this.generateTestRunner(tProps)}
        </Segment>
        {!tProps.test.info && (
          <Button
            basic
            attached="bottom"
            content={tProps.rtext}
            ref={button => !this.state.button && this.setState({button})}
          />
        )}
      </div>
    );
  }
}

export default TestRunner;
