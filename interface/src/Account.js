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
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
  },

  setServerCredentials(user) {
    return fetch(`${Host}/authenticate`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
  },

  getServerCredentials(user) {
    return fetch(`${Host}/authenticate`).then(data => {
      return data.json().then(console.log)
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
