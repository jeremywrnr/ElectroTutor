import React, { Component } from 'react'
import { Icon, Divider, Container, Header, Segment, Button } from 'semantic-ui-react'
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

  handleUserUpdate = ({ id, current_tutorial }) => {
    return this.setState({
      tutorial: current_tutorial,
      user: id,
    })
  }

  handleTutorialsUpdate = tutorials => {
    return this.setState({ tutorials })
  }

  setTutorial = e => {
    const api = this.state.api
    const tutorial = $(e.target).closest('.ui.card').attr('id')
    const update = () => api.patchUser({ current_tutorial: tutorial })
    const remove = () => this.setState({ tutorial })
    api.configure().then(update).then(remove)
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
      <Container>
        {
        tutorial_is_active
        ?
        <TutorialBody
          logout={this.props.logout}
          unset={this.unsetTutorial}
          tutorial={this.state.tutorial}
          api_auth={this.state.api.auth} />
        :
        <Container>
          <ListSelector
            title='Choose a Tutorial'
            onClick={this.setTutorial}
            items={this.state.tutorials} />
          <br/>
          <Button onClick={this.props.logout} content='Log Out' />
        </Container>
        }
      </Container>
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
      completed: false, // bool
      progress:  { code: '' },
      step:      {},
      tests: [],
    }
  }

  map = {
    'next': ['up', 'right'],
    'back': ['down', 'left'],
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
      const api = this.state.api
      let writeStep = (prevState, props) => { return {step: Math.min(Math.max(prevState.step + inc, 1), 4) } }
      //let writeStep = (prevState, props) => { return {step: prevState.step + inc } }

      let saveStep = () => {
        this.api.patchStep({ step_id: this.state.step })
        .then(api.fetchStep)
        .then(this.handleStepUpdate)
        .then(api.fetchTest)
        .then(this.handleTestUpdate)
      }

      this.setState(writeStep, saveStep)
    }
  }

  componentWillMount() {
    const api = new API(this.props.api_auth) // from JWT
    const tutorial = this.props.tutorial
    this.setState({ api, tutorial })

    api.configure()
    .then(() => api.fetchProgress(tutorial))
    .then(this.handleProgressUpdate)
    .then(api.fetchStep)
    .then(this.handleStepUpdate)
    //.then(api.fetchTest)
    //.then(this.handleTestUpdate)
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

  handleCodeChange = code => {
    const api = this.state.api
    Delay(() => {
      const newState = {progress: {...this.state.progress, code: code }}
      const update = () => this.setState(newState)
      const data = { code, pid: this.state.progress.id }
      console.info('saving code...', data)
      api.patchCode(data).then(update)
    }, 500 );
  }

  handleCompile = e => {
    e.preventDefault()
    console.info('compiling code...')
    const api = this.state.api
    const data = { code: this.state.progress.code, pid: this.state.progress.id }
    const update = compile => this.setState({ compile })
    api.postCompile(data).then(update)
  }

  render() {
    console.log(this.state.tutorial, this.state.progress)
    return (
      <HotKeys keyMap={this.map} handlers={this.keyHandler}>
        <Grid3
          title={this.props.title}
          tLink={this.props.tLink}
          mHead="Editor"
          left={
          <Container>
            <Header content={'Step ' + this.state.step.position +': '+ this.state.step.title} />
            <Segment raised content={this.state.tDesc} />
            <img id='right' alt='hardware' src={this.state.step.image}/>
            <Segment raised content={this.state.step.description} />

            <Button.Group widths='2'>
              <Button labelPosition='left' icon='left chevron' content='Back' onClick={this.props.onLClick} />
              <Button labelPosition='right' icon='right chevron' content='Forward' onClick={this.props.onRClick} />
            </Button.Group>
            <Divider />
            <Button.Group widths='2'>
              <Button content='Log Out' onClick={this.props.logout} />
              <Button content='Exit Tutorial' onClick={this.props.unset} />
            </Button.Group>
          </Container>
          }

          middle={
          <Container>
            <Button animated className="fade" secondary icon onClick={this.props.onMClick} >
              <Button.Content visible>Compile</Button.Content>
              <Button.Content hidden>
                <Icon name='play' />
              </Button.Content>
            </Button>
            <Code id='middle'
              name="codeEditor"
              code={this.state.progress.code}
              onChange={this.handleCodeChange} />
          </Container>
          }

          right={
          <Container>
            { this.state.tests.map( (t, i) => { return <Test task={t.description} pass={t.pass} output={t.output} key={i+1} i={i+1} /> }) }
            { this.state.deviceOut && <Code code={this.state.deviceOut}/> }
          </Container>
          }
        />
      </HotKeys>
      )
  }
}

export default Tutorial
