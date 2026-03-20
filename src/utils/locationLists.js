const STORAGE_KEY = 'location_lists'

/**
 * Returns the full lists map from localStorage.
 * Shape: { [listName]: locationId[] }
 */
const getLists = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Persists the full lists map to localStorage.
 */
const saveLists = (lists) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

/**
 * Returns an array of list names that contain the given locationId.
 */
export const getListsForLocation = (locationId) => {
  const lists = getLists()
  return Object.entries(lists)
    .filter(([, ids]) => ids.includes(locationId))
    .map(([name]) => name)
}

/**
 * Toggles a locationId in/out of a named list.
 * Returns the updated array of list names containing this locationId.
 */
export const toggleLocationInList = (locationId, listName) => {
  const lists = getLists()
  const current = lists[listName] ?? []
  if (current.includes(locationId)) {
    lists[listName] = current.filter((id) => id !== locationId)
  } else {
    lists[listName] = [...current, locationId]
  }
  saveLists(lists)
  return getListsForLocation(locationId)
}

/**
 * Returns all location IDs saved in a given list.
 */
export const getLocationsInList = (listName) => {
  const lists = getLists()
  return lists[listName] ?? []
}

/**
 * Returns all list names.
 */
export const getAllListNames = () => Object.keys(getLists())
