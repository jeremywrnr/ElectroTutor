import React, {Component} from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';

export default class ConfigModal extends Component {
  state = {modalOpen: false};

  static defaultProps = {
    onClickYes: function() {},
    onClickNo: function() {},
  };

  handleOpen = () => this.setState({modalOpen: true});
  handleClose = () => this.setState({modalOpen: false});

  onClickNo = () => {
    this.props.onClickNo();
    this.handleClose();
  };

  onClickYes = () => {
    this.props.onClickYes();
    this.handleClose();
  };

  render() {
    const trigger = <Button onClick={this.handleOpen}>Settings</Button>;
    return (
      <Modal
        trigger={trigger}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="small"
        basic>
        <Header icon="setting" content="Settings" />
        <Modal.Content>
          <p>Disable or enable the tutorial tests.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.onClickNo} color="red" inverted>
            <Icon name="remove" /> Disable Tests
          </Button>
          <Button onClick={this.onClickYes} color="green" inverted>
            <Icon name="checkmark" /> Enable Tests
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
