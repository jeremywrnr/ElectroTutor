/**
 * Authenticated Method Collection
 */

import Config from './Config.js';
import Account from './Account.js';

class API {
  constructor(auth) {
    this.auth = auth;
  }

  configure() {
    return this.fetchUser().then(user => (this.user = user));
  }

  authFetch = (route, method = 'GET', body = undefined) => {
    if (route !== 'users' && this.auth === undefined) {
      Account.clearLocalCredentials(); // no auth or db reseeded
    }

    const headers = new Headers({
      Authorization: this.auth,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    let message = {
      method,
      headers,
    };

    if (body !== undefined) {
      message.body = JSON.stringify(body);
    }

    return fetch(`${Config.rails}/${route}`, message).then(res => res.json());
  };

  fetchUser = () => {
    return this.authFetch(`users`);
  };

  fetchTutorials = () => {
    return this.authFetch(`tutorials`);
  };

  fetchTutorial = tutorial => {
    return this.authFetch(`tutorials/${tutorial}`);
  };

  fetchProgress = tut => {
    return this.authFetch(
      `progresses?user_id=${this.user.id}&tutorial_id=${tut}`,
    );
  };

  fetchStep = (tut, pos) => {
    return this.authFetch(`steps?tutorial_id=${tut}&position=${pos}`);
  };

  fetchTest = (tut, pos) => {
    return this.authFetch(`test?tutorial_id=${tut}&position=${pos}`);
  };

  fetchData = (prog, tests) => {
    const t_uri = encodeURI(tests.map(t => `&t_ids[]=${t.id}`).join(''));
    if (tests.length) {
      return this.authFetch(`progress_data?progress_id=${prog}${t_uri}`);
    } else {
      return [];
    }
  };

  /**
   * Interface handlers
   */

  patchUser = ({current_tutorial}) => {
    return this.authFetch(`users/${this.user.id}`, 'PATCH', {
      current_tutorial,
    });
  };

  patchTutorial = tutorial => {
    return console.log(tutorial);
  };

  patchStep = (pid, position) => {
    return this.authFetch(`progresses/${pid}`, 'PATCH', {position});
  };

  patchCode = ({pid, code}) => {
    return this.authFetch(`progresses/${pid}`, 'PATCH', {code});
  };

  patchData = ({id, state}) => {
    return this.authFetch(`progress_data/${id}`, 'PATCH', {state});
  };

  postCompile = code => {
    return this.authFetch(`compile`, 'POST', {code, task: 'compile'});
  };

  postUpload = code => {
    return this.authFetch(`compile`, 'POST', {code, task: 'device'});
  };

  /**
   * Parameter helpers
   */

  posCheck = pos => {
    const p = Number(pos);
    return (typeof p === 'number' && Number.isInteger(p)) || 1;
  };
}

export default API;
