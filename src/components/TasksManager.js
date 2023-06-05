import React from "react";

class TasksManager extends React.Component {
  apiUrl = "http://localhost:3005/data";
  state = {
    id: "",
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
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return Promise.reject(resp);
      })
      .then((resp) => {
        this.setState({ tasks: [...this.state.tasks, resp] });
      })
      .catch((err) => console.error("Error" + err));

    this.setState({
      task: "",
    });
    this.updateData();
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
    console.log(tasks);
    return [...tasks]
      .sort((a, b) => {
        if (a.isDone < b.isDone) {
          return -1;
        }
      })
      .map((task) => {
        console.log(task);
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
                  if (task.isDone === null || task.isRunning === true) {
                    this.endTask(task.id);
                  }
                }}
              >
                zakończone
              </button>
              <button
                disabled={task.isDone === null ? true : false}
                onClick={() => this.removeTask(task.id)}
              >
                usuń
              </button>
            </footer>
          </section>
        );
      });
  }

  removeTask = (id) => {
    this.setState((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            isRemoved: true,
          };
        }
        return task;
      });

      return {
        tasks: newTasks.filter(function (task) {
          return task.isRemoved !== true;
        }),
      };
    });
    this.updateData()
  };

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
        tasks: newTasks,
      };
    });
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
        id: task.id,
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
        this.setState({
          tasks: object.filter(function (task) {
            return task.isRemoved !== true;
          }),
        });
      })
      .catch((err) => console.error(err));
  }


  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
}

export default TasksManager;
