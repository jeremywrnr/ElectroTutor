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
    color: undefined,
    pass: 'check',
  };

  render() {
    const next = this.props.next;
    return (
      <div>
        <Test {...this.props} />
        <Button
          {...this.props}
          attached="bottom"
          content="Next"
          onClick={next}
        />
      </div>
    );
  }
}

export default Continue;
