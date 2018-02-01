import React, { Component } from 'react'
import { HotKeys } from 'react-hotkeys'
import { Message } from 'semantic-ui-react'
import { Button, Icon } from 'semantic-ui-react'
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

  handleOnClick = () => {
    console.log('clicked')
    var url = 'http://localhost:3001/compile/1'
    var data = {step: 1};

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
                content={this.state.text}
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
              <TextArea id='middle'/>
            </div>
            }
            right={
            <div>
              <img id='right'/>
            </div>
            } />
        </div>
      </HotKeys>
      ) }
}

export default App
