/**
 * Rendering and running tests
 */

import React, {Component} from 'react';
import {Statistic, Container} from 'semantic-ui-react';

class StatCouple extends Component {
  render() {
    const {unit, input, out} = this.props;
    return (
      <Container textAlign="center">
        <DynamicStat
          unit={unit}
          color="grey"
          value={input}
          label={'measured'}
        />
        <DynamicStat unit={unit} color="green" value={out} label={'expected'} />
      </Container>
    );
  }
}

class DynamicStat extends Component {
  render() {
    const {value, color, unit, label} = this.props;
    return (
      <Statistic color={color}>
        <Statistic.Value>
          {value}
          <small>{unit}</small>
        </Statistic.Value>
        <Statistic.Label>{label}</Statistic.Label>
      </Statistic>
    );
  }
}

export {StatCouple, DynamicStat};
