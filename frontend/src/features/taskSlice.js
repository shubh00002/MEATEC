import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient';

export const fetchTasks = createAsyncThunk('tasks/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get('/tasks');
    return res.data;
  } catch (err) {
    return rejectWithValue('Failed to load tasks');
  }
});

export const addTask = createAsyncThunk('tasks/add', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post('/tasks', data);
    return res.data;
  } catch {
    return rejectWithValue('Failed to add task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/tasks/${id}`, updates);
    return res.data;
  } catch {
    return rejectWithValue('Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/tasks/${id}`);
    return id;
  } catch {
    return rejectWithValue('Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, s => { s.loading = true; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addTask.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateTask.fulfilled, (s, a) => {
        const i = s.items.findIndex(t => t.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.items = s.items.filter(t => t.id !== a.payload);
      });
  }
});

export default taskSlice.reducer;
