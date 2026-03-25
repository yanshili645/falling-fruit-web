import { createSlice } from '@reduxjs/toolkit'

const DEFAULT_LISTS = [
  { name: 'Favourites', locationIds: [] },
  { name: 'Want to visit', locationIds: [] },
  { name: 'Grafted in 2025', locationIds: [] },
]

export const saveSlice = createSlice({
  name: 'save',
  initialState: {
    lists: DEFAULT_LISTS,
  },
  reducers: {
    /**
     * Add a new named list.
     * Payload: { name: string }
     * No-op if a list with that name already exists.
     */
    addList: (state, action) => {
      const { name } = action.payload
      const exists = state.lists.some((list) => list.name === name)
      if (!exists) {
        state.lists.push({ name, locationIds: [] })
      }
    },

    /**
     * Remove a list by name.
     * Payload: { name: string }
     */
    removeList: (state, action) => {
      const { name } = action.payload
      state.lists = state.lists.filter((list) => list.name !== name)
    },

    /**
     * Rename an existing list.
     * Payload: { oldName: string, newName: string }
     * No-op if oldName doesn't exist or newName is already taken.
     */
    renameList: (state, action) => {
      const { oldName, newName } = action.payload
      const target = state.lists.find((list) => list.name === oldName)
      const nameConflict = state.lists.some((list) => list.name === newName)
      if (target && !nameConflict) {
        target.name = newName
      }
    },

    /**
     * Toggle a location in/out of a named list.
     * Payload: { listName: string, locationId: string | number }
     * Adds the locationId if absent; removes it if present.
     */
    toggleLocationInList: (state, action) => {
      const { listName, locationId } = action.payload
      const list = state.lists.find((l) => l.name === listName)
      if (!list) {return}
      const index = list.locationIds.indexOf(locationId)
      if (index === -1) {
        list.locationIds.push(locationId)
      } else {
        list.locationIds.splice(index, 1)
      }
    },

    /**
     * Add a location to a named list.
     * Payload: { listName: string, locationId: string | number }
     * No-op if already present.
     */
    addLocationToList: (state, action) => {
      const { listName, locationId } = action.payload
      const list = state.lists.find((l) => l.name === listName)
      if (list && !list.locationIds.includes(locationId)) {
        list.locationIds.push(locationId)
      }
    },

    /**
     * Remove a location from a named list.
     * Payload: { listName: string, locationId: string | number }
     */
    removeLocationFromList: (state, action) => {
      const { listName, locationId } = action.payload
      const list = state.lists.find((l) => l.name === listName)
      if (list) {
        list.locationIds = list.locationIds.filter((id) => id !== locationId)
      }
    },

    /**
     * Remove a location from every list.
     * Payload: { locationId: string | number }
     */
    removeLocationFromAllLists: (state, action) => {
      const { locationId } = action.payload
      state.lists.forEach((list) => {
        list.locationIds = list.locationIds.filter((id) => id !== locationId)
      })
    },
  },
})

export const {
  addList,
  removeList,
  renameList,
  toggleLocationInList,
  addLocationToList,
  removeLocationFromList,
  removeLocationFromAllLists,
} = saveSlice.actions

// --- Selectors ---

/** Returns all lists. */
export const selectAllLists = (state) => state.save.lists

/** Returns all list names. */
export const selectAllListNames = (state) => state.save.lists.map((l) => l.name)

/** Returns the locationIds for a given list name. */
export const selectLocationsInList = (listName) => (state) =>
  state.save.lists.find((l) => l.name === listName)?.locationIds ?? []

/** Returns the names of all lists that contain the given locationId. */
export const selectListsForLocation = (locationId) => (state) =>
  state.save.lists
    .filter((l) => l.locationIds.includes(locationId))
    .map((l) => l.name)

/** Returns true if the given locationId is in at least one list. */
export const selectIsLocationSaved = (locationId) => (state) =>
  state.save.lists.some((l) => l.locationIds.includes(locationId))

export default saveSlice.reducer
