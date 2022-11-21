import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { changeTodo, deleteTodo, deletedApiTodo, updateApiTodo } from "../../app/todoSlice"; //
import "./todoitem.css";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

interface TodoProps {
  id: string;
  title: string;
  desc: string;
  date: string;
  file: string;
  completed: boolean;
}

export function TodoItem({ id, title, desc, date, file, completed }: TodoProps) {
  const todo = useSelector<RootState, any>((state) => state.todo.list);
  const [imageUri, setImageUri] = useState<any>([]);
  const [err, setErr] = useState(false);
  const [uri] = useState('https://kartinkin.net/uploads/posts/2022-02/thumbs/1645896559_19-kartinkin-net-p-dokumenti-kartinki-dlya-prezentatsii-21.jpg')
  const [checked, setChecked] = useState<boolean>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (todo.length > 0) {
      const res = todo.find((item: any) => item.id === id);
      setChecked(res.completed);
    }
  }, [todo]);

  useEffect(() => {
    try {
      getDownloadURL(ref(storage, `images/${file}`))
        .then((url: any) => {
          setImageUri(imageUri.concat(url));
          setErr(false);
        })
        .catch((error) => {
          console.log(error);
          setErr(true);
        });
    } catch (error) {
      console.log(error);
      
    }
  }, [file, imageUri]);

  const handleDelete = () => {
    dispatch(deletedApiTodo(id));
    dispatch(deleteTodo({ id }));
  };

  const handleChecked = () => {
    dispatch(changeTodo({ id }));
    dispatch(updateApiTodo({ id, checked }));
  };

  return (
    <li>
      <Card
        className={
          completed
            ? "card green square border border-success border-3"
            : "card square border border-info border-3"
        }
        style={{ width: "18rem" }}
      >
        {file.endsWith(".jpg" || ".png" || ".jpeg" || ".gif") ? (
          <Card.Img className="h-25" variant="top" src={err ? uri : imageUri[0]} />
        ) : (
          <Card.Img className="h-25" variant="top" src={uri} />
        )}

        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{desc}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item className="cardLink">
            <Form>
              <Form.Check.Input checked={checked ? true : false} onChange={handleChecked} />
            </Form>
          </ListGroup.Item>
          <ListGroup.Item className="cardLink">
            <div>Выполнить задание до: </div>
            {date}
          </ListGroup.Item>
          <ListGroup.Item className="cardLink">
            <div>Скачать: </div>
            <Card.Link href={imageUri[0]}> {file}</Card.Link>
          </ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Button variant="primary" type="submit" onClick={handleDelete}>
            Удалить
          </Button>
        </Card.Body>
      </Card>
    </li>
  );
}
