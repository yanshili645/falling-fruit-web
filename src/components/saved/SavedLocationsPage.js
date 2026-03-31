import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

import {
  fetchLists,
  fetchLocationsForList,
  removeLocationFromList,
} from '../../redux/saveSlice'
import { BackButton } from '../ui/ActionButtons'
import { Page } from '../ui/PageTemplate'

const LocationList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const LocationItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`

const LocationLink = styled(Link)`
  color: ${({ theme }) => theme.blue} !important;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const ScientificName = styled.span`
  font-style: italic;
`

const CommonName = styled.span`
  font-weight: bold;
`

const Address = styled.span`
  color: ${({ theme }) => theme.secondaryText};
  margin-left: 0.5rem;
`

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: 1px solid ${({ theme }) => theme.secondaryText};
  border-radius: 4px;
  color: ${({ theme }) => theme.secondaryText};
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  margin-left: 1rem;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: ${({ theme }) => theme.red ?? '#c0392b'};
    color: ${({ theme }) => theme.red ?? '#c0392b'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const LocationTypesList = ({ location, typesAccess }) => {
  const typeElements = (location.type_ids || []).map((typeId, idx) => {
    const type = typesAccess.getType(typeId)
    if (!type) {
      return <span key={idx}>{typeId}</span>
    }
    if (type.commonName) {
      return <CommonName key={idx}>{type.commonName}</CommonName>
    }
    if (type.scientificName) {
      return <ScientificName key={idx}>{type.scientificName}</ScientificName>
    }
    return <span key={idx}>{typeId}</span>
  })

  const typesWithSeparators = typeElements.reduce((prev, curr, idx) => {
    if (prev.length) {
      return [...prev, <span key={`sep-${idx}`}>, </span>, curr]
    }
    return [curr]
  }, [])

  return (
    <LocationLink to={`/locations/${location.id}`}>
      {typesWithSeparators.length > 0 ? typesWithSeparators : location.id}
    </LocationLink>
  )
}

const SavedLocationsPage = () => {
  const dispatch = useDispatch()
  const { listId } = useParams()
  const parsedListId = parseInt(listId, 10)

  const {
    lists,
    isLoading,
    currentListLocations,
    isLoadingLocations,
    loadingLists,
  } = useSelector((state) => state.save)

  const { typesAccess } = useSelector((state) => state.type)

  useEffect(() => {
    dispatch(fetchLists())
  }, [dispatch])

  const currentList = lists.find((l) => l.listId === parsedListId)

  useEffect(() => {
    if (currentList && currentList.locationIds.length > 0) {
      dispatch(fetchLocationsForList({ locationIds: currentList.locationIds }))
    }
  }, [dispatch, currentList])

  const handleRemove = (locationId) => {
    dispatch(removeLocationFromList({ listId: parsedListId, locationId }))
  }

  const isListBusy = !!loadingLists[parsedListId]

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
        <LocationList>
          {(currentListLocations || []).map((location) => (
            <LocationItem key={location.id}>
              <LocationInfo>
                <LocationTypesList
                  location={location}
                  typesAccess={typesAccess}
                />
                {location.address && <Address>{location.address}</Address>}
              </LocationInfo>
              <RemoveButton
                onClick={() => handleRemove(location.id)}
                disabled={isListBusy}
                aria-label={`Remove location ${location.id} from list`}
              >
                <TrashIcon />
                Remove
              </RemoveButton>
            </LocationItem>
          ))}
        </LocationList>
      )}
    </Page>
  )
}

export default SavedLocationsPage
