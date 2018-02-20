import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { HotKeys } from 'react-hotkeys'
import Tutorial from './Tutorial.js'
import Account from './Account.js'
import Login from './Login.js'

import './App.css'

class App extends Component {
  state = {
    title: 'Test Driven Tutorials',
    isUserActive: false,
    user: undefined,
    eFlag: false,
    eMsg: '',
  }


  /**
   * Account management
   */

  createUser = ({ user, pass }) => {
    const newUser = { user: { email: user, password: pass } }
    Account.createUser(newUser).then(res => {
      res.ok ?
        this.loginUser({ user, pass }) :
        this.setState({ eFlag: true, eMsg: res.statusText })
    })
  }

  loginUser = ({ user, pass }) => {
    const newUser = { auth: { email: user, password: pass } }
    Account.setServerCredentials(newUser).then(res => {
      if (res.jwt) {
        Account.setLocalCredentials(res.jwt)
        this.setState({ user: res.jwt, isUserActive: true })
      } else {
        this.setState({ eFlag: true, eMsg: res.statusText })
      }
    })
  }

  logoutUser = () => {
    this.setState({ isUserActive: false, eFlag: false })
    Account.clearLocalCredentials()
  }

  componentWillMount () {
    const token = Account.getLocalCredentials()
    if (token) {
      this.setState({ user: token, isUserActive: true })
    }
  }


  /**
   * Rendering UI
   */

  render() {
    const active = this.state.isUserActive

    return (
      <div id="full">
          {
          active
          ?
          <Tutorial
            user_token={this.state.user}
            logout={this.logoutUser} />
          :
          <Login
            title={this.state.title}
            login={this.loginUser}
            create={this.createUser}
            eFlag={this.state.eFlag}
            eMsg={this.state.eMsg} />
          }
      </div>
      )
}
}

export default App
