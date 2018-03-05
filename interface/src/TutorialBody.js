import React, {Component} from 'react';
import {Image, Icon, Container, Segment, Button} from 'semantic-ui-react';
import {Browser} from 'react-window-ui';
import $ from 'jquery'; // animations
import ReactMarkdown from 'react-markdown';
import {HotKeys} from 'react-hotkeys';
import * as ace from 'brace';
import {throttle} from 'lodash';
import Split from 'split.js';

//import ActionCable from 'actioncable'
//import TestGroup from './TestGroup.js'

import {GuideModal, SerialModal} from './ScrollingModal.js';
import AccordionStyled from './AccordionStyled.js';
import Test from './Test.js';
import Grid3 from './Grid3.js';
import Delay from './Delay.js';
import Code from './Code.js';
import API from './API.js';

/**
 * Rendering the Tutorial UI
 */

class TutorialBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: 'Initializing...',
      progress: {code: ''},
      compile: false,
      page_loading: true,
      step_loading: false,
      port_monitor: false,
      splash: false,
      tests: [],
      step: {},
    };
  }

  keyHandler = {
    next: () => {
      this.nextStep();
    },
    back: () => {
      this.prevStep();
    },
  };

  // Generate functions for modifying step

  patchStep = inc => {
    return throttle(() => {
      this.setState({step_loading: true});

      const api = this.state.api;
      const pid = this.state.progress.id;

      //const step_id = (prevState, props) => { return {step: prevState.step + inc } }
      let step_pos = Math.min(Math.max(this.state.step.position + inc, 0), 11);
      step_pos = this.handleStepError(step_pos);

      api
        .configure()
        .then(() => api.patchStep({pid, step_id: step_pos}))
        .catch(console.error) // TODO handle tutorial bounds
        .then(() => api.fetchStep(step_pos))
        .then(() => this.dataUpdate(api));
    }, 250);
  };

  patchProgressData = () => {
    return throttle((data, test) => {
      this.setState({step_loading: true});

      // MOCKING OUT ACTUALLY RUNNING THE TESTS
      let state;
      switch (data.state) {
        case 'test':
          state = 'fail';
          break;
        case 'fail':
          state = 'pass';
          break;
        case 'pass':
          state = 'fail';
          break;
        default:
          state = 'fail';
      }

      const id = data.id;
      const api = this.state.api;
      console.log(id, state);

      api
        .configure()
        .then(() => api.patchData({id, state}))
        .then(() => api.fetchData(this.state.progress.id, this.state.tests))
        .then(this.handleProgressDataUpdate)
        .then(() => this.setState({step_loading: false}));
    }, 250);
  };

  nextStep = this.patchStep(+1);
  prevStep = this.patchStep(-1);

  splash = () => this.setState({splash: true});
  deSplash = () => this.setState({splash: false});

  editorContainerIds = ['#code_editor', '#status_container'];
  editorNames = ['code', 'compile'];

  dataUpdate = api => {
    return api
      .configure()
      .then(() => api.fetchProgress(this.state.tutorial))
      .then(this.handleProgressUpdate)
      .then(() => api.fetchStep(this.state.progress.step_id)) // MRU step
      .then(this.handleStepUpdate)
      .then(() => api.fetchTest(this.state.step.id))
      .then(this.handleTestUpdate)
      .then(() => api.fetchData(this.state.progress.id, this.state.tests))
      .then(this.handleProgressDataUpdate)
      .then(() => this.setState({step_loading: false, page_loading: false}));
  };

  generatePaneSplit = (sizes = [90, 10]) => {
    const split = Split(this.editorContainerIds, {
      direction: 'vertical',
      gutterSize: 35,
      minSize: 50,
      sizes: sizes,
      onDrag: this.updateEditHeight,
    });

    this.split = split;
    this.updateEditHeight();
  };

  updatePaneSplit = () => {
    const split = this.split;
    const sizes = split.getSizes();
    split.destroy();
    this.split = undefined;
    this.generatePaneSplit(sizes);
  };

  updateEditHeight = () => {
    this.editorNames.map(editor => ace.edit(editor).resize());
  };

  componentWillMount() {
    const api = new API(this.props.api_auth); // from JWT
    const tutorial = this.props.tutorial.id;
    this.setState({api, tutorial});
    this.dataUpdate(api);
  }

  componentDidMount() {
    this.generatePaneSplit();
  }

  componentWillUpdate() {
    this.updatePaneSplit();
  }

  handleProgressUpdate = progress => {
    this.setState({progress});
  };

  handleStepUpdate = step => {
    this.setState({step});
  };

  handleStepError = step_pos => {
    console.log('step', step_pos);
    if (!step_pos) {
      console.warn('error: resetting step pos to 1');
      this.splash();
      return 1;
    } else {
      this.deSplash();
      return step_pos;
    }
  };

  handleTestUpdate = tests => {
    this.setState({tests});
  };

  handleProgressDataUpdate = pData => {
    this.setState({pData});
  };

  // For live updates, across sessions. Not needed right now
  // Const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
  // This.progSub = cable.subscriptions.create('ProgressesChannel', { received: this.handleReceiveProgress })
  // This.dataSub = cable.subscriptions.create('ProgressDataChannel', { received: this.handleReceiveProgressData })

  handleCodeChange = code => {
    // user changes code
    const api = this.state.api;
    Delay(() => {
      const newState = {progress: {...this.state.progress, code: code}};
      const update = () => this.setState(newState);
      const data = {code, pid: this.state.progress.id};
      console.info('saving code...');
      api.patchCode(data).then(update);
    }, 500);
  };

  // UI changes code - flash
  handleCodeUpdate = e => {
    var div = $('#status_container');
    div.animate({opacity: '1.0'}, 500);
  };

  handleServerCode = throttle((e, handler, msg) => {
    var div = $('#status_container');
    div.animate({opacity: '0.6'}, 500);

    e.preventDefault();
    console.info(msg);
    const code = this.state.progress.code;
    this.setState({compile_loading: msg});
    const finish = compile => this.setState({compile, compile_loading: false});
    handler(code)
      .then(finish)
      .then(this.handleCodeUpdate);
  }, 2000);

  handleCompile = e => {
    this.handleServerCode(e, this.state.api.postCompile, 'Compiling sketch...');
  };

  handleUpload = e => {
    this.handleServerCode(e, this.state.api.postUpload, 'Uploading code...');
  };

  handleMonitor = e => {
    this.setState({port_viewing: true});
  };

  handleDemonitor = e => {
    this.setState({port_viewing: false});
  };

  // Key mapping
  map = {
    next: ['right'],
    back: ['left'],
  };

  render() {
    const page_loading = this.state.page_loading;
    const step_loading = this.state.step_loading;

    let compile_value, compile_success;
    if (this.state.compile_loading) {
      compile_value = this.state.compile_loading;
    } else {
      const compile_finished = this.state.compile;
      compile_success = compile_finished && this.state.compile.code === 0;
      compile_value =
        (compile_success
          ? this.state.compile.output
          : this.state.compile.error) || '';
    }

    const step = this.state.step;
    const step_header = 'Step ' + step.position + ': ' + step.title;

    return (
      <Segment basic className="no-pad full" loading={page_loading}>
        <HotKeys className="full" handlers={this.keyHandler} keyMap={this.map}>
          <div className="full pad">
            <Grid3
              title={step_header}
              left={
                <div className="full">
                  <Image src={this.state.step.image} />
                  <Segment>
                    <ReactMarkdown source={this.state.step.description} />
                  </Segment>

                  <br />

                  <div className="tutorial-menu">
                    <Button.Group fluid widths="2">
                      <Button
                        labelPosition="left"
                        icon="left chevron"
                        content="Back"
                        onClick={this.prevStep}
                      />
                      <Button
                        className="pull-right"
                        labelPosition="right"
                        icon="right chevron"
                        content="Next"
                        onClick={this.nextStep}
                      />
                    </Button.Group>
                  </div>
                </div>
              }
              middle={
                <div id="arduino" className="arduino full">
                  <Browser id="browser">
                    <Button.Group widths="3">
                      <Button
                        as={'div'}
                        fluid
                        animated
                        className="fade"
                        icon
                        onClick={this.handleCompile}>
                        <Button.Content visible>
                          <Icon name="check" />
                        </Button.Content>
                        <Button.Content hidden>Verify</Button.Content>
                      </Button>
                      <Button
                        as={'div'}
                        fluid
                        animated
                        className="fade"
                        icon
                        onClick={this.handleUpload}>
                        <Button.Content hidden>Upload</Button.Content>
                        <Button.Content visible>
                          <Icon name="arrow right" />
                        </Button.Content>
                      </Button>
                      <Button
                        as={'div'}
                        icon
                        fluid
                        animated
                        className="fade"
                        onClick={this.handleMonitor}>
                        <Button.Content hidden>Monitor</Button.Content>
                        <Button.Content visible>
                          <Icon name="search" />
                        </Button.Content>
                      </Button>
                    </Button.Group>

                    <div className="full flex-container">
                      <div id="code_editor">
                        <Code
                          name="code"
                          mode={'c_cpp'}
                          readOnly={false}
                          showLines={true}
                          showGutter={true}
                          highlightActiveLine={true}
                          value={this.state.progress.code}
                          onChange={this.handleCodeChange}
                        />
                      </div>

                      <div id="status_container">
                        <Code
                          name={'compile'}
                          mode={'c_cpp'}
                          value={compile_value}
                          theme={compile_success ? 'gob' : 'terminal'}
                        />
                      </div>
                    </div>
                  </Browser>
                </div>
              }
              right={
                <Container>
                  <Segment basic loading={step_loading}>
                    {this.state.tests.length > 0 ? (
                      <AccordionStyled
                        handleClick={this.patchProgressData()}
                        tests={this.state.tests}
                        data={this.state.pData}
                      />
                    ) : (
                      <div>
                        <Test
                          head={'No checks.'}
                          task={'Continue once you are ready!'}
                          pass={'info'}
                        />
                        <Button
                          fluid
                          labelPosition="right"
                          icon="right chevron"
                          content="Next"
                          onClick={this.nextStep}
                        />
                      </div>
                    )}
                  </Segment>

                  <div className="tutorial-menu">
                    <Button.Group fluid widths="2">
                      <Button content="Show Guide" onClick={this.splash} />
                      <Button
                        content="Exit Tutorial"
                        onClick={this.props.unset}
                      />
                    </Button.Group>
                  </div>
                </Container>
              }
            />

            <SerialModal
              title={'Serial Port Monitor'}
              open={this.state.port_viewing}
              onClick={this.handleDemonitor}
            />

            <GuideModal
              open={this.state.splash}
              onClick={this.deSplash}
              title={'Tutorial System Guide'}
              tutorial={this.props.tutorial}
            />
          </div>
        </HotKeys>
      </Segment>
    );
  }
}

// mHead="Editor"
// idea - show overview of tests initially
// <Button content='Log Out' onClick={this.props.logout} />
//<Header content={step_header} />

export default TutorialBody;
