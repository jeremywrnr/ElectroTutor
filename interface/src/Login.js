/**
 * Show user signup / login form
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form, Header } from 'semantic-ui-react'

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
  }

  state = {
    name: '',
    pass: '',
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  validate = () => {
    const { name, pass } = this.state
    return name.trim().length > 1 &&
      pass.trim().length > 1
  }

  loginUser = () => {
    const { name, pass } = this.state
    if (this.validate())
      this.props.login({ name, pass })
    else
      console.log('error', { name, pass })
  }

  createUser = () => {
    const { name, pass } = this.state
    if (this.validate())
      this.props.create({ name, pass })
    else
      console.log('error', { name, pass })
  }

  render() {
    const { name, pass } = this.state
    return (
      <Container>
        <Header size='huge'>{this.props.title}</Header>
        <Header>User Information</Header>
        <Form>
          <Form.Input placeholder='username' label='Username' name='name' value={name} onChange={this.handleChange} />
          <Form.Input placeholder='password' label='Password' name='pass' value={pass} onChange={this.handleChange} type='password' />
          <Form.Group>
            <Form.Button onClick={this.loginUser} primary content='Sign In' />
            <Form.Button onClick={this.createUser} content='New User'/>
          </Form.Group>
        </Form>
      </Container>
      )
    }
}

export default Login
