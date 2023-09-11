import React, { ChangeEvent } from "react"
import { Checkbox, IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { TaskType } from "features/TodolistsList/api/todolists.api"
import { EditableSpan } from "common/components"
import { TaskStatuses } from "common/enums"
import { useActions } from "common/hooks"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks.reducer"
import s from 'features/TodolistsList/ui/Todolist/Tasks/Task/Task.module.css'

type Props = {
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo(({task, todolistId}: Props) => {

  const {removeTask, updateTask} = useActions(tasksThunks)

  const removeTaskHandler = () => {
    removeTask({taskId: task.id, todolistId: todolistId})
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked  ? TaskStatuses.Completed : TaskStatuses.New
      updateTask({domainModel: {
          status: newIsDoneValue
        }, taskId: task.id, todolistId: todolistId})
  }

  const titleChangeHandler = (title: string) => {
      updateTask({taskId: task.id, domainModel: { title }, todolistId: todolistId});
    }

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeTaskStatusHandler} />

      <EditableSpan value={task.title} onChange={titleChangeHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
