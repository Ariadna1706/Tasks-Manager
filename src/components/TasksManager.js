import React from "react";

class TasksManager extends React.Component {
  apiUrl = "http://localhost:3005/data";
  state = {
    task: "",
    time: 0,
    isRunning: null,
    isDone: null,
    isRemoved: false,
    tasks: [],
  };

  onClick = () => {
    const { tasks } = this.state;
    console.log(tasks);
  };

  changeHandler = (e) => {
    const { task } = this.state;
    this.setState({
      task: e.target.value,
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const { task, time, isRunning, isDone, isRemoved } = this.state;
    const data = {
      name: task,
      time: time,
      isRunning: isRunning,
      isDone: isDone,
      isRemoved: isRemoved,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
    fetch(this.apiUrl, options)
      .then((resp) => console.log(resp))
      .catch((err) => console.error(err))
      .finally(this.renderTasks(this.state.tasks));
  };

  render() {
    const { tasks } = this.state;
    console.log(tasks);

    return (
      <section>
        <h1 onClick={this.onClick}>TasksManager</h1>
        <form onSubmit={this.submitHandler}>
          <input
            onChange={this.changeHandler}
            name="task"
            value={this.state.task}
          ></input>
          <input type="submit"></input>
        </form>
        <>{this.renderTasks(tasks)}</>
      </section>
    );
  }

  renderTasks(tasks) {
    return tasks.map((item) => {
      return (
        <section>
          <header>
            {" "}
            {item.name}, time: {item.time}
          </header>
          <footer>
            <button>start/stop</button>
            <button>zakończone</button>
            <button disabled="true">usuń</button>
          </footer>
        </section>
      );
    });
  }

  componentDidMount() {
    fetch(this.apiUrl)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return Promise.reject(resp);
      })
      .then((object) => {
        this.setState({
          tasks: object,
        });
      })
      .catch((err) => console.error(err));
  }

  componentDidUpdate() {
    /*  return fetch(this.apiUrl)
     .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return Promise.reject(resp);
      })
      .then((object) => {
        this.setState({
          tasks: object,
        });
      })
      .catch((err) => console.error(err));*/
  }
  componentWillUnmount() {}
}

export default TasksManager;
