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
    ttitle: 'Test Driven Tutorial',
    tdesc: 'Starting tutorial...',
    stitle: 'Test Driven Steps',
    sdesc: 'Starting step...',
    code: 'def hello:\n\tprint("world")',
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

  keyHandler = {
    'next': (event) => {
      event.preventDefault()
      let writeStep = (prev, inc) => { return {step: prev.step + 1} }
      let saveStep = () => {
        this.userSub.send({ step: this.state.step, id: this.state.user })
        window.fetch(`${Host}/steps/${this.state.step}`).then(data => {
          data.json().then(this.handleReceiveStepData)
        })
      }

      this.setState(writeStep, saveStep)
    },

    'back': (event) => {
      event.preventDefault()
      let writeStep = (prev, inc) => { return {step: prev.step - 1} }
      let saveStep = () => {
        this.userSub.send({ step: this.state.step, id: this.state.user })
        window.fetch(`${Host}/steps/${this.state.step}`).then(data => {
          data.json().then(this.handleReceiveStepData)
        })
      }
      this.setState(writeStep, saveStep)
    }
  }

  fetchUser = () => {
    window.fetch(`${Host}/users/${this.state.user}`).then(data => {
      data.json().then(this.handleReceiveUserData)
    })
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

    this.fetchTutorial = () => {
      window.fetch(`${Host}/tutorials/${this.state.tutorial}]`).then(data => {
        data.json().then(this.handleReceiveTutorialData)
      })

    }

    this.fetchStep = () => {
      window.fetch(`${Host}/steps/${this.state.step}`).then(data => {
        data.json().then(this.handleReceiveStepData)
      })
    }

    this.fetchProgress = () => {
      window.fetch(`${Host}/progresses/${this.state.progress}]`).then(data => {
        data.json().then(this.handleReceiveProgressData)
      })
    }

    this.fetchUser()
    //.then(this.fetchTutorial)
    //.then(this.fetchStep)
    //.then(this.fetchProgress)
  }

  /**
   * DB Update handlers
   */

  handleReceiveUserData = (data) => {
    console.log(data)
    let current_step = data.current_step
    let current_tutorial = data.current_tutorial
    if (current_step !== this.state.step) {
      this.setState({ ...this.state,
                    tutorial: current_tutorial,
                    step: current_step,
      })
    }
  }

  handleReceiveTutorialData = ({ id, title, description }) => {
    console.log( id, title, description)
    if (id !== this.state.tutorial) {
      this.setState({ ...this.state,
                    tutorial: id,
                    ttitle: title,
                    tdesc: description
      })
    }
  }

  handleReceiveStepData = ({ id, description, title }) => {
    if (id !== this.state.step) {
      this.setState({ ...this.state,
                    step: id,
                    sdesc: description,
                    stitle: title
      });
    }
  }

  handleReceiveProgressData = ({ code }) => {
    if (code !== this.state.code) {
      this.setState({ ...this.state, code })
    }
  }


  /**
   * Interface handlers
   */

  handleCodeChange = code => {
    Delay(() => {
      this.setState({ ...this.state, code })
      this.progSub.send({ code, id: 1 })
    }, 1000 );
  }

  handleOnClick = () => {
    console.log('clicked')
    var url = `${Host}/compile`
    var data = {step_id: this.state.step, user_id: 1}

    fetch(url, {
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
            title={this.state.ttitle}

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
                header={'Step ' + this.state.step + ': ' + this.state.stitle}
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
