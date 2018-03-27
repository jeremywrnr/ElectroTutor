import React, {Component} from 'react';
import Tutorial from './Tutorial.js';
import Account from './Account.js';
import Login from './Login.js';

import './App.css';

class App extends Component {
  state = {
    title: 'Test Driven Tutorials',
    isUserActive: false,
    user: undefined,
    eFlag: false,
    eMsg: '',
  };

  /**
   * Account management
   */

  createUser = ({user, pass}) => {
    const newUser = {user: {email: user, password: pass}};
    Account.createUser(newUser).then(res => {
      res.ok ? this.loginUser({user, pass}) : this.handleError(res);
    });
  };

  loginUser = ({user, pass}) => {
    const newUser = {auth: {email: user, password: pass}};
    Account.setServerCredentials(newUser).then(req => {
      if (req.ok) {
        req.json().then(res => {
          if (res.jwt) {
            Account.setLocal(res.jwt);
            this.setState({user: res.jwt, isUserActive: true});
          } else {
            this.handleError(res);
          }
        });
      } else {
        this.handleError(req);
      }
    });
  };

  handleError = r => this.setState({eFlag: true, eMsg: r.statusText});

  logoutUser = () => {
    this.setState({isUserActive: false, eFlag: false});
    Account.clearLocal();
  };

  componentWillMount() {
    const token = Account.getLocal();
    if (token) {
      this.setState({user: token, isUserActive: true});
    }
  }

  /**
   * Rendering UI
   */

  render() {
    const active = this.state.isUserActive;

    return (
      <div id="full">
        {active ? (
          <Tutorial user_token={this.state.user} logout={this.logoutUser} />
        ) : (
          <Login
            title={this.state.title}
            login={this.loginUser}
            create={this.createUser}
            eFlag={this.state.eFlag}
            eMsg={this.state.eMsg}
          />
        )}
      </div>
    );
  }
}

export default App;
