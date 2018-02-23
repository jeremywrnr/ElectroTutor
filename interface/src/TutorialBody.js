import React, { Component } from 'react'
import { Image, Icon, Container, Header, Segment, Button } from 'semantic-ui-react'
import $ from 'jquery' // animations
import ReactMarkdown from 'react-markdown'
import { HotKeys } from 'react-hotkeys'
import * as ace from 'brace';
import { throttle } from 'lodash'
import Split from 'split.js'

//import ActionCable from 'actioncable'

import AccordionStyled from './AccordionStyled.js'
import Grid3 from './Grid3.js'
import Delay from './Delay.js'
import Code from './Code.js'
import Test from './Test.js'
import API from './API.js'

/**
 * Rendering the Tutorial UI
 */

class TutorialBody extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code:  'Initializing...',
      compile: false,
      completed: false, // bool
      progress:  { code: '' },
      tests: [],
      step: {},
    }
  }

  keyHandler = {
    'next': () => {
      this.nextStep()
    },
    'back': () => {
      this.prevStep()
    },
  }

  // Generate functions for modifying step

  incrementStep = inc => {
    return throttle(() => {
      const api = this.state.api
      const pid = this.state.progress.id
      let step_pos = Math.min(Math.max(this.state.step.position + inc, 1), 11)
      //const step_id = (prevState, props) => { return {step: prevState.step + inc } }

      console.log('step', step_pos)
      if (!step_pos) step_pos = 1

        api.configure()
        .then(() => api.patchStep({ pid, step_id: step_pos }))
        .catch(console.error) // TODO handle tutorial bounds
        .then(() => api.fetchStep(step_pos))
        .then(this.handleStepUpdate)
        .then(() => api.fetchTest(this.state.step.id))
        .then(this.handleTestUpdate)
    }, 100 )
  }

  nextStep = this.incrementStep(+1)
  prevStep = this.incrementStep(-1)

  editorContainerIds = ["#code_editor", "#status_container"]
  editorNames = ["code", "compile"]

  generatePaneSplit = (sizes=[90, 10]) => {
    const split = Split(this.editorContainerIds, {
      direction: 'vertical',
      gutterSize: 35,
      minSize: 50,
      sizes: sizes,
      onDrag: this.updateEditHeight,
    })

    this.split = split
    this.updateEditHeight()
  }

  updatePaneSplit = () => {
    const split = this.split
    const sizes = split.getSizes()
    split.destroy()
    this.split = undefined
    this.generatePaneSplit(sizes)
  }

  updateEditHeight = () => {
    this.editorNames.map(editor => ace.edit(editor).resize())
  }

  componentWillMount() {
    const api = new API(this.props.api_auth) // from JWT
    const tutorial = this.props.tutorial.id
    this.setState({ api, tutorial })
    //const step_pos = Math.min(Math.max(this.state.step.position + inc, 1), 4)

    api.configure()
    .then(() => api.fetchProgress(tutorial))
    .then(this.handleProgressUpdate)
    .then(this.handleStepError)
    .then(() => api.fetchStep(this.state.progress.step_id)) // MRU step
    .then(this.handleStepUpdate)
    .then(() => api.fetchTest(this.state.step.id))
    .then(this.handleTestUpdate)
  }

  componentDidMount() {
    this.generatePaneSplit()
  }

  componentWillUpdate() {
    this.updatePaneSplit()
  }

  handleProgressUpdate = progress => {
    this.setState({ progress })
  }

  handleStepUpdate = step => {
    this.setState({ step })
  }

  handleStepError = () => {
    if (!this.state.progress.step) {
      this.setState({ step: 1 })
    }
  }

  handleTestUpdate = tests => {
    this.setState({ tests })
  }

  handleProgressDataUpdate = pData => {
    this.setState({ pData })
  }

  // For live updates, across sessions. Not needed right now
  // Const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
  // This.progSub = cable.subscriptions.create('ProgressesChannel', { received: this.handleReceiveProgress })
  // This.dataSub = cable.subscriptions.create('ProgressDataChannel', { received: this.handleReceiveProgressData })

  handleCodeChange = code => { // user changes code
    const api = this.state.api
    Delay(() => {
      const newState = {progress: {...this.state.progress, code: code }}
      const update = () => this.setState(newState)
      const data = { code, pid: this.state.progress.id }
      console.info('saving code...')
      api.patchCode(data).then(update)
    }, 500 );
  }

  handleCodeUpdate = e => { // UI changes code - flash
    var div = $("#status_container");
    div.animate({opacity: '0.4'}, 0);
    div.animate({opacity: '1.0'}, 500);
  }

  handleServerCode = throttle((e, handler, msg) => {
    e.preventDefault()
    console.info(msg)
    const code = this.state.progress.code
    this.setState({ compile_loading: msg })
    const finish = compile => this.setState({ compile, compile_loading: false })
    handler(code).then(finish).then(this.handleCodeUpdate)
  }, 2000)

  handleCompile = e => {
    this.handleServerCode(e, this.state.api.postCompile, 'Compiling sketch...')
  }

  handleUpload = e => {
    this.handleServerCode(e, this.state.api.postUpload, 'Uploading code...')
  }

  // Key mapping
  map = {
    'next': ['right'],
    'back': ['left'],
  }

  render() {
    let compile_value, compile_success;
    if (this.state.compile_loading) {
      compile_value = this.state.compile_loading
    } else {
      const compile_finished = this.state.compile
      compile_success = compile_finished && this.state.compile.code === 0
      compile_value = (compile_success ? this.state.compile.output : this.state.compile.error) || ''
    }

    return (
      <HotKeys className='full' handlers={this.keyHandler} keyMap={this.map}>
        <div className='full pad'>
          <Grid3
            title={this.props.tutorial.title}
            tLink={this.props.tutorial.source}
            left={
            <Container className="full" >
              <Header content={'Step ' + this.state.step.position +': '+ this.state.step.title} />
              <Image src={this.state.step.image} />
              <Segment raised>
                <ReactMarkdown source={this.state.step.description} />
              </Segment>
              <Button.Group widths='2'>
                <Button labelPosition='left' icon='left chevron' content='Back' onClick={this.prevStep} />
                <Button labelPosition='right' icon='right chevron' content='Next' onClick={this.nextStep} />
              </Button.Group>
            </Container>
            }

            middle={
            <div className='arduino full'>

              <Button.Group widths='2'>
                <Button fluid animated className="fade" icon onClick={this.handleCompile} >
                  <Button.Content visible>
                    <Icon name='check' />
                  </Button.Content>
                  <Button.Content hidden>Verify</Button.Content>
                </Button>
                <Button fluid animated className="fade" icon onClick={this.handleUpload} >
                  <Button.Content hidden>Upload</Button.Content>
                  <Button.Content visible>
                    <Icon name='arrow right' />
                  </Button.Content>
                </Button>
              </Button.Group>

              <div className="full flex-container">
                <div id="code_editor">
                  <Code
                    name="code"
                    mode={"c_cpp"}
                    readOnly={false}
                    showLines={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={this.state.progress.code}
                    onChange={this.handleCodeChange} />
                </div>

                <div id="status_container">
                  <Code
                    name={"compile"}
                    mode={"c_cpp"}
                    value={compile_value}
                    theme={compile_success ? 'gob' : 'terminal'} />
                </div>
              </div>
            </div>
            }

            right={
            <Container>
              { this.state.tests.length ?
              (
              <Segment>

                { this.state.tests.map( (t, i) => { return <Test task={t.description} pass={t.pass} output={t.output} key={i+1} i={i+1} /> }) }

                <AccordionStyled />
              </Segment>
              )
              :
              (
              <Segment>
                <Test head={'No checks.'} task={'Continue once you are ready!'} pass={'info'}/>
                <Button fluid labelPosition='right' icon='right chevron' content='Next' onClick={this.nextStep} />
              </Segment>
              )
              }

              <div id="tutorial-menu">
                <Button content='Exit Tutorial' onClick={this.props.unset} />
                <Button content='Log Out' onClick={this.props.logout} />
              </div>
            </Container>
            }
          />
        </div>
      </HotKeys>
      );
      };
      };

      //mHead="Editor"
      export default TutorialBody
