import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'
import TextArea from './TextArea.js'
import Grid3 from './Grid3.js'
import './App.css'


class App extends Component {
  handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      console.log('enter press here! ')
    }
  }

  render() {
    return (
      <div id="main">
        <Grid3
          left={
          <Message
            success
            icon='thumbs up'
            header='Nice job!'
            content='Your profile is complete.'
          />
          }
          middle={
          <TextArea onKeyPress={this.handleKeyPress} id='middle'/>
          }
          right={
          <TextArea onKeyPress={this.handleKeyPress} id='right'/>
          } />
      </div>
    ) }
}


export default App
