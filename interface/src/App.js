import React, { Component } from 'react'
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
          <img onKeyPress={this.handleKeyPress} id='left'/>
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
