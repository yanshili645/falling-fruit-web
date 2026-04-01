import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { fetchLists } from '../../redux/saveSlice'
import { formatISOString } from '../entry/textFormatters'
import { BackButton } from '../ui/ActionButtons'
import { Page } from '../ui/PageTemplate'

const SavedListsPage = () => {
  const dispatch = useDispatch()
  const { lists, isLoading } = useSelector((state) => state.save)
  const language = navigator.language

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
      <BackButton backPath="/account/edit" />
      <h1>Saved locations</h1>

      {lists.length === 0 ? (
        <p>No lists found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {lists.map((list) => (
            <div
              key={list.listId}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                backgroundColor: '#fff',
              }}
            >
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                {list.name}
              </h2>
              <Link to={`/lists/${list.listId}`}>
                {list.locationIds.length}{' '}
                {list.locationIds.length === 1 ? 'location' : 'locations'}
              </Link>
              <p
                style={{
                  margin: '0.5rem 0 0 0',
                  color: '#888',
                  fontSize: '0.85rem',
                }}
              >
                {`Last updated: ${formatISOString(list.updatedAt ?? list.createdAt, language)}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </Page>
  )
}

export default SavedListsPage
