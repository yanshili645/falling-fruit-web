import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import { fetchLists } from '../../redux/saveSlice'
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
  const otherLists = lists.filter((l) => l.listId !== parsedListId)

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
        <p>List not found.</p>
      </Page>
    )
  }

  return (
    <Page>
      <h1>Saved locations: {currentList.name}</h1>

      {otherLists.length > 0 && (
        <nav>
          <h3>Other lists</h3>
          <ul>
            {otherLists.map((list) => (
              <li key={list.listId}>
                <Link to={`/saved/${list.listId}`}>{list.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <h3>Locations</h3>
      {currentList.locationIds.length === 0 ? (
        <p>No locations saved in this list.</p>
      ) : (
        <ul>
          {currentList.locationIds.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      )}
    </Page>
  )
}

export default SavedLocationsPage
