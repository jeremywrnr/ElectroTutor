import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import { Message, Button, Icon } from 'semantic-ui-react'
import ActionCable from 'actioncable'
import Grid3 from './Grid3.js'
import Delay from './Delay.js'
import Code from './Code.js'
import Host from './Host.js'

import './App.css'

class App extends Component {
  state = {
    tTitle: 'Test Driven Tutorial',
    tDesc: 'Starting tutorial...',
    sTitle: 'Test Driven Steps',
    sDesc: 'Starting step...',
    code: 'print("world")',
    sImage: 'https://hackster.imgix.net/uploads/attachments/404768/dsc00467_PoC89Gk3vq.jpg?auto=compress%2Cformat&w=1280&h=960&fit=max',
    completed: 0, // id
    progress: -1, // id
    tutorial: -1, // id
    step:     -1, // id
    user:     1, // id
  }

  map = {
    'next': ['up', 'right'],
    'back': ['down', 'left']
  }

  incrementStep(inc) {
    //let writeStep = (prevState, props) => { return {step: prevState.step + inc } }
    let writeStep = (prevState, props) => { return {step: Math.min(Math.max(prevState.step + inc, 1), 4) } }
    let saveStep = () => {
      this.progSub.send({ id: this.state.user, step_id: this.state.step })
      this.fetchStep()
    }

    this.setState(writeStep, saveStep)
  }

  keyHandler = {
    'next': (event) => {
      this.incrementStep(1)
    },

    'back': (event) => {
      this.incrementStep(-1)
    }
  }

  componentDidMount() {

    /**
     * Connect to DB
     */

    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')

    this.userSub = cable.subscriptions.create('UsersChannel', {
      received: this.handleReceiveUserData
    })

    this.tutSub = cable.subscriptions.create('TutorialsChannel', {
      received: this.handleReceiveTutorialData
    })

    this.stepSub = cable.subscriptions.create('StepsChannel', {
      received: this.handleReceiveStepData
    })

    this.progSub = cable.subscriptions.create('ProgressesChannel', {
      received: this.handleReceiveProgressData
    })

    /**
     * Initial data creation
     */

    this.fetchUser()
    .then(this.fetchTutorial)
    .then(this.fetchProgress)
    .then(this.fetchStep)

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
      return data.json().then(this.handleReceiveProgressData)
    })
  }

  fetchStep = () => {
    return fetch(`${Host}/steps/${this.state.step}`).then(data => {
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

  handleReceiveProgressData = ({ completed, code, step_id }) => {
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


  /**
   * Interface handlers
   */

  handleCodeChange = code => {
    Delay(() => {
      console.info('saving code...')
      this.setState({ code })
      this.progSub.send({ code, user_id: this.state.user, tutorial_id: this.state.tutorial })
    }, 500 );
  }

  handleOnClick = () => {
    console.info('compiling...')
    var data = { user_id: this.state.user, progress_id: this.state.progress }
    fetch(`${Host}/compile`, {
      method: 'POST',
      code: this.state.code,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
  }


  /**
   * Rendering UI
   */

  render() {
    return (
      <HotKeys keyMap={this.map} handlers={this.keyHandler}>
        <div id="main">
          <Grid3
            title={this.state.tTitle}
            tLink={this.state.tLink}
            mHead={this.state.sTitle}
            left={
            <div>
              <Message
                icon='info'
                header={'Tutorial ' + this.state.tutorial }
                content={this.state.tDesc}
              />
              <img id='right' alt='hardware' src={this.state.sImage}/>
            </div>
            }

            middle={
            <div>
              <Button animated secondary icon onClick={this.handleOnClick} >
                <Button.Content visible>Compile</Button.Content>
                <Button.Content hidden>
                  <Icon name='right arrow' />
                </Button.Content>
              </Button>
              <br/>
              <br/>
              <Code id='middle'
                code={this.state.code}
                onChange={this.handleCodeChange}
              />
            </div>
            }

            right={
            <div>
              <Message
                success
                icon='check'
                header={'Step ' + this.state.step + ': ' + this.state.sTitle}
                content={this.state.sDesc}
              />
            </div>
            }
          />
        </div>
      </HotKeys>
      ) }
}

export default App
