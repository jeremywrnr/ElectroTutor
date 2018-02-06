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
    tdesc: 'Starting tutorial...',
    sTitle: 'Test Driven Steps',
    sdesc: 'Starting step...',
    code: 'print("world")',
    image: 'https://hackster.imgix.net/uploads/attachments/404768/dsc00467_PoC89Gk3vq.jpg?auto=compress%2Cformat&w=1280&h=960&fit=max',
    progress: 1, // id
    tutorial: 1, // id
    step:     1, // id
    user:     1, // id
  }

  map = {
    'next': ['up', 'right'],
    'back': ['down', 'left']
  }

  incrementStep(inc) {
    let writeStep = (prevState, props) => { return {step: prevState.step + inc } }
    let saveStep = () => {
      this.userSub.send({ id: this.state.user, step: this.state.step })
      this.fetchStep().then(this.fetchProgress) }
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
    .then(this.fetchStep)
    .then(this.fetchProgress)

  }


  fetchUser = () => {
    //console.log(this.state)
    return fetch(`${Host}/users/${this.state.user}`).then(data => {
      return data.json().then(this.handleReceiveUserData)
    })
  }

  fetchTutorial = () => {
    //console.log(this.state)
    return fetch(`${Host}/tutorials/${this.state.tutorial}`).then(data => {
      return data.json().then(this.handleReceiveTutorialData)
    })
  }

  fetchStep = () => {
    console.log(this.state)
    return fetch(`${Host}/steps/${this.state.step}`).then(data => {
      return data.json().then(this.handleReceiveStepData)
    })
  }

  fetchProgress = () => {
    //console.log(this.state)
    return fetch(`${Host}/progresses/${this.state.progress}`).then(data => {
      return data.json().then(this.handleReceiveProgressData)
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
        this.setState({ tutorial: data.current_tutorial }, this.fetchTutorial)
      }

      if (data.current_step !== this.state.step) {
        this.setState({ step: data.current_step }, this.fetchStep)
      }

      if (data.current_progress !== this.state.progress) {
        this.setState({ progress: data.current_progress}, this.fetchProgress)
      }
    }
  }

  handleReceiveTutorialData = ({ id, title, description }) => {
    //console.log(id, title, description)
    this.setState({
      tutorial: id,
      tTitle: title,
      tdesc: description,
    })
  }

  handleReceiveStepData = ({ id, title, description, image }) => {
    //console.log(id, title, description, image)
    this.setState({
      step: id,
      sTitle: title,
      sdesc: description,
      image,
    });
  }

  handleReceiveProgressData = ({ code }) => {
    //console.log(code)
    if (code && code !== this.state.code) {
      this.setState({ code })
    }
  }


  /**
   * Interface handlers
   */

  handleCodeChange = code => {
    Delay(() => {
      this.setState({ code })
      this.progSub.send({ code, id: this.state.progress })
    }, 1000 );
  }

  handleOnClick = () => {
    console.log('clicked')
    var data = {step_id: this.state.step, user_id: 1}
    fetch(`${Host}/compile`, {
      method: 'POST', // or 'PUT'
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

            left={
            <div>
              <Message
                icon='info'
                header={'Tutorial ' + this.state.tutorial }
                content={this.state.tdesc}
              />
              <Message
                success
                icon='check'
                header={'Step ' + this.state.step + ': ' + this.state.sTitle}
                content={this.state.sdesc}
              />
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
              <img id='right' alt='hardware' src={this.state.image}/>
            </div>
            }
          />
        </div>
      </HotKeys>
      ) }
}

export default App
