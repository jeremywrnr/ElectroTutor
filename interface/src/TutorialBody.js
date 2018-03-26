import React, {Component} from 'react';
import {Image, Container, Segment, Button} from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import {HotKeys} from 'react-hotkeys';
import * as ace from 'brace';
import {throttle} from 'lodash';
import Split from 'split.js';

//import $ from 'jquery'; // animations

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
      tests_reveal: false,
      page_loading: true,
      step_loading: false,
      port_monitor: false,
      splash: false,
      test_mode: '',
      idents: [],
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
        return; // tests not yet passed
      } else {
        this.setState({test_reveal: false, step_loading: true});
        const api = this.state.api;
        const prog = this.state.progress;
        const step_pos = prog.position + inc;
        const pos = this.handleStepError(step_pos);
        const tut = this.state.tutorial;
        api
          .configure()
          .then(() => api.patchStep(prog.id, pos)) // Update progress's position
          .then(() => api.fetchProgress(tut))
          .then(this.handleProgressUpdate)
          .then(() => api.fetchStep(tut, pos)) // Get new step
          .then(this.handleStepUpdate)
          .then(() => api.fetchTest(tut, pos)) // Get new tests
          .then(this.handleTestUpdate)
          .then(() => api.fetchData(this.state.progress.id, this.state.tests)) // Get new progress
          .then(this.handleProgressDataUpdate)
          .then(this.updateStepProgress);
      }
    }, 250);
  };

  patchProgressData = () => {
    return throttle((pdata, pass) => {
      this.setState({step_loading: true});
      const id = pdata.id;
      const api = this.state.api;
      const state = pass ? 'pass' : 'fail';
      api
        .configure()
        .then(() => api.patchData({id, state}))
        .then(() => api.fetchData(this.state.progress.id, this.state.tests))
        .then(this.handleProgressDataUpdate)
        .then(this.updateStepProgress);
    }, 250);
  };

  nextStep = this.patchStep(+1);
  prevStep = this.patchStep(-1);
  resetStep = this.patchStep(-1000);

  splash = () => this.setState({splash: true});
  deSplash = () => this.setState({splash: false});

  editorContainerIds = ['#code_editor', '#status_container'];
  editorNames = ['code'];

  dataUpdate = api => {
    const tut = this.state.tutorial;
    return api
      .configure()
      .then(() => api.fetchProgress(tut))
      .then(this.handleProgressUpdate)
      .then(() => api.fetchStep(tut, this.state.progress.position)) // MRU step
      .then(this.handleStepUpdate)
      .then(() => api.fetchTest(tut, this.state.progress.position))
      .then(this.handleTestUpdate)
      .then(() => api.fetchData(this.state.progress.id, this.state.tests))
      .then(this.handleProgressDataUpdate)
      .then(this.updateStepProgress)
      .then(() => api.fetchIdents(this.state.progress.code))
      .then(this.handleIdents)
      .then(() => this.setState({step_loading: false, page_loading: false}));
  };

  generatePaneSplit = (sizes = [80, 20]) => {
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
    this.setState({tests_passed, step_loading: false});
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
  }

  componentDidMount() {
    this.dataUpdate(this.state.api);
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
    if (this.isEmptyObj(step)) {
      const pos = this.state.progress.position;
      pos > 1 ? this.prevStep() : this.resetStep();
    } else {
      this.setState({step});
    }
  };

  handleStepError = step_pos => {
    console.log('step', step_pos);
    if (!step_pos || step_pos < 1) {
      console.warn('error: resetting step pos to 1');
      this.splash();
      return 1;
    } else {
      this.deSplash();
      return step_pos;
    }
  };

  handleTestUpdate = tests => {
    if (!this.isEmptyObj(tests)) {
      this.setState({tests});
    }
  };

  handleProgressDataUpdate = pData => {
    this.setState({pData});
  };

  // user changes code
  handleCodeChange = code => {
    const api = this.state.api;
    const newState = {progress: {...this.state.progress, code: code}};
    this.setState(newState);
    Delay(() => {
      const data = {code, pid: this.state.progress.id};
      console.info('saving code/parsing identifiers...');
      api
        .fetchIdents(code)
        .then(this.handleIdents)
        .then(() => api.patchCode(data));
    }, 1000);
  };

  // user changes selected code
  handleSelectionChange = sel => {
    const selected = sel.session.getTextRange(sel.getRange());
    this.throttledSelect(selected.trim());
  };

  throttledSelect = throttle(selected => {
    this.setState({selected});
  }, 50);

  handleCodeUpdate = compile => {
    this.setState({compile, compile_loading: false});
  };

  handleServerCode = throttle((e, handler, msg) => {
    e && e.preventDefault();
    console.info(msg);
    const code = this.state.progress.code;
    this.setState({compile_loading: msg});
    return handler(code).then(this.handleCodeUpdate);
  }, 2000);

  handleCompile = e => {
    const compile = this.state.api.postCompile;
    return this.handleServerCode(e, compile, 'Compiling sketch...');
  };

  handleUpload = e => {
    const upload = this.state.api.postUpload;
    return this.handleServerCode(e, upload, 'Uploading code...');
  };

  handleMonitor = e => {
    return this.setState({port_viewing: true});
  };

  handleDemonitor = e => {
    return this.setState({port_viewing: false});
  };

  handleTestMode = test_mode => {
    return this.setState({test_mode});
  };

  handleTestReveal = (test_reveal = true) => {
    return this.setState({test_reveal});
  };

  handleIdents = idents => {
    return this.setState({idents});
  };

  //
  // KEY MAPPING
  //

  map = {
    next: ['right'],
    back: ['left'],
  };

  isEmptyObj = obj => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  render() {
    const step = this.state.step;
    const step_header = 'Step ' + step.position + ': ' + step.title;
    const page_loading = this.state.page_loading;
    const step_loading = this.state.step_loading;

    // Dynamic continue method params
    const p = this.state.tests_passed;
    const show = this.state.test_reveal;
    let continueProps = {
      disabled: show && !p,
      head: p ? 'Tests Passed' : 'Unpassed Tests',
      pass: p ? 'pass' : 'fail',
      task: p ? 'Continue once you are ready.' : 'Pass the tests to continue.',
      next: this.nextStep,
    };
    if (!show) {
      continueProps.head = 'Step Tests';
      continueProps.text = 'Begin';
      continueProps.task = 'Click to start tests.';
      continueProps.next = this.handleTestReveal;
    }
    if (p) {
      continueProps.color = 'green';
    }

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
                        disabled={this.state.progress.position <= 1}
                        onClick={this.prevStep}
                        labelPosition="left"
                        icon="left chevron"
                        content="Back"
                      />
                      <Button
                        disabled={!p}
                        onClick={this.nextStep}
                        labelPosition="right"
                        icon="right chevron"
                        content="Next"
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
                  handleSelectionChange={this.handleSelectionChange}
                />
              }
              right={
                <Container>
                  {step_loading ? (
                    <Segment padded basic>
                      <Segment basic loading />
                    </Segment>
                  ) : (
                    <Segment basic>
                      {this.state.tests.length > 0 ? (
                        <div className="full">
                          <Continue {...continueProps} />
                          {show && (
                            <AccordionStyled
                              progress={this.state.progress}
                              selected={this.state.selected}
                              compile={this.state.compile}
                              loading={this.state.compile_loading}
                              handleCompile={this.handleCompile}
                              handleUpload={this.handleUpload}
                              handleMonitor={this.handleMonitor}
                              handleTestMode={this.handleTestMode}
                              handleClick={this.patchProgressData()}
                              test_mode={this.state.test_mode}
                              idents={this.state.idents}
                              tests={this.state.tests}
                              pdata={this.state.pData}
                              api={this.state.api}
                            />
                          )}
                        </div>
                      ) : (
                        <Continue head={'No checks.'} next={this.nextStep} />
                      )}
                    </Segment>
                  )}

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
              title={'Serial Monitor'}
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
