/*eslint array-callback-return:0 eqeqeq:0*/

import React, {Component} from 'react';
import {Form, Checkbox} from 'semantic-ui-react';

// External info testing
// Multiple choice example

class MultipleRunner extends Component {
  verify = () => {
    console.log('verify multiples...');
    const output = this.props.test.output;
    const value = this.state.value;
    this.props.patch(output == value);
  };

  state = {};
  handleChange = (e, {value}) => this.setState({value});

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

export default MultipleRunner;
