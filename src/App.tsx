import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { AppDispatch, RootState } from "./app/store";
import { addApiTodo, addFile, responseApiTodo } from "./app/todoSlice";
import { TodoList } from "./components/TodoList";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { LoaderPage } from "./components/LoaderPage";

function App() {
  const loading = useSelector<RootState, any>((state) => state.todo.status);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [show, setShow] = useState(false);

  const [fileUpload, setFileUpload] = useState<any>(null);
  const [fileUri, setFileUri] = useState([]);
  const refFile = useRef<any>(null);

  const dispatch = useDispatch<AppDispatch>();

  const fileName = useSelector<RootState, any>((state) => state.todo.file);

  useEffect(() => {
    dispatch(responseApiTodo());
  }, [dispatch]);

  useEffect(() => {
    if (fileName === "" || fileName === null) return;
    setSmShow(true);

    const timer = setInterval(() => {
      dispatch(addFile(""));
      setSmShow(false);
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [fileName]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const file = fileUpload.name;
    try {
      if (
        title === "" ||
        desc === "" ||
        date === "" ||
        refFile.current === null ||
        refFile.current.value === ""
      ) return;

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
    } catch (error) {
      console.error(error);
    }
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
            ref={refFile}
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
      <Modal size="sm" show={smShow} aria-labelledby="example-modal-sizes-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">Delete File</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`file "${fileName}" successful delete`}</Modal.Body>
      </Modal>
      <Modal
        size="sm"
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">Ошибка</Modal.Title>
        </Modal.Header>
        <Modal.Body>Не заполнены обязательные поля"</Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
