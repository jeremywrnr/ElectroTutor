/**
 * User Account setup
 */

import Config from './Config.js';

const headers = new Headers({'Content-Type': 'application/json'});
const dataKeyId = 'tdtutorial.user.account';

const Account = {
  createUser(user) {
    return fetch(`${Config.rails}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers,
    }); // returns raw response w/ 'ok' field
  },

  setServerCredentials(user) {
    return fetch(`${Config.rails}/user_token`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers,
    });
  },

  setLocalCredentials(data) {
    localStorage.setItem(dataKeyId, data);
  },

  getLocalCredentials() {
    return localStorage.getItem(dataKeyId);
  },

  clearLocalCredentials() {
    localStorage.removeItem(dataKeyId);
  },
};

export default Account;
