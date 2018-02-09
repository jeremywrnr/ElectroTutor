import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react'

class ButtonGroup extends Component {
  static propTypes = {
    onLClick: PropTypes.func.isRequired,
    onMClick: PropTypes.func.isRequired,
    onRClick: PropTypes.func.isRequired,
  };

  render () {
    return (
      <Button.Group widths='3'>
        <Button labelPosition='left' icon='left chevron' content='Back' onClick={this.props.onLClick} />
        <Button animated className="fade" secondary icon onClick={this.props.onMClick} >
          <Button.Content visible>Compile</Button.Content>
          <Button.Content hidden>
            <Icon name='play' />
          </Button.Content>
        </Button>
        <Button labelPosition='right' icon='right chevron' content='Forward' onClick={this.props.onRClick} />
      </Button.Group>
      )
}
}

export default ButtonGroup
