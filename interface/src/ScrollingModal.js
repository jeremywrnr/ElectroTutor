import React, { Component } from 'react'
import { Button, Header, Icon, Image, Modal } from 'semantic-ui-react'

class ModalScrollingContent extends Component {

  //size={'small'}

  render() {
    return (
      <Modal dimmer={'blurring'} {...this.props} >
        <Modal.Header>Tutorial System Guide</Modal.Header>

        <Modal.Content image scrolling>
          { this.props.image && // sidebar image
          <Image
            size="medium"
            src={this.props.image}
          />
          }

          {this.props.modalContent}
        </Modal.Content>

        <Modal.Actions>
          <Button primary onClick={this.props.onClick} >
            Continue <Icon name='right chevron' />
          </Button>
        </Modal.Actions>
      </Modal>
      )
}
}

class GuideScrollingModal extends Component {
  content = (
    <Modal.Description className='guide'>
      <Header>{this.props.tutorial.title}</Header>
      <p>{this.props.tutorial.description}</p>
      <Image size="medium" src={this.props.tutorial.image} />

      <Header>Interface Overview</Header>
      <Image src='/interface.png' />

      <Header>Moving Around</Header>
      <p>Click the back or next buttons to advance through the tutorial.</p>
      <Image src='/step-move.gif' />

      <p>You can also use the left and right arrow keys to move between steps.</p>
      <Image src='/left-right-gray.gif' />

      <Header>Verifying Code</Header>
      <p>Click the check mark in the microcontroller code editor to verify and compile your code.</p>
      <Image src='/verify.gif' />

      <Header>Uploading Code</Header>
      <p>Click the right arrow in the microcontroller code editor to compile and upload your code.</p>
      <Image src='/upload.gif' />
      <p>If the microcontroller is not plugged in, this command will fail. Plug it in first!</p>

      <Header>Running Checks</Header>
      <p>TODO</p>

      <br/>
    </Modal.Description>
    )

    render = () => <ModalScrollingContent {...this.props} modalContent={this.content} />
}

export { ModalScrollingContent, GuideScrollingModal }