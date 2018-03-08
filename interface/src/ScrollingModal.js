import React, {Component} from 'react';
import {Button, Header, Icon, Image, Modal} from 'semantic-ui-react';
import {SerialMonitor} from './Serial.js';

// GENERAL SCROLLING MODAL

class ModalScrollingContent extends Component {
  render() {
    const close = this.props.onClick;
    const modProps = Object.assign({}, this.props);
    delete modProps.onClick;

    return (
      <Modal dimmer={'blurring'} {...modProps}>
        <Modal.Header>{this.props.title}</Modal.Header>

        <Modal.Content image scrolling>
          {this.props.image && <Image size="medium" src={this.props.image} />}
          {this.props.modalcontent}
        </Modal.Content>

        <Modal.Actions>
          <Button onClick={close}>
            Continue <Icon name="right chevron" />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

// SERIAL MODAL

class SerialModal extends Component {
  content = <SerialMonitor />;

  render = () => (
    <ModalScrollingContent {...this.props} modalcontent={this.content} />
  );
}

// USER GUIDE MODAL

class GuideModal extends Component {
  content = (
    <Modal.Description className="guide">
      <Header>{this.props.tutorial.title}</Header>
      <p>{this.props.tutorial.description}</p>
      <Image size="medium" src={this.props.tutorial.image} />

      <Header>Interface Overview</Header>
      <Image src="/interface.png" />

      <Header>Moving Around</Header>
      <p>Click the back or next buttons to advance through the tutorial.</p>
      <Image src="/step-move.gif" />

      <p>
        You can also use the left and right arrow keys to move between steps.
      </p>
      <Image src="/left-right-gray.gif" />

      <Header>Verifying Code</Header>
      <p>
        Click the check mark in the microcontroller code editor to verify and
        compile your code.
      </p>
      <Image src="/verify.gif" />

      <Header>Uploading Code</Header>
      <p>
        Click the right arrow in the microcontroller code editor to compile and
        upload your code.
      </p>
      <p>
        If the microcontroller is not plugged in, this command will fail. Plug
        it in first!
      </p>
      <Image src="/upload.gif" />

      <Header>Running Checks</Header>
      <p>TODO</p>

      <br />
    </Modal.Description>
  );

  render = () => (
    <ModalScrollingContent {...this.props} modalcontent={this.content} />
  );
}

export {ModalScrollingContent, GuideModal, SerialModal};
