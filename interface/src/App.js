import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import { Message } from 'semantic-ui-react'
import TextArea from './TextArea.js'
import Grid3 from './Grid3.js'
import './App.css'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    };
  }

  map = {
    'next': ['up', 'right'],
    'back': ['down', 'left']
  }

  handlers = {
    'next': (event) => {
      event.preventDefault()
      console.log('Move up hotkey called!')
      this.setState((prev) => {
        return {count: prev.count + 1}
      })
    },
    'back': (event) => {
      event.preventDefault()
      console.log('Move back hotkey called!')
      this.setState((prev) => {
        return {count: prev.count - 1}
      })
    }
  }

  render() {
    return (
      <HotKeys keyMap={this.map} handlers={this.handlers}>
        <div id="main">
          <Grid3
            left={
            <Message
              success
              icon='thumbs up'
              header={'Counter: ' + this.state.count}
              content='Your profile is complete.'
            />
            }
            middle={
            <TextArea id='middle'/>
            }
            right={
            <TextArea id='right'/>
            } />
        </div>
      </HotKeys>
      ) }
}

export default App
