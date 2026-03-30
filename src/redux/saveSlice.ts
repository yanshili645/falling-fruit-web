import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getLocationsByIds } from '../utils/api'
import {
  addList as apiAddList,
  addLocationToList as apiAddLocationToList,
  getLists,
  removeList as apiRemoveList,
  removeLocationFromAllLists as apiRemoveLocationFromAllLists,
  removeLocationFromList as apiRemoveLocationFromList,
  renameList as apiRenameList,
  SavedList,
  toggleLocationInList as apiToggleLocationInList,
} from '../utils/apiMock'

export interface SaveState {
  lists: SavedList[]
  /** Global loading flag for operations not tied to a specific list */
  isLoading: boolean
  /** Per-list loading state: { [listId]: boolean } */
  loadingLists: Record<number, boolean>
  /** Locations fetched for the currently viewed list */
  currentListLocations: any[]
  /** Loading flag for fetching locations of the current list */
  isLoadingLocations: boolean
}

const initialState: SaveState = {
  lists: [],
  isLoading: false,
  loadingLists: {},
  currentListLocations: [],
  isLoadingLocations: false,
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

// Remove a list by id
// Payload: { listId: number }
export const removeList = createAsyncThunk<SavedList[], { listId: number }>(
  'save/removeList',
  async ({ listId }) => {
    const lists = await apiRemoveList(listId)
    return lists
  },
)

// Rename an existing list
// Payload: { listId: number, newName: string }
export const renameList = createAsyncThunk<
  SavedList[],
  { listId: number; newName: string }
>('save/renameList', async ({ listId, newName }) => {
  const lists = await apiRenameList(listId, newName)
  return lists
})

// Toggle a location in/out of a list
// Payload: { listId: number, locationId: string | number }
export const toggleLocationInList = createAsyncThunk<
  SavedList[],
  { listId: number; locationId: string | number }
>('save/toggleLocationInList', async ({ listId, locationId }) => {
  const lists = await apiToggleLocationInList(listId, locationId)
  return lists
})

// Add a location to a list
// Payload: { listId: number, locationId: string | number }
export const addLocationToList = createAsyncThunk<
  SavedList[],
  { listId: number; locationId: string | number }
>('save/addLocationToList', async ({ listId, locationId }) => {
  const lists = await apiAddLocationToList(listId, locationId)
  return lists
})

// Remove a location from a list
// Payload: { listId: number, locationId: string | number }
export const removeLocationFromList = createAsyncThunk<
  SavedList[],
  { listId: number; locationId: string | number }
>('save/removeLocationFromList', async ({ listId, locationId }) => {
  const lists = await apiRemoveLocationFromList(listId, locationId)
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

// Fetch full location data for all locationIds in a given list.
// Inefficient: fires one HTTP request per location ID.
// Payload: { locationIds: (string | number)[] }
export const fetchLocationsForList = createAsyncThunk<
  any[],
  { locationIds: (string | number)[] }
>('save/fetchLocationsForList', async ({ locationIds }) => {
  const locations = await getLocationsByIds(locationIds)
  return locations
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
    builder.addCase(addList.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(addList.fulfilled, (state, action) => {
      state.isLoading = false
      state.lists = action.payload
    })
    builder.addCase(addList.rejected, (state) => {
      state.isLoading = false
    })

    // removeList
    builder.addCase(removeList.pending, (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    })
    builder.addCase(removeList.fulfilled, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    })
    builder.addCase(removeList.rejected, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
    })

    // renameList
    builder.addCase(renameList.pending, (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    })
    builder.addCase(renameList.fulfilled, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    })
    builder.addCase(renameList.rejected, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
    })

    // toggleLocationInList
    builder.addCase(toggleLocationInList.pending, (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    })
    builder.addCase(toggleLocationInList.fulfilled, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    })
    builder.addCase(toggleLocationInList.rejected, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
    })

    // addLocationToList
    builder.addCase(addLocationToList.pending, (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    })
    builder.addCase(addLocationToList.fulfilled, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    })
    builder.addCase(addLocationToList.rejected, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
    })

    // removeLocationFromList
    builder.addCase(removeLocationFromList.pending, (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    })
    builder.addCase(removeLocationFromList.fulfilled, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    })
    builder.addCase(removeLocationFromList.rejected, (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
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

    // fetchLocationsForList
    builder.addCase(fetchLocationsForList.pending, (state) => {
      state.isLoadingLocations = true
      state.currentListLocations = []
    })
    builder.addCase(fetchLocationsForList.fulfilled, (state, action) => {
      state.isLoadingLocations = false
      state.currentListLocations = action.payload
    })
    builder.addCase(fetchLocationsForList.rejected, (state) => {
      state.isLoadingLocations = false
    })
  },
})

export const saveReducer = saveSlice.reducer

export default saveSlice.reducer
