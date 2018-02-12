import React, { Component } from 'react'
import Tutorial from './Tutorial.js'
import Account from './Account.js'
import Login from './Login.js'
//import Host from './Host.js'
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

  loginUser = ({ user, pass }) => {
    const newUser = { auth: { uname: user, password: pass } }
    const handler = (res) => console.log(res)
    //const success = res => this.setState({ user: user, isUserActive: true })
    //const errored = err => this.setState({ eFlag: true, eMsg: err.statusText })
    Account.setServerCredentials(newUser).then(handler)
  }

  createUser = ({ user, pass }) => {
    const newUser = { user: { uname: user, password: pass } }
    const handler = res => res.ok ? success() : errored(res)
    const success = () => this.loginUser({ user, pass })
    const errored = err => this.setState({ eFlag: true, eMsg: err.statusText })
    Account.createUser(newUser).then(handler)
  }


  /**
   * Rendering UI
   */

  render() {
    const active = this.state.isUserActive

    return (
      <div id="main">
        {
        active
        ?
        <Tutorial logout={() => this.setState({ isUserActive: false, eFlag: false }) } />
        :
        <Login title={this.state.title}
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
