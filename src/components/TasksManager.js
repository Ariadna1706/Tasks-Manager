import React from "react";
import dataProvider from "../dataProvider";

const apiDataProvider = new dataProvider();
class TasksManager extends React.Component {
  state = {
    task: "",
    time: 0,
    isRunning: false,
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

    apiDataProvider
      .submitTask(data)

      .then((resp) => {
        this.setState({ tasks: [...this.state.tasks, resp] });
      })
      .catch((err) => console.error("Error" + err));

    this.setState({
      task: "",
    });
  };

  render() {
    const { tasks } = this.state;

    return (
      <section class="container">
        <h1 onClick={this.onClick}>Today Tasks:</h1>
        <h3>{new Date().toLocaleDateString("en")}</h3>
        <form onSubmit={this.submitHandler}>
          <input
            class="input_field"
            onChange={this.changeHandler}
            name="task"
            value={this.state.task}
          ></input>
          <input class="sumbit_btn" value="+" type="submit"></input>
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
          return null;
        }
       
      })
      .map((task) => {
        if(task.isRemoved){
          return null
        }
        console.log(task);
        return (
          <section class="task_container">
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
                end
              </button>
              <button
                disabled={task.isDone === null ? true : false}
                onClick={() => this.removeTask(task.id)}
              >
                remove
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
          const updateData = {
            ...task,
            isRemoved: true,
          };
          this.updateData(updateData);
          return updateData;
        }
        return task;
      });

      return {
        tasks: newTasks
      };
    });
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
            const updateData = {
              ...task,
              time: task.time + 1,
              isRunning: true,
            };
            this.updateData(updateData);
            return updateData;
          }
          return task;
        });

        return {
          tasks: newTasks,
        };
      });
    }, 1000);
  };

  stopTimer = (id) => {
    this.setState((state) => {
      clearInterval(this.IntervalId);
      const newTasks = state.tasks.map((task) => {
        if (task.id === id) {
          const updateData = { ...task, isRunning: false };
          this.updateData(updateData);
          return updateData;
        }
        return task;
      });

      return {
        tasks: newTasks,
      };
    });
  };

  updateData = (t) => {
    //const { tasks } = this.state;
   // tasks.map((task) => {
      apiDataProvider.addTasks(t).then((resp) => console.log(resp));
  //  });
  };

  componentDidMount() {
    apiDataProvider
      .loadData()
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
