/**
 * Continue onto the next step
 */

import React from 'react';
import Test from './Test.js';
import {Button} from 'semantic-ui-react';

class Continue extends React.Component {
  static defaultProps = {
    head: 'Tests Passed',
    task: 'Continue once you are ready!',
    pass: 'check',
  };

  render() {
    const next = this.props.nextStep;
    return (
      <div>
        <Test {...this.props} />
        <Button
          fluid
          labelPosition="right"
          icon="right chevron"
          content="Next"
          onClick={next}
        />
      </div>
    );
  }
}

export default Continue;
