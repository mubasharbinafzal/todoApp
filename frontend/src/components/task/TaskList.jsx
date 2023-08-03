import axios from 'axios';
import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';

import TaskItem from './TaskItem';
import classes from './TaskList.module.scss';

function TaskList() {
  const [taskList, setTaskList] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingedit, setIsAddingedit] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');

  const [currentTask, setCurrentTask] = useState('');

  const getTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks/mytasks');
      setTaskList(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addNewButtonClick = () => {
    setIsAddingNew(!isAddingNew);
  };
  const editNewButtonClick = () => {
    setIsAddingedit(!isAddingedit);
  };
  const addNewTask = async (e) => {
    e.preventDefault();
    if (newTask.length <= 0) {
      toast.error('Task is empty');
      return;
    }
    try {
      const { data } = await axios.post('/api/tasks/', {
        title: newTask,
      });
      toast.success('New task added');
      setIsAddingNew(false);
      setEditTask('');
      setTaskList([{ ...data }, ...taskList]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      toast.success('Task deleted');
      setTaskList(taskList.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const handleEditTask = async (e) => {
    e.preventDefault();
    console.log(currentTask);
    if (editTask.length <= 0) {
      toast.error('Task is empty');
      return;
    }
    try {
      const { data } = await axios.put(`/api/tasks/${currentTask._id}`, {
        title: editTask,
      });
      toast.success('Updated task');
      setIsAddingedit(false);
      setNewTask('');
      setTaskList([{ ...data }, ...taskList]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className={classes.topBar}>
        <button
          type="button"
          className={classes.addNew}
          onClick={addNewButtonClick}
        >
          Add New
        </button>
      </div>
      {isAddingNew && (
        <form className={classes.addNewForm} onSubmit={addNewTask}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task name"
          />
          <button type="submit">Add</button>
        </form>
      )}

      {isAddingedit && (
        <form className={classes.addNewForm} onSubmit={handleEditTask}>
          <input
            type="text"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            placeholder="Task name"
          />
          <button type="submit">update</button>
        </form>
      )}
      {taskList.length > 0 ? (
        <table className={classes.taskList_table}>
          <tbody>
            {taskList.map((task) => (
              <TaskItem key={task._id} task={task} deleteTask={deleteTask} editNewButtonClick={editNewButtonClick} setCurrentTask = {setCurrentTask}  setEditTask = {setEditTask}/>
            ))}
          </tbody>
        </table>
      ) : (
        'No Task Found. Create a new task'
      )}
    </div>
  );
}

export default TaskList;
