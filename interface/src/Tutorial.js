import React, { Component } from 'react'
import { Segment, Button } from 'semantic-ui-react'
import $ from 'jquery' // which press
import TutorialBody from './TutorialBody.js'
import ListSelector from './ListSelector.js'
import API from './API.js'


class Tutorial extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user:      undefined, // id
      tutorial:  undefined, // id
      tutorials: [],        // list
    }
  }

  /**
   * Connect to DB
   */

  componentWillMount() {
    let api = new API(this.props.user_token) // generated from JWT auth
    this.setState({ api })
    api.fetchUser()
    .then(this.handleUserUpdate)
    .then(api.fetchTutorials)
    .then(this.handleTutorialsUpdate)
    .then(() => { // see if user has active tutorial
      if (this.state.user && this.state.user.current_tutorial) {
        const tutorial = this.state.user.current_tutorial
        api.fetchTutorial(tutorial)
        .then(this.handleTutorialUpdate)
      }
    })
  }

  /**
   * Database updates
   */

  handleUserUpdate = user => {
    return this.setState({ user })
  }

  handleTutorialsUpdate = tutorials => {
    return this.setState({ tutorials })
  }

  handleTutorialUpdate = tutorial => {
    return this.setState({ tutorial })
  }

  setTutorial = e => {
    const api = this.state.api
    const tutorial = $(e.target).closest('.ui.card').attr('id') // id
    const update = () => api.patchUser({ current_tutorial: tutorial })
    api.configure()
    .then(update)
    .then(() => api.fetchTutorial(tutorial))
    .then(this.handleTutorialUpdate)
  }

  unsetTutorial = () => {
    const api = this.state.api
    const update = () => api.patchUser({ current_tutorial: '' })
    const remove = () => this.setState({ tutorial: '' })
    api.configure().then(update).then(remove)
  }


  /**
   * Rendering UI
   */

  render() {
    const is_active = !!this.state.user && this.state.tutorial

    return (
      <Segment basic className='full no-pad'>
        {
        is_active
        ?
        <TutorialBody
          logout={this.props.logout}
          unset={this.unsetTutorial}
          tutorial={this.state.tutorial}
          api_auth={this.state.api.auth} />
        :
        <div className='pad'>
          <ListSelector
            title='Choose a Tutorial'
            onClick={this.setTutorial}
            items={this.state.tutorials} />
          <br/>
          <Button onClick={this.props.logout} content='Log Out' />
        </div>
        }
      </Segment>
      )
}
}

export default Tutorial
