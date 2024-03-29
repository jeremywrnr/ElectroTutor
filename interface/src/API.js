/**
 * Authenticated Method Collection
 */

import Config from './Config.js';

class API {
  constructor(auth) {
    this.auth = auth;
  }

  configure() {
    return this.fetchUser().then(user => (this.user = user));
  }

  // Main method for interacting with the rails server.

  authFetch = (route, method = 'GET', body = undefined) => {
    if (route !== 'users' && this.auth === undefined) {
      //Account.clearLocal(); // no auth or db reseeded
      return;
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

    return fetch(`${Config.rails}/${route}`, message)
      .then(res => res.json())
      .catch(console.warn);
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

  fetchTestUnlock = (tut, pos) => {
    return this.authFetch(`test_unlock?tutorial_id=${tut}&position=${pos}`);
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

  fetchIdents = (code = '') => {
    return this.authFetch(`show_vars`, 'POST', {code});
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

  postTVolt = (code = '') => {
    return this.authFetch(`compile`, 'POST', {code, task: 'voltage'});
  };

  postTFreq = (code = '') => {
    return this.authFetch(`compile`, 'POST', {code, task: 'frequency'});
  };

  postTCode = (code = '', idents) => {
    return this.authFetch(`measure`, 'POST', {code, idents});
  };

  postAutoCode = file => {
    return this.authFetch(`autoupload`, 'POST', {file});
  };
}

export default API;
