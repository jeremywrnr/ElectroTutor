/**
 * User Account setup
 */

import Host from './Host.js'

const headers = new Headers({ 'Content-Type': 'application/json' })
const dataKeyId = "tdtutorial.user.account"
// TODO generalize to include tutorial data
//const dataKeyId2 = "tdtutorial.user.account"

const Account = {

  createUser(user) {
    return fetch(`${Host}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers,
    }) // returns raw response w/ 'ok' field
  },

  setServerCredentials(user) {
    return fetch(`${Host}/user_token`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers,
    }).then(response => response.json())
  },

  setLocalCredentials(data) {
    localStorage.setItem(dataKeyId, data)
  },

  getLocalCredentials() {
    return localStorage.getItem(dataKeyId)
  },

  clearLocalCredentials() {
    localStorage.removeItem(dataKeyId)
  },

}

export default Account
