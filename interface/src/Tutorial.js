//import ActionCable from 'actioncable'
import React, { Component } from 'react'
import { Container, Header, Segment, Button } from 'semantic-ui-react'
import { HotKeys } from 'react-hotkeys'
import ListSelector from './ListSelector.js'
import ButtonGroup from './ButtonGroup.js'
import Grid3 from './Grid3.js'
import Delay from './Delay.js'
import Code from './Code.js'
import Test from './Test.js'
import Host from './Host.js'

class Tutorial extends Component {
  state = {
    tTitle: 'Test Driven Tutorial',
    tDesc: 'Starting tutorial...',
    sTitle: 'Test Driven Steps',
    sImage: '',
    sDesc: 'Starting step...',
    code: 'print("world")',
    isUserActive: false,
    user_id:  1, // id
    progress: 1, // id
    tutorial: 1, // id
    step:     1, // id
    completed: 0, // bool
    tests: [],
  }


  // generate function for modifying current tutorial step

  incrementStep(inc) {
    return () => {
      //let writeStep = (prevState, props) => { return {step: prevState.step + inc } }
      let writeStep = (prevState, props) => { return {step: Math.min(Math.max(prevState.step + inc, 1), 4) } }
      let saveStep = () => {
        this.progSub.send({ id: this.state.user, step_id: this.state.step })
        this.fetchStep().then(this.fetchTest)
      }
      this.setState(writeStep, saveStep)
    }
  }

  nextStep = this.incrementStep(+1)
  prevStep = this.incrementStep(-1)


  /**
   * connect to db
   */

  componentWillMount() {
    //const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
    //this.progSub = cable.subscriptions.create('ProgressesChannel', { received: this.handleReceiveProgress })
    //this.dataSub = cable.subscriptions.create('ProgressDataChannel', { received: this.handleReceiveProgressData })
    this.fetchUser()
    .then(this.fetchTutorials)
    .then(this.fetchTutorial)
    .then(this.fetchProgress)
    .then(this.fetchStep)
    .then(this.fetchTest)
  }

  componentWillUnmount() {
  }


  authFetch = (route, data) => {
    return fetch(`${Host}/${route}`, {
      headers: new Headers({
        'Authorization': this.props.user,
        'Content-Type': 'application/json',
      })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
  }

  fetchUser = () => {
    return this.authFetch(`users`)
    .then(this.handleReceiveUserData)
  }

  fetchTutorials = () => {
    return this.authFetch(`tutorials`)
    .then(this.handleReceiveTutorials)
  }

  // TODO add a limiting feature on this...

  fetchTutorial = () => {
    return this.authFetch(`tutorials/${this.state.tutorial}`)
    .then(this.handleReceiveTutorialData)
  }

  fetchProgress = () => {
    return this.authFetch(`prog?user_id=${this.state.user_id}&tutorial_id=${this.state.tutorial}`)
    .then(this.handleReceiveProgress)
  }

  fetchStep = () => {
    return this.authFetch(`steps/${this.state.step}`)
    .then(this.handleReceiveStepData)
  }

  fetchTest = () => {
    return this.authFetch(`test?step_id=${this.state.step}`)
    .then(this.handleReceiveTestData)
  }

  fetchData = () => {
    return this.authFetch(`/pdata/${this.state.progressData}`)
    .then(this.handleReceiveStepData)
  }


  /**
   * DB Update handlers
   */

  handleReceiveUserData = (data) => {
    console.log(data)
    if (data) {

      if (data.id) {
        this.setState({ user_id: data.id })
      }

      if (data.current_tutorial !== this.state.tutorial) {
        this.setState({ tutorial: data.current_tutorial })
      }

    }
  }

  handleReceiveTutorials = (tutorials) => {
    this.setState({ tutorials })
  }

  handleReceiveTutorialData = ({ id, title, source, description }) => {
    this.setState({
      tutorial: id,
      tTitle: title,
      tLink: source,
      tDesc: description,
    })
  }

  handleReceiveProgress = ({ completed, code, step_id }) => {
    if (code && code !== this.state.code) {
      this.setState({
        step: step_id,
        completed,
        code,
      })
    }
  }

  handleReceiveStepData = ({ id, title, description, image }) => {
    this.setState({
      step: id,
      sTitle: title,
      sDesc: description,
      sImage: image,
    })
  }

  handleReceiveTestData = (data) => {
    this.setState({ tests: data, })
  }

  handleReceiveProgressData = (data) => {
    //console.log(data)
  }


  /**
   * Interface handlers
   */

  handleCodeChange = code => {
    Delay(() => {
      console.info('saving code...')
      this.setState({ code }, () => this.progSub.send({ code, user_id: this.state.user, tutorial_id: this.state.tutorial }))
    }, 500 );
  }

  handleOnClickCompile = () => {
    console.info('compiling...')
    var data = { user_id: this.state.user, code: this.state.code, step_id: this.state.step, progress_id: this.state.progress }
    fetch(`${Host}/compile`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(res => this.setState({ deviceOut: res.output }))
  }


  /**
   * Rendering UI
   */

  render() {
    const current_tutorial = this.state.current_tutorial

    return (
      <div>
        {
        current_tutorial
        ?
        <TutorialBody />
        : (
        <ListSelector
          title='Choose a Tutorial'
          items={this.state.tutorials} />
        ) }

        <Container>
          <br/>
          <Button onClick={this.props.logout} content='Log Out' />
        </Container>
      </div>
      )
}
}

class TutorialBody extends Component {

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

  render() {
    return (
      <HotKeys keyMap={this.map} handlers={this.keyHandler}>
        <Grid3
          title={this.state.tTitle}
          tLink={this.state.tLink}
          mHead="Code Editor"
          left={
          <div>
            <Header content={'Step ' + this.state.step +': '+ this.state.sTitle} />
            <Segment raised content={this.state.tDesc} />
            <img id='right' alt='hardware' src={this.state.sImage}/>
            <Segment raised content={this.state.sDesc} />
            <Button fluid icon='left chevron' content='Log out' onClick={this.props.logout} />
          </div>
          }

          middle={
          <div>
            <ButtonGroup
              onLClick={this.prevStep}
              onMClick={this.handleOnClickCompile}
              onRClick={this.nextStep} />
            <Code id='middle'
              name="codeEditor"
              code={this.state.code}
              onChange={this.handleCodeChange}
            />
          </div>
          }

          right={
          <div>
            { this.state.tests.map( (t, i) => { return <Test task={t.description} pass={t.pass} output={t.output} key={i+1} i={i+1} /> }) }
            { this.state.deviceOut && <Code code={this.state.deviceOut}/> }
          </div>
          }
        />
      </HotKeys>
      )
  }
}

export default Tutorial
