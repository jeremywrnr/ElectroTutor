import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import { Message } from 'semantic-ui-react'
import ActionCable from 'actioncable'
import TextArea from './TextArea.js'
import Grid3 from './Grid3.js'
import './App.css'


class App extends Component {
  state = {
    text: '',
    step: 1
  }

  map = {
    'next': ['up', 'right'],
    'back': ['down', 'left']
  }

  keyHandler = {
    'next': (event) => {
      event.preventDefault()
      console.log('Move up hotkey called!')
      this.setState((prev) => {
        return {step: prev.step + 1}
      })
    },

    'back': (event) => {
      event.preventDefault()
      console.log('Move back hotkey called!')
      this.setState((prev) => {
        return {step: prev.step - 1}
      })
    }
  }

  componentDidMount() {
    window.fetch('http://localhost:3001/users/1').then(data => {
      data.json().then(res => {
        this.setState({ step: res.step })
      })
    })

    const cable = ActionCable.createConsumer('ws://localhost:3001/cable')
    this.sub = cable.subscriptions.create('NotesChannel', {
      received: this.handleReceiveNewText
    })
  }

  handleReceiveNewText = ({ text }) => {
    if (text !== this.state.text) {
      this.setState({ text })
    }
  }

  handleChange = e => {
    this.setState({ text: e.target.value })
    this.sub.send({ text: e.target.value, id: 1 })
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
              onChange={this.handleChange}
              header={'Step ' + this.state.step}
              content={this.state.text}
            />
            }
            middle={
            <img id='middle'/>
            }
            right={
            <img id='right'/>
            } />
        </div>
      </HotKeys>
      ) }
}

export default App
