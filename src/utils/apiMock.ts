/**
 * Mock API module that uses localStorage to simulate a backend.
 * All functions are async to match the interface of a real API.
 */

const STORAGE_KEY = 'save_lists'

export interface SavedList {
  name: string
  locationIds: (string | number)[]
}

const DEFAULT_LISTS: SavedList[] = [
  { name: 'Favourites', locationIds: [] },
  { name: 'Want to visit', locationIds: [] },
  { name: 'Grafted in 2025', locationIds: [] },
]

// Small simulated network delay in ms
const SIMULATED_DELAY = 100

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function loadLists(): SavedList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as SavedList[]
    }
  } catch {
    // If parsing fails, fall through to defaults
  }
  return DEFAULT_LISTS
}

function saveLists(lists: SavedList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

/**
 * Fetch all lists.
 */
export async function getLists(): Promise<SavedList[]> {
  await delay(SIMULATED_DELAY)
  return loadLists()
}

/**
 * Add a new named list.
 * No-op if a list with that name already exists.
 * Returns the updated lists.
 */
export async function addList(name: string): Promise<SavedList[]> {
  await delay(SIMULATED_DELAY)
  const lists = loadLists()
  const exists = lists.some((list) => list.name === name)
  if (!exists) {
    lists.push({ name, locationIds: [] })
    saveLists(lists)
  }
  return lists
}

/**
 * Remove a list by name.
 * Returns the updated lists.
 */
export async function removeList(name: string): Promise<SavedList[]> {
  await delay(SIMULATED_DELAY)
  const lists = loadLists().filter((list) => list.name !== name)
  saveLists(lists)
  return lists
}

/**
 * Rename an existing list.
 * No-op if oldName doesn't exist or newName is already taken.
 * Returns the updated lists.
 */
export async function renameList(
  oldName: string,
  newName: string,
): Promise<SavedList[]> {
  await delay(SIMULATED_DELAY)
  const lists = loadLists()
  const target = lists.find((list) => list.name === oldName)
  const nameConflict = lists.some((list) => list.name === newName)
  if (target && !nameConflict) {
    target.name = newName
    saveLists(lists)
  }
  return lists
}

/**
 * Toggle a location in/out of a named list.
 * Adds the locationId if absent; removes it if present.
 * Returns the updated lists.
 */
export async function toggleLocationInList(
  listName: string,
  locationId: string | number,
): Promise<SavedList[]> {
  await delay(SIMULATED_DELAY)
  const lists = loadLists()
  const list = lists.find((l) => l.name === listName)
  if (list) {
    const index = list.locationIds.indexOf(locationId)
    if (index === -1) {
      list.locationIds.push(locationId)
    } else {
      list.locationIds.splice(index, 1)
    }
    saveLists(lists)
  }
  return lists
}

/**
 * Add a location to a named list.
 * No-op if already present.
 * Returns the updated lists.
 */
export async function addLocationToList(
  listName: string,
  locationId: string | number,
): Promise<SavedList[]> {
  await delay(SIMULATED_DELAY)
  const lists = loadLists()
  const list = lists.find((l) => l.name === listName)
  if (list && !list.locationIds.includes(locationId)) {
    list.locationIds.push(locationId)
    saveLists(lists)
  }
  return lists
}

/**
 * Remove a location from a named list.
 * Returns the updated lists.
 */
export async function removeLocationFromList(
  listName: string,
  locationId: string | number,
): Promise<SavedList[]> {
  await delay(SIMULATED_DELAY)
  const lists = loadLists()
  const list = lists.find((l) => l.name === listName)
  if (list) {
    list.locationIds = list.locationIds.filter((id) => id !== locationId)
    saveLists(lists)
  }
  return lists
}

/**
 * Remove a location from every list.
 * Returns the updated lists.
 */
export async function removeLocationFromAllLists(
  locationId: string | number,
): Promise<SavedList[]> {
  await delay(SIMULATED_DELAY)
  const lists = loadLists()
  lists.forEach((list) => {
    list.locationIds = list.locationIds.filter((id) => id !== locationId)
  })
  saveLists(lists)
  return lists
}
