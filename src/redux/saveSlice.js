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

// Thunks that operate on a single list identified by a 'name' arg
const listNameThunks = [addList, removeList]

// Thunks that operate on a single list identified by a 'listName' arg
const listNamedThunks = [
  toggleLocationInList,
  addLocationToList,
  removeLocationFromList,
]

// Thunks that are global (not tied to a single list)
const globalThunks = [fetchLists, removeLocationFromAllLists]

// renameList is special: it affects oldName (and newName after rename)
const saveSlice = createSlice({
  name: 'save',
  initialState: {
    lists: [],
    // Global loading flag for operations not tied to a specific list
    isLoading: false,
    // Per-list loading state: { [listName]: boolean }
    loadingLists: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    // Global thunks: use isLoading
    globalThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isLoading = true
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.isLoading = false
          state.lists = action.payload
        })
        .addCase(thunk.rejected, (state) => {
          state.isLoading = false
        })
    })

    // Thunks keyed by 'name' arg (addList, removeList)
    listNameThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state, action) => {
          const { name } = action.meta.arg
          state.loadingLists[name] = true
        })
        .addCase(thunk.fulfilled, (state, action) => {
          const { name } = action.meta.arg
          state.loadingLists[name] = false
          state.lists = action.payload
        })
        .addCase(thunk.rejected, (state, action) => {
          const { name } = action.meta.arg
          state.loadingLists[name] = false
        })
    })

    // Thunks keyed by 'listName' arg (toggle, add location, remove location)
    listNamedThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state, action) => {
          const { listName } = action.meta.arg
          state.loadingLists[listName] = true
        })
        .addCase(thunk.fulfilled, (state, action) => {
          const { listName } = action.meta.arg
          state.loadingLists[listName] = false
          state.lists = action.payload
        })
        .addCase(thunk.rejected, (state, action) => {
          const { listName } = action.meta.arg
          state.loadingLists[listName] = false
        })
    })

    // renameList: mark oldName as loading, then clear it on completion
    builder
      .addCase(renameList.pending, (state, action) => {
        const { oldName } = action.meta.arg
        state.loadingLists[oldName] = true
      })
      .addCase(renameList.fulfilled, (state, action) => {
        const { oldName } = action.meta.arg
        state.loadingLists[oldName] = false
        state.lists = action.payload
      })
      .addCase(renameList.rejected, (state, action) => {
        const { oldName } = action.meta.arg
        state.loadingLists[oldName] = false
      })
  },
})

export const saveReducer = saveSlice.reducer

export default saveSlice.reducer
