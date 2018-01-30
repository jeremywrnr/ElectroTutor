import React, { Component } from 'react'
import TextArea from './TextArea.js'
import Grid3 from './Grid3.js'
import './App.css'

//import { Header } from 'semantic-ui-react'

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
