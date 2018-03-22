import React, {Component} from 'react';
import {Icon, Label} from 'semantic-ui-react';

//
// Varline Analysis
//

class VarlineRunner extends Component {
  verify = () => {
    const data = this.props.test.jsondata;
    const pass = data !== undefined;
    this.props.patch(pass);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    const idt = this.props.idents;
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <br />
        {idt.map(x => <VarLabel name={x} />)}
      </div>
    );
  }
}

class VarLabel extends Component {
  render() {
    return (
      <Label as="a" size="large">
        <Icon color="red" name="hide" /> {this.props.name}
      </Label>
    );
  }
}

export default VarlineRunner;
