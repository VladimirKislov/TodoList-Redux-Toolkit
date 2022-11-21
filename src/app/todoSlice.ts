import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ToDoListType {
  list: Array<ListObj>;
  status: null | string;
  error: null | string;
}

interface ListObj {
  id?: null | string;
  title: null | string;
  desc: null | string;
  date: null | string;
  file: null | string;
  completed?: boolean;
}

interface UpdateProp {
  id: null | string;
  checked?: boolean;
}

export const responseApiTodo: any = createAsyncThunk("todo/responseApiTodo", async function () {
  try {
    const response = await axios
      .post("https://back-api-bank.herokuapp.com/api/todo", {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        return res.data.payload;
      });
    return response;
  } catch (error) {
    console.log(error);
  }
});

export const deletedApiTodo: any = createAsyncThunk(
  "todo/responseApiTodo",
  async function (id: any, { dispatch, rejectWithValue }) {
    try {
      await axios.delete("https://back-api-bank.herokuapp.com/api/todo/delete", {
        headers: { "Content-Type": "application/json" },
        data: { id: id },
      });
      dispatch(responseApiTodo());
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addApiTodo: any = createAsyncThunk(
  "todo/responseApiTodo",
  async function ({ title, desc, date, file }: ListObj, { rejectWithValue, dispatch }) {
    try {
      const response = await axios
        .post("https://back-api-bank.herokuapp.com/api/todo/add", {
          headers: { "Content-Type": "application/json" },
          id: nanoid(),
          title: title,
          desc: desc,
          date: date,
          file: file,
          completed: false,
        });
      dispatch(addTodo(response.data));
      dispatch(responseApiTodo());
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateApiTodo: any = createAsyncThunk(
  "todo/responseApiTodo",
  async function ({ id, checked }: UpdateProp, { rejectWithValue }) {
    try {
      await axios.post("https://back-api-bank.herokuapp.com/api/todo/update", {
        headers: {
          "Content-Type": "application/json"
        },
        id: id,
        completed: !checked,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const setError = (state: any, action: any) => {
  state.status = "rejected";
  state.error = action.payload;
};

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    list: [],
    status: null,
    error: null,
  } as ToDoListType,
  reducers: {
    addTodo(state, action) {
      state.list.push({
        id: action.payload.id,
        title: action.payload.title,
        desc: action.payload.desc,
        date: action.payload.date,
        file: action.payload.file,
        completed: action.payload.completed,
      });
    },
    deleteTodo(state, action) {
      state.list = state.list.filter((item) => item.id !== action.payload.id);
    },
    changeTodo(state, action) {
      const changeCompleted: ListObj | any = state.list.find((item) => item.id === action.payload.id);
      changeCompleted.completed = !changeCompleted.completed;
    },
  },
  extraReducers: {
    [responseApiTodo.pending]: (state) => {
      state.status = "loading";
      state.error = null;
    },

    [responseApiTodo.fulfilled]: (state, action) => {
      state.status = "resoved";
      if (action.payload !== undefined) state.list = action.payload;
    },

    [responseApiTodo.rejected]: setError,
    [deletedApiTodo.rejected]: setError,
    [addApiTodo.rejected]: setError,
    [updateApiTodo.rejected]: setError,
  },
});

export const { addTodo, deleteTodo, changeTodo } = todoSlice.actions;
export default todoSlice.reducer;
