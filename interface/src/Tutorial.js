import React, { Component } from 'react'
import { Container, Header, Segment, Button } from 'semantic-ui-react'
import { HotKeys } from 'react-hotkeys'
//import ActionCable from 'actioncable'
import $ from 'jquery'

import ListSelector from './ListSelector.js'
import ButtonGroup from './ButtonGroup.js'
import Grid3 from './Grid3.js'
//import Delay from './Delay.js'
import Code from './Code.js'
import Test from './Test.js'
import API from './API.js'

class Tutorial extends Component {
  state = {
    user:      undefined, // id
    tutorial:  undefined, // id
    tutorials: [],        // list
  }

  /**
   * Connect to DB
   */

  componentWillMount() {
    this.api = new API(this.props.user_token) // generated from JWT auth
    this.api.fetchUser()
    .then(this.handleUserUpdate)
    .then(this.api.fetchTutorials)
    .then(this.handleTutorialsUpdate)
  }

  componentWillUnmount() {
    // TODO close action cable connections
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
    const tutorial = $(e.target).closest('.ui.card').attr('id')
    const user = { id: this.state.user, current_tutorial: tutorial }
    this.api.patchUser(user).then(this.setState({ tutorial }))
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
        <TutorialBody api={this.api} tutorial={this.state.tutorial} />
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

class TutorialBody extends Tutorial {
  constructor(props) {
    super(props)
    this.api = props.api
  }

  state = {
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

  // generate function for modifying current tutorial step

  incrementStep(inc) {
    return () => {
      //let writeStep = (prevState, props) => { return {step: prevState.step + inc } }
      let writeStep = (prevState, props) => { return {step: Math.min(Math.max(prevState.step + inc, 1), 4) } }
      let saveStep = () => {
        this.api.patchStep({ step_id: this.state.step })
        this.fetchStep().then(this.fetchTest)
      }
      this.setState(writeStep, saveStep)
    }
  }

  nextStep = this.incrementStep(+1)
  prevStep = this.incrementStep(-1)
  componentWillMount() {
    //const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
    //this.progSub = cable.subscriptions.create('ProgressesChannel', { received: this.handleReceiveProgress })
    //this.dataSub = cable.subscriptions.create('ProgressDataChannel', { received: this.handleReceiveProgressData })

    this.fetchTutorial
    .then(this.fetchProgress)
    .then(this.fetchStep)
    .then(this.fetchTest)
  }

  handleOnClickCompile() {
    this.api.handleOnClickCompile({
      user: this.state.user,
      progress_id: this.state.progress,
      step_id: this.state.step,
      code: this.state.code,
    }, console.log)
  }


  render() {
    //return <p>hi</p>
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
            <Button fluid icon='left chevron' content='Exit Tutorial' onClick={this.props.logout} />
            <Button fluid icon='left chevron' content='Log Out' onClick={this.props.logout} />
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
