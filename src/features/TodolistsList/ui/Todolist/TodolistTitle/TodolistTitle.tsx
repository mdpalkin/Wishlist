import { EditableSpan } from "common/components"
import { Delete } from "@mui/icons-material"
import React from "react"
import { TodolistDomainType, todolistsThunks } from "features/TodolistsList/model/todolist/todolists.reducer"
import { useActions } from "common/hooks"
import IconButton from "@mui/material/IconButton/IconButton"

type Props = {
  todolist: TodolistDomainType
}

export const TodolistTitle = ({ todolist }: Props) => {

  const {id, entityStatus, title} = todolist

  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)

  const removeTodolistHandler = () => {
    removeTodolist(id)
  }

  const changeTodolistTitleCallback = (title: string) => {
    changeTodolistTitle({ id, title })
  }

  return <>
    <EditableSpan value={title} onChange={changeTodolistTitleCallback} />
    <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>

      <Delete />

    </IconButton>
  </>
}