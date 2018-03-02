/**
 * Authenticated Method Collection
 */

import Host from "./Host.js";
const rails = Host.rails;

class API {
  constructor(auth) {
    this.auth = auth;
  }

  configure() {
    return this.fetchUser().then(user => (this.user = user));
  }

  authFetch = (route, method = "GET", body = undefined) => {
    const headers = new Headers({
      Authorization: this.auth,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });

    let message = {
      method,
      headers
    };

    if (body !== undefined) {
      message.body = JSON.stringify(body);
    }

    return fetch(`${rails['rails']}/${route}`, message)
    .then(res => res.json())
    .catch(error => console.error("Error:", error));
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

  fetchProgress = tutorial => {
    return this.authFetch(
      `progresses?user_id=${this.user.id}&tutorial_id=${tutorial}`
    );
  };

  fetchStep = step => {
    return this.stepCheck(step) && this.authFetch(`steps/${step}`);
  };

  fetchTest = step => {
    return this.authFetch(`test?step_id=${step}`);
  };

  fetchData = (prog, tests) => {
    const t_uri = encodeURI(tests.map(t => `&t_ids[]=${t.id}`).join(""));
    if (tests.length) {
      return this.authFetch(`progress_data?progress_id=${prog}${t_uri}`);
    } else {
      return [];
    }
  };

  /**
   * Interface handlers
   */

  patchUser = ({ current_tutorial }) => {
    return this.authFetch(`users/${this.user.id}`, "PATCH", {
      current_tutorial
    });
  };

  patchTutorial = tutorial => {
    return console.log(tutorial);
  };

  patchStep = ({ pid, step_id }) => {
    return (
      this.stepCheck(step_id) &&
        this.authFetch(`progresses/${pid}`, "PATCH", { step_id })
    );
  };

  patchCode = ({ pid, code }) => {
    return this.authFetch(`progresses/${pid}`, "PATCH", { code });
  };

  patchData = ({ id, state }) => {
    return this.authFetch(`progress_data/${id}`, "PATCH", { state });
  };

  postCompile = code => {
    return this.authFetch(`compile`, "POST", { code, task: "c_device" });
  };

  postUpload = code => {
    return this.authFetch(`compile`, "POST", { code, task: "device" });
  };

  /**
   * Parameter helpers
   */

  stepCheck = step => {
    const s = Number(step);
    return typeof s === "number" && Number.isInteger(s);
  };
}

export default API;
