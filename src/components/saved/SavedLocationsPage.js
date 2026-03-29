import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import { fetchLists } from '../../redux/saveSlice'
import { BackButton } from '../ui/ActionButtons'
import { Page } from '../ui/PageTemplate'

const SavedLocationsPage = () => {
  const dispatch = useDispatch()
  const { listId } = useParams()
  const parsedListId = parseInt(listId, 10)

  const { lists, isLoading } = useSelector((state) => state.save)

  useEffect(() => {
    dispatch(fetchLists())
  }, [dispatch])

  const currentList = lists.find((l) => l.listId === parsedListId)

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

      {currentList.locationIds.length === 0 ? (
        <p>No locations saved in this list.</p>
      ) : (
        <ul>
          {currentList.locationIds.map((id) => (
            <li key={id}>
              <Link to={`/locations/${id}`}>{id}</Link>
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}

export default SavedLocationsPage
