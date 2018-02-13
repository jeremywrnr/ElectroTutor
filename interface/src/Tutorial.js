import React, { Component } from 'react'
import { Container, Header, Segment, Button } from 'semantic-ui-react'
import { HotKeys } from 'react-hotkeys'
import $ from 'jquery' // which press
//import ActionCable from 'actioncable'

import ListSelector from './ListSelector.js'
import ButtonGroup from './ButtonGroup.js'
import Grid3 from './Grid3.js'
//import Delay from './Delay.js'
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
    const api = new API(this.props.user_token) // generated from JWT auth
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
    return this.setState({
      tutorials,
    })
  }

  setTutorial = e => {
    const api = this.state.api
    const tutorial = $(e.target).closest('.ui.card').attr('id')
    api.patchUser({ current_tutorial: tutorial })
    this.setState({ tutorial })
  }

  unsetTutorial = () => {
    const api = this.state.api
    api.patchUser({ current_tutorial: '' })
    this.setState({ tutorial: '' })
  }


  /**
   * Rendering UI
   */

  render() {
    console.log(this.state)
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
        <Container>
          <ListSelector
            title='Choose a Tutorial'
            onClick={this.setTutorial}
            items={this.state.tutorials} />
          <br/>
          <Button onClick={this.props.logout} content='Log Out' />
        </Container>
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
    //this.handleCompile = this.handleCompile.bind(this)
    this.state = {
      tTitle: 'Initializing...',
      tDesc: 'Initializing...',
      sTitle: 'Initializing...',
      sDesc:  'Initializing...',
      sImage: '',
      progress:  undefined, // id
      step:      undefined, // id
      completed: undefined, // bool
      code:  'Initializing...',
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
      const api = this.props.api
      //let writeStep = (prevState, props) => { return {step: prevState.step + inc } }
      let writeStep = (prevState, props) => { return {step: Math.min(Math.max(prevState.step + inc, 1), 4) } }
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

  // For live updates, across sessions. Not needed right now
  // Const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
  // This.progSub = cable.subscriptions.create('ProgressesChannel', { received: this.handleReceiveProgress })
  // This.dataSub = cable.subscriptions.create('ProgressDataChannel', { received: this.handleReceiveProgressData })

  componentWillMount() {
    const api = new API(this.props.api_auth) // generated from JWT auth
    this.setState({ api })
    api.fetchUser()
    .then(this.handleUserUpdate)
    .then(api.fetchTutorial)
    .then(api.fetchProgress)
    .then(this.handleProgressUpdate)
    .then(api.fetchStep)
    .then(this.handleStepUpdate)
    .then(api.fetchTest)
    .then(this.handleTestUpdate)
  }

  handleProgressUpdate() {
  }

  handleStepUpdate() {
  }

  handleTestUpdate() {
  }

  handleCompile = c => {
    const api = this.state.api
    console.log(api.postCompile)
    api.postCompile({
      user: this.state.user,
      progress_id: this.state.progress,
      step_id: this.state.step,
      code: this.state.code,
    }).then(console.log)
  }

  handleCodeChange = code => {
    // To set on user
    console.log(code)
  }

  render() {
    console.log(this.state)
    return (
      <HotKeys keyMap={this.map} handlers={this.keyHandler}>
        <Grid3
          title={this.state.tTitle}
          tLink={this.state.tLink}
          mHead="Code Editor"
          left={
          <Container>
            <Header content={'Step ' + this.state.step +': '+ this.state.sTitle} />
            <Segment raised content={this.state.tDesc} />
            <img id='right' alt='hardware' src={this.state.sImage}/>
            <Segment raised content={this.state.sDesc} />
            <Button fluid icon='left chevron' content='Exit Tutorial' onClick={this.props.unset} />
            <Button fluid icon='left chevron' content='Log Out' onClick={this.props.logout} />
          </Container>
          }

          middle={
          <Container>
            <ButtonGroup
              onLClick={this.prevStep}
              onMClick={this.handleCompile}
              onRClick={this.nextStep} />
            <Code id='middle'
              name="codeEditor"
              code={this.state.code}
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
