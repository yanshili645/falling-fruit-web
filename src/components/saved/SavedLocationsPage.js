import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { fetchLists, fetchLocationsForList } from '../../redux/saveSlice'
import { BackButton } from '../ui/ActionButtons'
import { Page } from '../ui/PageTemplate'

const SavedLocationsPage = () => {
  const dispatch = useDispatch()
  const { listId } = useParams()
  const parsedListId = parseInt(listId, 10)

  const { lists, isLoading, currentListLocations, isLoadingLocations } =
    useSelector((state) => state.save)

  useEffect(() => {
    dispatch(fetchLists())
  }, [dispatch])

  const currentList = lists.find((l) => l.listId === parsedListId)

  useEffect(() => {
    if (currentList && currentList.locationIds.length > 0) {
      dispatch(fetchLocationsForList({ locationIds: currentList.locationIds }))
    }
  }, [dispatch, currentList])

  if (isLoading) {
    return (
      <Page>
        <p>Loading...</p>
      </Page>
    )
  }

  if (!currentList) {
    return (
      <Page>
        <BackButton backPath="/lists" />
        <p>List not found.</p>
      </Page>
    )
  }

  return (
    <Page>
      <BackButton backPath="/lists" />
      <h1>Saved locations: {currentList.name}</h1>

      {isLoadingLocations ? (
        <p>Loading locations...</p>
      ) : currentList.locationIds.length === 0 ? (
        <p>No locations saved in this list.</p>
      ) : (
        <pre>{JSON.stringify(currentListLocations, null, 2)}</pre>
      )}
    </Page>
  )
}

export default SavedLocationsPage
