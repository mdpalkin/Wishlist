import React, { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { todolistsActions, todolistsThunks } from "features/TodolistsList/model/todolist/todolists.reducer"
import { Grid, Paper } from "@mui/material"
import { AddItemForm } from "common/components"
import { Todolist } from "features/TodolistsList/ui/Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { useActions } from "common/hooks"
import { selectIsLoggedIn } from "features/auth/model/auth.selectors"
import { selectTasks } from "features/TodolistsList/model/tasks/tasks.selectors"
import { selectTodolists } from "features/TodolistsList/model/todolist/todolists.selectors"

export const TodolistsList = () => {
  const todolists = useSelector(selectTodolists);

  const tasks = useSelector(selectTasks);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { fetchTodolists } = useActions(todolistsThunks);

  const { addTodolist } = useActions(todolistsThunks)


  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);


  const addTodolistCallback = useCallback((title: string) => {
    return addTodolist(title).unwrap()
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/Login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
