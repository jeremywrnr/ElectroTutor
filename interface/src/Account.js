/**
 * User Account setup
 */

import Host from './Host.js'

const dataKeyId = "tdtutorial.user.account"

const Account = {

  createUser(user) {
    return fetch(`${Host}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
  },

  setServerCredentials(user) {
    return fetch(`${Host}/authenticate`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
  },

  setLocalCredentials(data) {
    localStorage.setItem(dataKeyId, data)
  },

  getLocalCredentials() {
    return localStorage.getItem(dataKeyId)
  },

  clearLocalCredentials() {
    localStorage.setItem(dataKeyId, undefined)
  },

}

export default Account
