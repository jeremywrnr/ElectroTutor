/*eslint eqeqeq:0*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withSerial } from "./Serial.js";
import API from "./API.js";
import {
  Form,
  Checkbox,
  Statistic,
  Container,
  Segment,
  Message,
  Input,
  Button,
  Icon
} from "semantic-ui-react";

class CodeRunner extends React.Component {
  verify = () => {
    console.log("verifying code snippet...");
    //const output = this.props.test.output;
    //const value = this.state.value;
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
    this.API = API;
  };

  render() {
    return (
      <div className="full">
        <Message content={"code snippet test yet to be implemented"} />
        {this.props.test.description}
        <br />
        jsondata: {this.props.test.jsondata}
        <br />
        output: {this.props.test.output}
      </div>
    );
  }
}

class CompileRunner extends React.Component {
  verify = () => {
    console.log("verifying compile...");
    //const output = this.props.test.output;
    //const value = this.state.value;
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    return (
      <div className="full">
        <Message content={"compile test yet to be implemented"} />
        {this.props.test.description}
        <br />
        jsondata: {this.props.test.jsondata}
        <br />
        output: {this.props.test.output}
      </div>
    );
  }
}

class UploadRunner extends React.Component {
  verify = () => {
    console.log("verifying upload...");
    //const output = this.props.test.output;
    //const value = this.state.value;
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    return (
      <div className="full">
        <Message content={"upload test yet to be implemented"} />
        {this.props.test.description}
        <br />
        jsondata: {this.props.test.jsondata}
        <br />
        output: {this.props.test.output}
      </div>
    );
  }
}

class DynamicRunner extends React.Component {
  verify = () => {
    console.log("verifying dynamic...");
    //const output = this.props.test.output;
    //const value = this.state.value;
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    return (
      <div className="full">
        <Message content={"dynamic test yet to be implemented"} />
        {this.props.test.description}
        <br />
        jsondata: {this.props.test.jsondata}
        <br />
        output: {this.props.test.output}
      </div>
    );
  }
}

class NumericRunnerShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measuring: false,
      interval: undefined,
      value: "-"
    };
  }

  static defaultProps = {
    data: [],
    log: []
  };

  // Potentially add in a test option here to have it be exact
  // Also figure out how to best deal with serial ports.

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  // Compute running average of last n frames to help with noise.
  // TODO pass in a desired error margin from the test itself

  verify = () => {
    this.props.openPort();
    const err = 0.03; // three percent
    console.log("verify numeric runner...");
    const interval = setInterval(() => {
      const d = this.props.data;
      let sum = 0;
      d.map(x => (sum += x.V));
      const value = d.length > 0 ? sum / d.length : "-";
      const out = Number(this.props.test.output);
      const pass = (1 - err) * out < value && value < (1 + err) * out;
      const prev = this.props.pdata.state === "pass";
      console.log(d, value, pass);
      this.setState({ value });
      if (pass !== prev) {
        this.props.patch(pass);
        if (pass) {
          clearInterval(interval);
          this.setState({ measuring: false });
        }
      }
    }, 100);
    this.setState({ interval, measuring: true });
  };

  render() {
    const val = this.state.value;
    const out = Number(this.props.test.output);
    const input = val === "-" ? val : +val.toFixed(2);
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
            <Statistic.Value>{out}</Statistic.Value>
            <Statistic.Label>expected</Statistic.Label>
          </Statistic>
        </Container>
        {this.state.measuring && (
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Measuring...</Message.Header>
              Analyzing probe values...
            </Message.Content>
          </Message>
        )}
      </div>
    );
  }
}
const NumericRunner = withSerial(NumericRunnerShell, 30); // max samples

class MultipleRunner extends Component {
  verify = () => {
    console.log("verify multiples...");
    const output = this.props.test.output;
    const value = this.state.value;
    this.props.patch(output == value);
  };

  state = {};
  handleChange = (e, { value }) => this.setState({ value });

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

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
class MultipleRunnerField extends Component {
  render() {
    return (
      <Form.Field className="full">
        <Checkbox {...this.props} radio name="checkboxRadioGroup" />
      </Form.Field>
    );
  }
}

// TODO cache the users last output to save their answers.

class QuestionRunner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  // Always set to true. (or toggle?)
  verify = () => {
    console.log("verifying question runner...");
    const output = this.props.test.output;
    const value = this.state.value;
    this.props.patch(value === output);
  };

  render() {
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <br />
        <Input
          fluid
          value={this.state.inputValue}
          onChange={this.handleChange}
          placeholder="Answer here..."
        />
      </div>
    );
  }
}

class ManualRunner extends Component {
  // Always set to true. (or toggle?)
  verify = () => {
    console.log("verifying manual runner...");
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    return <div className="full">{this.props.test.description}</div>;
  }
}

class TestRunner extends React.Component {
  state = {};

  static propTypes = {
    pdata: PropTypes.object.isRequired,
    test: PropTypes.object.isRequired
  };

  static defaultProps = {
    pdata: {},
    test: {}
  };

  generateTestRunner = tProps => {
    if (tProps.button) {
      switch (tProps.test.form) {
        case "code":
          return <CodeRunner {...tProps} />;
        case "compile":
          return <CompileRunner {...tProps} />;
        case "upload":
          return <UploadRunner {...tProps} />;
        case "dynamic":
          return <DynamicRunner {...tProps} />;
        case "numeric":
          return <NumericRunner {...tProps} />;
        case "multiple":
          return <MultipleRunner {...tProps} />;
        case "question":
          return <QuestionRunner {...tProps} />;
        case "manual":
          return <ManualRunner {...tProps} />;
        case "info":
          return <Message error content={`info is not accepted`} />;
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
    const tProps = { button, ...this.props };
    const render = tProps && !tProps.test.info;
    return (
      <div className="full">
        <Segment attached basic color={tProps.color}>
          {this.generateTestRunner(tProps)}
        </Segment>
        {render && (
          <Button
            basic
            attached="bottom"
            content={tProps.rtext}
            ref={button => !this.state.button && this.setState({ button })}
          />
        )}
      </div>
    );
  }
}

export default TestRunner;
