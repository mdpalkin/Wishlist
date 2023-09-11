import React, { useCallback, useEffect } from "react"
import { TodolistDomainType } from "features/TodolistsList/model/todolist/todolists.reducer"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks.reducer"
import { TaskType } from "features/TodolistsList/api/todolists.api"
import { useActions } from "common/hooks"
import { AddItemForm } from "common/components"
import { FilterTasksButton } from "features/TodolistsList/ui/Todolist/FilterTasksButton/FilterTasksButton"
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks"
import { TodolistTitle } from "features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle"

type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Todolist = React.memo(({ todolist, tasks }: Props) => {

  const { fetchTasks } = useActions(tasksThunks)

  useEffect(() => {
    fetchTasks(todolist.id)
  }, [])

  const { addTask } = useActions(tasksThunks)


  const addTaskCallback = useCallback(function(title: string) {
    return addTask({ title, todolistId: todolist.id }).unwrap()
  }, [])

  return (
    <div>
      <h3>
        <TodolistTitle todolist={todolist} />
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <div>
        <Tasks tasks={tasks} todolist={todolist} />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButton todolist={todolist} />
      </div>
    </div>
  )
})
