import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
  addList as apiAddList,
  addLocationToList as apiAddLocationToList,
  getLists,
  removeList as apiRemoveList,
  removeLocationFromAllLists as apiRemoveLocationFromAllLists,
  removeLocationFromList as apiRemoveLocationFromList,
  renameList as apiRenameList,
  toggleLocationInList as apiToggleLocationInList,
} from '../utils/apiMock'

// Fetch all lists from the backend
export const fetchLists = createAsyncThunk('save/fetchLists', async () => {
  const lists = await getLists()
  return lists
})

// Add a new named list
// Payload: { name: string }
export const addList = createAsyncThunk('save/addList', async ({ name }) => {
  const lists = await apiAddList(name)
  return lists
})

// Remove a list by name
// Payload: { name: string }
export const removeList = createAsyncThunk(
  'save/removeList',
  async ({ name }) => {
    const lists = await apiRemoveList(name)
    return lists
  },
)

// Rename an existing list
// Payload: { oldName: string, newName: string }
export const renameList = createAsyncThunk(
  'save/renameList',
  async ({ oldName, newName }) => {
    const lists = await apiRenameList(oldName, newName)
    return lists
  },
)

// Toggle a location in/out of a named list
// Payload: { listName: string, locationId: string | number }
export const toggleLocationInList = createAsyncThunk(
  'save/toggleLocationInList',
  async ({ listName, locationId }) => {
    const lists = await apiToggleLocationInList(listName, locationId)
    return lists
  },
)

// Add a location to a named list
// Payload: { listName: string, locationId: string | number }
export const addLocationToList = createAsyncThunk(
  'save/addLocationToList',
  async ({ listName, locationId }) => {
    const lists = await apiAddLocationToList(listName, locationId)
    return lists
  },
)

// Remove a location from a named list
// Payload: { listName: string, locationId: string | number }
export const removeLocationFromList = createAsyncThunk(
  'save/removeLocationFromList',
  async ({ listName, locationId }) => {
    const lists = await apiRemoveLocationFromList(listName, locationId)
    return lists
  },
)

// Remove a location from every list
// Payload: { locationId: string | number }
export const removeLocationFromAllLists = createAsyncThunk(
  'save/removeLocationFromAllLists',
  async ({ locationId }) => {
    const lists = await apiRemoveLocationFromAllLists(locationId)
    return lists
  },
)

const saveSlice = createSlice({
  name: 'save',
  initialState: {
    lists: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Helper to handle the common pattern: set lists on fulfilled, toggle loading
    const handlePending = (state) => {
      state.isLoading = true
    }
    const handleFulfilled = (state, action) => {
      state.isLoading = false
      state.lists = action.payload
    }
    const handleRejected = (state) => {
      state.isLoading = false
    }

    const thunks = [
      fetchLists,
      addList,
      removeList,
      renameList,
      toggleLocationInList,
      addLocationToList,
      removeLocationFromList,
      removeLocationFromAllLists,
    ]

    thunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, handlePending)
        .addCase(thunk.fulfilled, handleFulfilled)
        .addCase(thunk.rejected, handleRejected)
    })
  },
})

export const saveReducer = saveSlice.reducer

export default saveSlice.reducer
