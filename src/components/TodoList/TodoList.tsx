import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { TodoItem } from "../TodoItem";
import "./todolist.css";

export function TodoList() {
  const todo = useSelector<RootState, any>((state) => state.todo.list);
  return (
    <ul className="list">
      {todo.map((item: any) => ( 
        <TodoItem
          key={item.id}
          id={item.id}
          title={item.title}
          desc={item.desc}
          file={item.file}
          date={item.date}
          completed={item.completed}
        />
      ))}
    </ul>
  );
}
