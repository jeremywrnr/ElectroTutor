import React, { Component } from 'react'
import { Grid3 } from './Grid3.js'
import { Header } from 'semantic-ui-react'
import TextArea from './TextArea.js'
import './App.css'

class App extends Component {
  render() {
    return (
      <div id="main">
        <Grid3
          left={
          <TextArea />
          }
          middle={
          <TextArea />
          }
          right={
          <TextArea />
          } />
      </div>
    )
}
}


export default App
