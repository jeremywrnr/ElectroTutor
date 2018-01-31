import React, { Component } from 'react'
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

    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyUp = (event) => {
    console.log(event.target)
    console.log(event.key)
    if(event.key === 'Enter') {
      console.log('enter press here! ')
    }
  }

  render() {
    return (
      <div id="main"
        onKeyUp={this.handleKeyUp} >
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
          <TextArea onKeyUp={this.handleKeyUp} id='middle'/>
          }
          right={
          <TextArea onKeyUp={this.handleKeyUp} id='right'/>
          } />
      </div>
    ) }
}


export default App
