import React, {Component} from 'react';
import {Image, Container, Segment, Button} from 'semantic-ui-react';
import $ from 'jquery'; // animations
import ReactMarkdown from 'react-markdown';
import {HotKeys} from 'react-hotkeys';
import * as ace from 'brace';
import {throttle} from 'lodash';
import Split from 'split.js';

import {GuideModal, SerialModal} from './ScrollingModal.js';
import AccordionStyled from './AccordionStyled.js';
import ArduinoWindow from './Arduino.js';
import Continue from './Continue.js';
import Grid3 from './Grid3.js';
import Delay from './Delay.js';
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
      compile: false, // hydrated after compile/error
      tests_passed: false,
      page_loading: true,
      step_loading: false,
      port_monitor: false,
      splash: false,
      pData: [],
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
      if (!this.state.tests_passed && inc > 0) {
        // TODO block going forward if the step is not completed
        // BONUS TODO: tell the user that they must complete test
        //this.nextStep();
      } else {
        this.setState({step_loading: true});

        const api = this.state.api;
        const pid = this.state.progress.id;

        //const step_id = (prevState, props) => { return {step: prevState.step + inc } }
        let step_pos = Math.min(
          Math.max(this.state.step.position + inc, 0),
          11,
        );
        step_pos = this.handleStepError(step_pos);

        // TODO handle tutorial bounds
        // TODO use actual id vs position

        api
          .configure()
          .then(() => api.patchStep({pid, step_id: step_pos}))
          .catch(console.error)
          .then(() => api.fetchStep(step_pos))
          .then(() => this.dataUpdate(api));
      }
    }, 250);
  };

  patchProgressData = () => {
    return throttle((data, state) => {
      this.setState({step_loading: true});
      const id = data.id;
      const api = this.state.api;
      console.log(data, state);

      api
        .configure()
        .then(() => api.patchData({id, state}))
        .then(() => api.fetchData(this.state.progress.id, this.state.tests))
        .then(this.handleProgressDataUpdate)
        .then(this.updateStepProgress)
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
      .then(this.updateStepProgress)
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

  updateStepProgress = () => {
    const pData = this.state.pData;
    const tests = this.state.tests;
    const has_tests = pData.length > 0;
    const pass_all = pData
      .filter(p => {
        const test = tests.find(t => t.id === p.test_id);
        return !!test.form && !test.info; // test exists
      })
      .every(p => p.state === 'pass');
    const tests_passed = pass_all || !has_tests;
    this.setState({tests_passed});
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

  //
  // COMPONENT LIFE CYCLE
  //

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

  //
  // STATE UPDATE HANDLERS
  //

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

  handleCodeUpdate = e => {
    // UI changes code - flash
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

  //
  // KEY MAPPING
  //

  map = {
    next: ['right'],
    back: ['left'],
  };

  render() {
    const step = this.state.step;
    const step_header = 'Step ' + step.position + ': ' + step.title;
    const page_loading = this.state.page_loading;
    const step_loading = this.state.step_loading;
    const p = this.state.tests_passed;

    return (
      <Segment basic className="no-pad full" loading={page_loading}>
        <HotKeys className="full" handlers={this.keyHandler} keyMap={this.map}>
          <div className="full pad">
            <Grid3
              title={step_header}
              left={
                <div className="full">
                  <Image src={step.image} />
                  <Segment>
                    <ReactMarkdown source={step.description} />
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
                <ArduinoWindow
                  progress={this.state.progress}
                  compile={this.state.compile}
                  loading={this.state.compile_loading}
                  handleCompile={this.handleCompile}
                  handleUpload={this.handleUpload}
                  handleMonitor={this.handleMonitor}
                  handleCodeChange={this.handleCodeChange}
                />
              }
              right={
                <Container>
                  <Segment basic loading={step_loading}>
                    {this.state.tests.length > 0 ? (
                      <div className="full">
                        {p ? (
                          <Continue
                            pass={'pass'}
                            color={'green'}
                            next={this.nextStep}
                          />
                        ) : (
                          <Continue
                            pass={'fail'}
                            disabled={true}
                            head={'Unpassed Tests'}
                            task={'Pass the tests to continue.'}
                            next={this.nextStep}
                          />
                        )}
                        <AccordionStyled
                          handleClick={this.patchProgressData()}
                          tests={this.state.tests}
                          data={this.state.pData}
                        />
                      </div>
                    ) : (
                      <Continue head={'No checks.'} next={this.nextStep} />
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

export default TutorialBody;
