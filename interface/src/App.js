import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import { Message } from 'semantic-ui-react'
import { Button, Icon } from 'semantic-ui-react'
import ActionCable from 'actioncable'
import Grid3 from './Grid3.js'
import Code from './Code.js'
import './App.css'

class App extends Component {
  state = {
    code: 'initial tutorial description',
    step: 1,
    list: [],
    desc: 'hello',
  }

  map = {
    'next': ['up', 'right'],
    'back': ['down', 'left']
  }

  keyHandler = {
    'next': (event) => {
      event.preventDefault()
      let writeStep = (prev, inc) => { return {step: prev.step + 1} }
      let saveStep = () => this.userSub.send({ step: this.state.step, id: 1 })
      this.setState(writeStep, saveStep)
    },

    'back': (event) => {
      event.preventDefault()
      let writeStep = (prev, inc) => { return {step: prev.step - 1} }
      let saveStep = () => this.userSub.send({ step: this.state.step, id: 1 })
      this.setState(writeStep, saveStep)
    }
  }

  componentDidMount() {
    window.fetch('http://localhost:3001/users/1').then(data => {
      data.json().then(res => {
        console.log(res)
        this.setState({ ...this.state, step: res.step })
      })
    })

    window.fetch('http://localhost:3001/notes/1').then(data => {
      data.json().then(res => {
        this.setState({ ...this.state, code: res.code })
      })
    })

    /**
     * Pull DB state
     */

    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')

    this.userSub = cable.subscriptions.create('UsersChannel', {
      received: this.handleReceiveUserData
    })

    this.stepSub = cable.subscriptions.create('StepsChannel', {
      received: this.handleReceiveStepData
    })

    this.noteSub = cable.subscriptions.create('NotesChannel', {
      received: this.handleReceiveNewCode
    })
  }

  handleReceiveUserData = ({ step }) => {
    if (step !== this.state.step) {
      this.setState({ ...this.state, step })
    }
  }

  handleReceiveStepData = (step) => {
    console.log(step)
  }

  handleReceiveNewCode = ({ code }) => {
    if (code !== this.state.code) {
      this.setState({ ...this.state, code: code })
    }
  }

  handleCodeChange = e => {
    console.log(e)
    this.setState({ ...this.state, code: e })
    this.noteSub.send({ code: e, id: 1 })
  }

  handleOnClick = () => {
    console.log('clicked')
    var url = 'http://localhost:3001/compile'
    var data = {step_id: 1, user_id: 1}

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
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
            left={
            <div>
              <Message
                success
                icon='thumbs up'
                header={'Step ' + this.state.step}
                content={this.state.desc}
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
              <img id='right' alt='hardware'/>
            </div>
            }
          />
        </div>
      </HotKeys>
      ) }
}

export default App
