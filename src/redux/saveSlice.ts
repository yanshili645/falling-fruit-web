import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { addList as apiAddList,
  addLocationToList as apiAddLocationToList,
  getLists,
  removeList as apiRemoveList,
  removeLocationFromAllLists as apiRemoveLocationFromAllLists,
  removeLocationFromList as apiRemoveLocationFromList,
  renameList as apiRenameList,
SavedList ,
  toggleLocationInList as apiToggleLocationInList,
} from '../utils/apiMock'

export interface SaveState {
  lists: SavedList[]
  /** Global loading flag for operations not tied to a specific list */
  isLoading: boolean
  /** Per-list loading state: { [listName]: boolean } */
  loadingLists: Record<string, boolean>
}

const initialState: SaveState = {
  lists: [],
  isLoading: false,
  loadingLists: {},
}

// Fetch all lists from the backend
export const fetchLists = createAsyncThunk<SavedList[]>(
  'save/fetchLists',
  async () => {
    const lists = await getLists()
    return lists
  },
)

// Add a new named list
// Payload: { name: string }
export const addList = createAsyncThunk<SavedList[], { name: string }>(
  'save/addList',
  async ({ name }) => {
    const lists = await apiAddList(name)
    return lists
  },
)

// Remove a list by name
// Payload: { name: string }
export const removeList = createAsyncThunk<SavedList[], { name: string }>(
  'save/removeList',
  async ({ name }) => {
    const lists = await apiRemoveList(name)
    return lists
  },
)

// Rename an existing list
// Payload: { oldName: string, newName: string }
export const renameList = createAsyncThunk<
  SavedList[],
  { oldName: string; newName: string }
>('save/renameList', async ({ oldName, newName }) => {
  const lists = await apiRenameList(oldName, newName)
  return lists
})

// Toggle a location in/out of a named list
// Payload: { listName: string, locationId: string | number }
export const toggleLocationInList = createAsyncThunk<
  SavedList[],
  { listName: string; locationId: string | number }
>('save/toggleLocationInList', async ({ listName, locationId }) => {
  const lists = await apiToggleLocationInList(listName, locationId)
  return lists
})

// Add a location to a named list
// Payload: { listName: string, locationId: string | number }
export const addLocationToList = createAsyncThunk<
  SavedList[],
  { listName: string; locationId: string | number }
>('save/addLocationToList', async ({ listName, locationId }) => {
  const lists = await apiAddLocationToList(listName, locationId)
  return lists
})

// Remove a location from a named list
// Payload: { listName: string, locationId: string | number }
export const removeLocationFromList = createAsyncThunk<
  SavedList[],
  { listName: string; locationId: string | number }
>('save/removeLocationFromList', async ({ listName, locationId }) => {
  const lists = await apiRemoveLocationFromList(listName, locationId)
  return lists
})

// Remove a location from every list
// Payload: { locationId: string | number }
export const removeLocationFromAllLists = createAsyncThunk<
  SavedList[],
  { locationId: string | number }
>('save/removeLocationFromAllLists', async ({ locationId }) => {
  const lists = await apiRemoveLocationFromAllLists(locationId)
  return lists
})

const saveSlice = createSlice({
  name: 'save',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchLists
    builder.addCase(fetchLists.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchLists.fulfilled, (state, action) => {
      state.isLoading = false
      state.lists = action.payload
    })
    builder.addCase(fetchLists.rejected, (state) => {
      state.isLoading = false
    })

    // addList
    builder.addCase(addList.pending, (state, action) => {
      const { name } = action.meta.arg
      state.loadingLists[name] = true
    })
    builder.addCase(addList.fulfilled, (state, action) => {
      const { name } = action.meta.arg
      state.loadingLists[name] = false
      state.lists = action.payload
    })
    builder.addCase(addList.rejected, (state, action) => {
      const { name } = action.meta.arg
      state.loadingLists[name] = false
    })

    // removeList
    builder.addCase(removeList.pending, (state, action) => {
      const { name } = action.meta.arg
      state.loadingLists[name] = true
    })
    builder.addCase(removeList.fulfilled, (state, action) => {
      const { name } = action.meta.arg
      state.loadingLists[name] = false
      state.lists = action.payload
    })
    builder.addCase(removeList.rejected, (state, action) => {
      const { name } = action.meta.arg
      state.loadingLists[name] = false
    })

    // renameList
    builder.addCase(renameList.pending, (state, action) => {
      const { oldName } = action.meta.arg
      state.loadingLists[oldName] = true
    })
    builder.addCase(renameList.fulfilled, (state, action) => {
      const { oldName } = action.meta.arg
      state.loadingLists[oldName] = false
      state.lists = action.payload
    })
    builder.addCase(renameList.rejected, (state, action) => {
      const { oldName } = action.meta.arg
      state.loadingLists[oldName] = false
    })

    // toggleLocationInList
    builder.addCase(toggleLocationInList.pending, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = true
    })
    builder.addCase(toggleLocationInList.fulfilled, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = false
      state.lists = action.payload
    })
    builder.addCase(toggleLocationInList.rejected, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = false
    })

    // addLocationToList
    builder.addCase(addLocationToList.pending, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = true
    })
    builder.addCase(addLocationToList.fulfilled, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = false
      state.lists = action.payload
    })
    builder.addCase(addLocationToList.rejected, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = false
    })

    // removeLocationFromList
    builder.addCase(removeLocationFromList.pending, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = true
    })
    builder.addCase(removeLocationFromList.fulfilled, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = false
      state.lists = action.payload
    })
    builder.addCase(removeLocationFromList.rejected, (state, action) => {
      const { listName } = action.meta.arg
      state.loadingLists[listName] = false
    })

    // removeLocationFromAllLists
    builder.addCase(removeLocationFromAllLists.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(removeLocationFromAllLists.fulfilled, (state, action) => {
      state.isLoading = false
      state.lists = action.payload
    })
    builder.addCase(removeLocationFromAllLists.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const saveReducer = saveSlice.reducer

export default saveSlice.reducer
