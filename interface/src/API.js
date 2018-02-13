/**
 * Authenticated Method Collection
 */

import Host from './Host.js'

class API {
  constructor(auth) {
    this.auth = auth
    this.fetchUser().then(user => this.user = user)
  }

  authFetch = (route, method = "GET", body = undefined) => {
    const headers = new Headers({
      'Authorization': this.auth,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })

    let message = {
      method,
      headers,
    }

    if (body !== undefined) {
      message.body = JSON.stringify(body)
    }

    return fetch(`${Host}/${route}`, message)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
  }

  fetchUser = () => {
    return this.authFetch(`users`)
  }

  fetchTutorials = () => {
    return this.authFetch(`tutorials`)
  }

  // TODO add a count-limiting return to this
  fetchTutorial = tutorial => {
    return this.authFetch(`tutorials/${tutorial}`)
  }

  fetchProgress = (tutorial) => {
    return this.authFetch(`prog?user_id=${this.user.id}&tutorial_id=${tutorial}`)
  }

  fetchStep = step => {
    return this.authFetch(`steps/${step}`)
  }

  fetchTest = test => {
    return this.authFetch(`test?step_id=${test}`)
  }

  fetchData = data => {
    return this.authFetch(`pdata/${data}`)
  }


  /**
   * Interface handlers
   */

  patchUser = ({ current_tutorial }) => {
    return this.authFetch(`users/${this.user.id}`, "PATCH", { current_tutorial })
  }

  patchTutorial = tutorial => {
    console.log(tutorial)
  }

  patchStep = step => {
    console.log(step)
  }

  postCompile = (data, handler) => {
    fetch(`${Host}/compile`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
  }
}

export default API