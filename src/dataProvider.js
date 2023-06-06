class dataProvider {
  constructor() {
    this.apiUrl = "http://localhost:3005/data";
  }

  _fetch(options, additionalPath = "") {
    const apiurl = this.apiUrl + additionalPath;
    return fetch(apiurl, options).then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      return Promise.reject(resp);
    });
  }

  loadData() {
    return this._fetch();
  }

  addTasks(task) {
    const options = {
      method: "PUT",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
    };

    return this._fetch(options, `/${task.id}`);
  }

  submitTask(data) {
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
    return this._fetch(options);
  }
}

export default dataProvider;
