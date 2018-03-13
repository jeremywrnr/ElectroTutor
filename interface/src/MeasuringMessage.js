/**
 * Rendering test measuring icon
 */

import React from 'react';
import {Message, Icon} from 'semantic-ui-react';

class MeasuringMessage extends React.Component {
  render() {
    return (
      <Message icon>
        <Icon name="circle notched" loading />
        <Message.Content>
          <Message.Header>Measuring...</Message.Header>
          Analyzing probe values...
        </Message.Content>
      </Message>
    );
  }
}

export default MeasuringMessage;
