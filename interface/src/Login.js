/**
 * Show user signup / login form
 */

import React from 'react';
import { Container, Form, Header } from 'semantic-ui-react'

class Login extends React.Component {
  state = { name: '', pass: '', submittedName: '', submittedPass: '' }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { name, pass } = this.state
    this.setState({ submittedName: name, submittedPass: pass })
  }

  render() {
    const { name, pass, submittedName, submittedPass } = this.state
    return (
      <Container>
        <Header size='huge'>Tutorial</Header>
        <Header>User Information</Header>

        <Form onSubmit={this.handleSubmit}>
          <Form.Input placeholder='username' label='Username' name='name' value={name} onChange={this.handleChange} />
          <Form.Input placeholder='password' label='Password' name='pass' value={pass} type='password' onChange={this.handleChange} />
          <Form.Group>
            <Form.Button primary content='Submit' />
            <Form.Button content='New User'/>
          </Form.Group>
        </Form>

        <strong>onChange:</strong>
        <pre>{JSON.stringify({ name, pass }, null, 2)}</pre>
        <strong>onSubmit:</strong>
        <pre>{JSON.stringify({ submittedName, submittedPass }, null, 2)}</pre>
      </Container>
      )
    }
}

export default Login
