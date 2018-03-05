import React, {Component} from 'react';
import {Button, Header, Icon, Image, Modal} from 'semantic-ui-react';
import Dygraph from 'dygraphs';

class ModalScrollingContent extends Component {
  //size={'small'}

  render() {
    return (
      <Modal dimmer={'blurring'} {...this.props}>
        <Modal.Header>{this.props.title}</Modal.Header>

        <Modal.Content image scrolling>
          {this.props.image && <Image size="medium" src={this.props.image} />}
          {this.props.modalContent}
        </Modal.Content>

        <Modal.Actions>
          <Button primary onClick={this.props.onClick}>
            Continue <Icon name="right chevron" />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

class SerialModal extends Component {
  constructor(props) {
    super(props);
    this.data = [];
  }

  componentWillMount() {
    var t = new Date();
    let data = [];
    for (var i = 50; i >= 0; i--) {
      var x = new Date(t.getTime() - i * 1000);
      data.push([x, Math.random()]);
    }

    this.setState({data});
  }

  componentDidMount() {
    const data = this.state.data;
    var g = new Dygraph(document.getElementById('div_g'), data, {
      drawPoints: true,
      showRoller: true,
      valueRange: [0.0, 1.2],
      labels: ['Time', 'Random'],
    });

    // It sucks that these things aren't objects, and we need to store state in window.
    return;

    window.intervalId = setInterval(function() {
      var x = new Date(); // current time
      var y = Math.random();
      data.push([x, y]);
      g.updateOptions({file: data});
    }, 1000);
  }

  componentWillUnmount() {}

  content = (
    <div className="full">
      <Button primary onClick={this.props.onClick}>
        Continue <Icon name="right chevron" />
      </Button>
      <div id="div_g" className="full">
        graph
      </div>
    </div>
  );

  render = () => (
    <ModalScrollingContent {...this.props} modalContent={this.content} />
  );
}

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
