/**
 * Show user signup / login form
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Header, Message, Form} from 'semantic-ui-react';

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    eFlag: PropTypes.bool.isRequired,
    eMsg: PropTypes.string.isRequired,
  };

  state = {
    eFlag: false,
    user: '',
    pass: '',
    eMsg: '',
  };

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  validate = () => {
    const {user, pass} = this.state;
    return user.trim().length > 1 && pass.trim().length > 1;
  };

  loginUser = () => {
    if (this.validate()) this.props.login(this.state);
    else console.error('Only non-empty fields accepted');
  };

  createUser = () => {
    if (this.validate()) this.props.create(this.state);
    else console.error('Only non-empty fields accepted');
  };

  render() {
    const {user, pass} = this.state;
    const {eFlag, eMsg} = this.props;

    return (
      <div className="pad">
        <Header size="huge">{this.props.title}</Header>
        <Form>
          <Form.Input
            placeholder="username"
            label="Username"
            name="user"
            value={user}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder="password"
            label="Password"
            name="pass"
            value={pass}
            onChange={this.handleChange}
            type="password"
          />
          <Form.Group>
            <Form.Button onClick={this.loginUser} primary content="Sign In" />
            <Form.Button onClick={this.createUser} content="New User" />
          </Form.Group>
        </Form>
        {eFlag && (
          <Message negative>
            <Message.Header>Account Error</Message.Header>
            <p>{eMsg}</p>
          </Message>
        )}
      </div>
    );
  }
}

export default Login;
