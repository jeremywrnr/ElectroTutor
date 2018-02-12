/**
 * User Account setup
 */

import Host from './Host.js'

class API {
  constructor(auth) {
    this.auth = auth
  }

  authFetch = (route) => {
    return fetch(`${Host}/${route}`, {
      headers: new Headers({
        'Authorization': this.auth,
        'Content-Type': 'application/json',
      })
    }).then(res => res.json())
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

  fetchProgress = (user, tutorial) => {
    return this.authFetch(`prog?user_id=${user}&tutorial_id=${tutorial}`)
  }

  fetchStep = step => {
    return this.authFetch(`steps/${step}`)
  }

  fetchTest = test => {
    return this.authFetch(`test?step_id=${test}`)
  }

  fetchData = data => {
    return this.authFetch(`/pdata/${data}`)
  }


  /**
   * Interface handlers
   */

  postCompile = (data, handler) => {
    console.info('compiling...')
    fetch(`${Host}/compile`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
  }
}

export default API
