import React, { Component } from 'react'
import { Header, Segment, Button } from 'semantic-ui-react'
import { HotKeys } from 'react-hotkeys'
import ActionCable from 'actioncable'
import ButtonGroup from './ButtonGroup.js'
import Account from './Account.js'
import Grid3 from './Grid3.js'
import Delay from './Delay.js'
import Code from './Code.js'
import Test from './Test.js'
import Host from './Host.js'

import './App.css'

class Tutorial extends Component {

  state = {
    tTitle: 'Test Driven Tutorial',
    tDesc: 'Starting tutorial...',
    sTitle: 'Test Driven Steps',
    sDesc: 'Starting step...',
    code: 'print("world")',
    isUserActive: false,
    sImage: 'https://hackster.imgix.net/uploads/attachments/404768/dsc00467_PoC89Gk3vq.jpg?auto=compress%2Cformat&w=1280&h=960&fit=max',
    completed: 0, // id
    progress: -1, // id
    tutorial: -1, // id
    step:     -1, // id
    user:     1, // id
    tests: [],
  }

  map = {
    'next': ['up', 'right'],
    'back': ['down', 'left'],
  }

  incrementStep(inc) { // generate function for modifying current tutorial step
    return () => {
      let writeStep = (prevState, props) => { return {step: Math.min(Math.max(prevState.step + inc, 1), 4) } }
      //let writeStep = (prevState, props) => { return {step: prevState.step + inc } }
      let saveStep = () => {
        this.progSub.send({ id: this.state.user, step_id: this.state.step })
        this.fetchStep().then(this.fetchTest)
      }
      this.setState(writeStep, saveStep)
    }
  }

  nextStep = this.incrementStep(+1)
  prevStep = this.incrementStep(-1)

  keyHandler = {
    'next': () => {
      this.nextStep()
    },
    'back': () => {
      this.prevStep()
    },
  }

  componentWillMount() {

    /**
     * connect to db
     */

    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')

    this.progSub = cable.subscriptions.create('ProgressesChannel', {
      received: this.handleReceiveProgress
    })

    this.dataSub = cable.subscriptions.create('ProgressDataChannel', {
      received: this.handleReceiveProgressData
    })

    /**
     * Initial data creation
     */

    const user = Account.getLocalCredentials()

    if (user === undefined) {
      return
    } else {
      //this.setState({ isUserActive: true }, () => {})
      this.fetchUser()
      .then(this.fetchTutorial)
      .then(this.fetchProgress)
      .then(this.fetchStep)
      .then(this.fetchTest)
    }
  }

  componentDidMount() {
  }


  fetchUser = () => {
    return fetch(`${Host}/users/${this.state.user}`).then(data => {
      return data.json().then(this.handleReceiveUserData)
    })
  }

  fetchTutorial = () => {
    return fetch(`${Host}/tutorials/${this.state.tutorial}`).then(data => {
      return data.json().then(this.handleReceiveTutorialData)
    })
  }

  fetchProgress = () => {
    return fetch(`${Host}/prog?user_id=${this.state.user}&tutorial_id=${this.state.tutorial}`).then(data => {
      return data.json().then(this.handleReceiveProgress)
    })
  }

  fetchStep = () => {
    return fetch(`${Host}/steps/${this.state.step}`).then(data => {
      return data.json().then(this.handleReceiveStepData)
    })
  }

  fetchTest = () => {
    return fetch(`${Host}/test?step_id=${this.state.step}`).then(data => {
      return data.json().then(this.handleReceiveTestData)
    })
  }

  fetchData = () => {
    return fetch(`${Host}/pdata/${this.state.progressData}`).then(data => {
      return data.json().then(this.handleReceiveStepData)
    })
  }


  /**
   * DB Update handlers
   */

  // TODO - set logged in user w/ account management and access permissions

  handleReceiveUserData = (data) => {
    //console.log(data, this.state)
    if (data && data.id === this.state.user) {

      if (data.current_tutorial !== this.state.tutorial) {
        this.setState({ tutorial: data.current_tutorial })
      }

    }
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
