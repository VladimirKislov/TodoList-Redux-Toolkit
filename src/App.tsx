import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { AppDispatch, RootState } from "./app/store";
import { addApiTodo,  responseApiTodo } from "./app/todoSlice";
import { TodoList } from "./components/TodoList";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { LoaderPage } from "./components/LoaderPage";

function App() {
  const loading = useSelector<RootState, any>(state => state.todo.status);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");

  const [fileUpload, setFileUpload] = useState<any>(null);
  const [fileUri, setFileUri] = useState([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(responseApiTodo());
  }, [dispatch]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const file = fileUpload.name;
    try {
      dispatch(addApiTodo({ title, desc, date, file }));
      if (fileUpload == null) return;
      const imageRef = ref(storage, `images/${fileUpload.name}`);
      uploadBytes(imageRef, fileUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url: any) => {
            setFileUri(fileUri.concat(url));
          })
          .catch((error) => {
            console.log(error);
          });
      });
      setFileUpload("");
      setTitle("");
      setDate("");
      setDesc("");
    } catch (error) {}
  };

  return (
    <div className="App">
      <Form className="p-5 w-50">
        <h2 className="title h2">Задача:</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Тема</Form.Label>
          <Form.Control
            type="text"
            value={title}
            placeholder="Тема"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Описание</Form.Label>
          <Form.Control
            type="textarea"
            value={desc}
            placeholder="Описание"
            onChange={(e) => setDesc(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Дата завершения</Form.Label>
          <Form.Control
            type="date"
            value={date}
            placeholder="Дата завершения"
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="file"
            onChange={(event: any) => {
              setFileUpload(event.target.files[0]);
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
          Создать Задачу
        </Button>
      </Form>
      {loading === "loading" ? <LoaderPage /> : <TodoList />}
    </div>
  );
}

export default App;
