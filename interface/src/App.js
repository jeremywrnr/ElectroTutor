import React, { Component } from 'react'
import Tutorial from './Tutorial.js'
import Account from './Account.js'
import Login from './Login.js'
import Host from './Host.js'
import './App.css'

class App extends Component {
  state = {
    title: 'Test Driven Tutorials',
    isUserActive: false,
  }


  /**
   * Account management
   */

  loginUser = u => {
    console.log(u)
    const user = Account.getLocalCredentials()

    if (user === undefined) {
      return false
    } else {
      this.setState({ isUserActive: true })
      console.log(Host + user)
    }
  }

  createUser = u => {
    console.log(u)
  }


  /**
   * Rendering UI
   */

  render() {
    const active = this.state.isUserActive

    return (
      <div id="main">
        {
        active === true
        ?
        <Tutorial logout={() => this.setState({ isUserActive: false }) } />
        :
        <Login title={this.state.title} login={this.loginUser} create={this.createUser} />
        }
      </div>
      )
}
}

export default App
