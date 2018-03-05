import React, {Component} from 'react';
import {Button, Header, Icon, Image, Modal} from 'semantic-ui-react';
import {LineChart, Line} from 'recharts';
import SerialMonitor from './Serial.js';

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
          {this.props.modalContent}
        </Modal.Content>

        <Modal.Actions>
          <Button primary onClick={close}>
            Continue <Icon name="right chevron" />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

// SERIAL MODAL

class SerialModal extends Component {
  constructor(props) {
    super(props);
    this.data = [];
  }

  data = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
  ];

  content = (
    <div className="full">
      <LineChart width={400} height={400} data={this.data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
      <SerialMonitor />
    </div>
  );

  render = () => (
    <ModalScrollingContent {...this.props} modalContent={this.content} />
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
    <ModalScrollingContent {...this.props} modalContent={this.content} />
  );
}

export {ModalScrollingContent, GuideModal, SerialModal};
