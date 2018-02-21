import React, { Component } from 'react'
import { Image, Icon, Container, Header, Segment, Button } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import { HotKeys } from 'react-hotkeys'
import $ from 'jquery' // which press
//import ActionCable from 'actioncable'

import ListSelector from './ListSelector.js'
import Grid3 from './Grid3.js'
import Delay from './Delay.js'
import Code from './Code.js'
import Test from './Test.js'
import API from './API.js'


class Tutorial extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user:      undefined, // id
      tutorial:  undefined, // id
      tutorials: [],        // list
    }
  }

  /**
   * Connect to DB
   */

  componentWillMount() {
    let api = new API(this.props.user_token) // generated from JWT auth
    this.setState({ api })
    api.fetchUser()
    .then(this.handleUserUpdate)
    .then(api.fetchTutorials)
    .then(this.handleTutorialsUpdate)
  }


  /**
   * Database updates
   */

  handleUserUpdate = user => {
    return this.setState({ user })
  }

  handleTutorialsUpdate = tutorials => {
    return this.setState({ tutorials })
  }

  handleTutorialUpdate = tutorial => {
    return this.setState({ tutorial })
  }

  setTutorial = e => {
    const api = this.state.api
    const tutorial = $(e.target).closest('.ui.card').attr('id') // id
    const update = () => api.patchUser({ current_tutorial: tutorial })
    api.configure().then(update)
    .then(() => api.fetchTutorial(tutorial))
    .then(this.handleTutorialUpdate)
  }

  unsetTutorial = () => {
    const api = this.state.api
    const update = () => api.patchUser({ current_tutorial: '' })
    const remove = () => this.setState({ tutorial: '' })
    api.configure().then(update).then(remove)
  }


  /**
   * Rendering UI
   */

  render() {
    const tutorial_is_active = !!this.state.tutorial
    return (
      <div>
        {
        tutorial_is_active
        ?
        <TutorialBody
          logout={this.props.logout}
          unset={this.unsetTutorial}
          tutorial={this.state.tutorial}
          api_auth={this.state.api.auth} />
        :
        <div className='pad'>
          <ListSelector
            title='Choose a Tutorial'
            onClick={this.setTutorial}
            items={this.state.tutorials} />
          <br/>
          <Button onClick={this.props.logout} content='Log Out' />
        </div>
        }
      </div>
      )
}
}



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
      step:      {},
      tests: [],
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

  nextStep = this.incrementStep(+1)
  prevStep = this.incrementStep(-1)

  incrementStep(inc) {
    return () => {
      Delay(() => {
        const api = this.state.api
        const pid = this.state.progress.id
        const step_pos = Math.min(Math.max(this.state.step.position + inc, 1), 9)
        //const step_id = (prevState, props) => { return {step: prevState.step + inc } }

        api.configure()
        .then(() => api.patchStep({ pid, step_id: step_pos }))
        .then(() => api.fetchStep(step_pos)) // TODO handle error, last step in tutorial
        .then(this.handleStepUpdate)
        .then(() => api.fetchTest(this.state.step.id))
        .then(this.handleTestUpdate)
      }, 50 );
    }
  }

  componentWillMount() {
    const api = new API(this.props.api_auth) // from JWT
    const tutorial = this.props.tutorial.id
    this.setState({ api, tutorial })
    //const step_pos = Math.min(Math.max(this.state.step.position + inc, 1), 4)

    api.configure()
    .then(() => api.fetchProgress(tutorial))
    .then(this.handleProgressUpdate)
    .then(() => api.fetchStep(this.state.progress.step_id)) // MRU step
    .then(this.handleStepUpdate)
    .then(() => api.fetchTest(this.state.step.id))
    .then(this.handleTestUpdate)
  }

  handleProgressUpdate = progress => {
    this.setState({ progress })
  }

  handleStepUpdate = step => {
    this.setState({ step })
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
    console.log(e)
  }

  handleCompile = e => {
    e.preventDefault()
    console.info('compiling code...')
    const api = this.state.api
    const code = this.state.progress.code
    this.setState({ compiling: true })
    const update = compile => this.setState({ compile })
    api.postCompile(code).then(update)
    var div = $("#compileOutput");
    div.animate({opacity: '0.2'}, 100);
    div.animate({opacity: '1.0'}, 1000);
  }

  handleUpload = e => {
    e.preventDefault()
    console.info('uploading code...')
    const api = this.state.api
    const code = this.state.progress.code
    const update = compile => this.setState({ compile })
    api.postUpload(code).then(update)
    var div = $("#compileOutput");
    div.animate({opacity: '0.2'}, 100);
    div.animate({opacity: '1.0'}, 1000);
  }

  // Key mapping
  map = {
    'next': ['right'],
    'back': ['left'],
  }

  render() {
    const compile_finished = this.state.compile
    const compile_success = compile_finished && this.state.compile.code === 0

    return (
      <HotKeys handlers={this.keyHandler} keyMap={this.map}>
        <div className='pad'>
          <Grid3
            title={this.props.tutorial.title}
            tLink={this.props.tutorial.source}
            mHead="Editor"
            left={
            <Container>
              <Header content={'Step ' + this.state.step.position +': '+ this.state.step.title} />
              <Button.Group widths='2'>
                <Button labelPosition='left' icon='left chevron' content='Back' onClick={this.prevStep} />
                <Button labelPosition='right' icon='right chevron' content='Next' onClick={this.nextStep} />
              </Button.Group>
              <Image src={this.state.step.image} />
              <Segment raised>
                <ReactMarkdown source={this.state.step.description} />
              </Segment>
              <Button.Group widths='2'>
                <Button content='Log Out' onClick={this.props.logout} />
                <Button content='Exit Tutorial' onClick={this.props.unset} />
              </Button.Group>
            </Container>
            }

            middle={
            <Container>
              <Button.Group widths='2'>
                <Button fluid animated className="fade" secondary icon onClick={this.handleCompile} >
                  <Button.Content visible>Compile</Button.Content>
                  <Button.Content hidden>
                    <Icon name='play' />
                  </Button.Content>
                </Button>
                <Button fluid animated className="fade" secondary icon onClick={this.handleUpload} >
                  <Button.Content visible>Upload</Button.Content>
                  <Button.Content hidden>
                    <Icon name='upload' />
                  </Button.Content>
                </Button>
              </Button.Group>
              <Code id='middle'
                name="codeEditor"
                readOnly={false}
                code={this.state.progress.code}
                onChange={this.handleCodeChange} />
            </Container>
            }

            right={
            <Container>
              { this.state.tests.map( (t, i) => { return <Test task={t.description} pass={t.pass} output={t.output} key={i+1} i={i+1} /> }) }
              { compile_finished && (
              <div id='compileOutput'>
                <Code code={compile_success ? this.state.compile.output : this.state.compile.error} />
              </div>
              )
              }
            </Container>
            }
          />
        </div>
      </HotKeys>
      )
  }
}

export default Tutorial
