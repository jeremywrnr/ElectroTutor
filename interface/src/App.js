import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import { Message } from 'semantic-ui-react'
import ActionCable from 'actioncable'
import TextArea from './TextArea.js'
import Grid3 from './Grid3.js'
import './App.css'


class App extends Component {
  state = {
    text: 'initial tutorial description',
    step: 1
  }

  map = {
    'next': ['up', 'right'],
    'back': ['down', 'left']
  }

  keyHandler = {
    'next': (event) => {
      event.preventDefault()
      let writeStep = (prev, inc) => { return {step: prev.step + 1} }
      let saveStep = () => this.sub.send({ step: this.state.step, id: 1 })
      this.setState(writeStep, saveStep)
    },

    'back': (event) => {
      event.preventDefault()
      let writeStep = (prev, inc) => { return {step: prev.step - 1} }
      let saveStep = () => this.sub.send({ step: this.state.step, id: 1 })
      this.setState(writeStep, saveStep)
    }
  }

  componentDidMount() {
    window.fetch('http://localhost:3001/users/1').then(data => {
      data.json().then(res => {
        console.log(res)
        this.setState({ step: res.step })
      })
    })

    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
    this.sub = cable.subscriptions.create('UsersChannel', {
      received: this.handleReceiveUserData
    })
  }

  handleReceiveUserData = ({ step }) => {
    if (step !== this.state.step) {
      this.setState({ step })
    }
  }

  render() {
    return (
      <HotKeys keyMap={this.map} handlers={this.keyHandler}>
        <div id="main">
          <Grid3
            left={
            <Message
              success
              icon='thumbs up'
              header={'Step ' + this.state.step}
              content={this.state.text}
            />
            }
            middle={
            <TextArea id='middle'/>
            }
            right={
            <img id='right'/>
            } />
        </div>
      </HotKeys>
      ) }
}

export default App
