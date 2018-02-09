/**
 * user account setup
 */

import Host from './Host.js'

const dataKeyId = "tdtutorial.user.account"

const Account = {

  setServerCredentials(user, cb) {
    return fetch(`${Host}/authenticate`).then(data => {
      return data.json().then(console.log)
    })
  },

  getServerCredentials(user, cb) {
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
