import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { fetchLists } from '../../redux/saveSlice'
import { Page } from '../ui/PageTemplate'

const SavedListsPage = () => {
  const dispatch = useDispatch()
  const { lists, isLoading } = useSelector((state) => state.save)

  useEffect(() => {
    dispatch(fetchLists())
  }, [dispatch])

  if (isLoading) {
    return (
      <Page>
        <p>Loading...</p>
      </Page>
    )
  }

  return (
    <Page>
      <h1>Saved locations</h1>

      {lists.length === 0 ? (
        <p>No lists found.</p>
      ) : (
        <ul>
          {lists.map((list) => (
            <li key={list.listId}>
              <Link to={`/lists/${list.listId}`}>{list.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}

export default SavedListsPage
