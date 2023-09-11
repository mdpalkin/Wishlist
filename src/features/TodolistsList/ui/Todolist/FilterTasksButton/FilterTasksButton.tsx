import React, { useCallback } from "react"
import { Button } from "@mui/material"
import { useActions } from "common/hooks"
import { FilterValuesType, TodolistDomainType, todolistsActions } from "features/TodolistsList/model/todolist/todolists.reducer"

type Props = { todolist: TodolistDomainType }

export const FilterTasksButton = ({ todolist }: Props) => {

  const { changeTodolistFilter } = useActions(todolistsActions)

  const changeTodolistFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({filter, id: todolist.id})
  }

  const onAllClickHandler = () => changeTodolistFilterHandler('all')

  const onActiveClickHandler = () => changeTodolistFilterHandler('active')

  const onCompletedClickHandler = () => changeTodolistFilterHandler('completed')

  return (
    <>
      <Button
        variant={todolist.filter === "all" ? "outlined" : "text"}
        onClick={onAllClickHandler}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={onActiveClickHandler}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={onCompletedClickHandler}
        color={"secondary"}
      >
        Completed
      </Button>
    </>
  )
}
