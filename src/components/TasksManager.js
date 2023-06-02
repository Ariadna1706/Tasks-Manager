import React from "react";

class TasksManager extends React.Component {
  apiUrl = "http://localhost:3005/data";
  state = {
    task: "",
    time: 0,
    isRunning: false,
    isDone: null,
    isRemoved: false,
    tasks: [],
  };

  updateDatabase = () => {};

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
      .then(() => {
        this.setState({ tasks: [...this.state.tasks, data] });
      })
      .catch((err) => console.error("Error" + err));
    this.setState({
      task: "",
    });
  };

  render() {
    const { tasks } = this.state;

   

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
    return tasks.map((task) => {
      return (
        <section>
          <header>
            {task.name}, time: {task.time}
          </header>
          <footer>
            <button
              onClick={() => {
                task.isRunning === false
                  ? this.startTimer(task.id)
                  : this.stopTimer(task.id);
              }}
            >
              start/stop
            </button>
            <button
              onClick={() => {
                task.isDone === null || task.isRunning === true
                  ? this.endTask(task.id) 
                  : console.log("działa");
              }}
            >
              zakończone
            </button>
            <button  disabled="true">usuń</button>
          </footer>
        </section>
      );
    });
  }

  endTask = (id) => {
    this.stopTimer(id);
    this.setState((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            time: task.time,
            isDone: true,
            isRunning: false,
          };
        }
        return task;
      });

      return {
        tasks: newTasks.sort(function (a, b) {
          if (a.isDone < b.isDone) {
            return 1;
          }
        }),
      };
    });
    this.updateData();
  };

  startTimer = (id) => {
    this.IntervalId = setInterval(() => {
      this.setState((state) => {
        const newTasks = state.tasks.map((task) => {
          if (task.id === id) {
            return { ...task, time: task.time + 1, isRunning: true };
          }
          return task;
        });

        return {
          tasks: newTasks,
        };
      });
    }, 1000);
    this.updateData();
  };

  stopTimer = (id) => {
    this.setState((state) => {
      clearInterval(this.IntervalId);
      const newTasks = state.tasks.map((task) => {
        if (task.id === id) {
          return { ...task, isRunning: false };
        }
        return task;
      });

      return {
        tasks: newTasks,
      };
    });
    this.updateData();
  };

  updateData = () => {
    const { tasks } = this.state;

    tasks.map((task) => {
      const data = {
        name: task.name,
        time: task.time,
        isRunning: task.isRunning,
        isDone: task.isDone,
        isRemoved: task.isRemoved,
      };

      console.log(data);

      const options = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      };

      fetch(`${this.apiUrl}/${task.id}`, options).then((resp) =>
        console.log(resp)
      );
    });
  };

  componentDidMount() {
    fetch(this.apiUrl)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return Promise.reject(resp);
      })
      .then((object) => {
        this.setState({ tasks: object });
      })
      .catch((err) => console.error(err));
  }

  componentDidUpdate() {}
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
}

export default TasksManager;
