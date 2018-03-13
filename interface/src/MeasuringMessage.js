/**
 * Rendering test measuring icon
 */

import React from 'react';
import {Message, Icon} from 'semantic-ui-react';

class MeasuringMessage extends React.Component {
  static defaultProps = {
    head: 'Measuring...',
    text: 'Analyzing probe values...',
  };

  render() {
    return (
      <Message icon>
        <Icon name="circle notched" loading />
        <Message.Content>
          <Message.Header>{this.props.head}</Message.Header>
          {this.props.text}
        </Message.Content>
      </Message>
    );
  }
}

export default MeasuringMessage;
