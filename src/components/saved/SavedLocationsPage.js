import { X as XIcon } from '@styled-icons/boxicons-regular'
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
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: red;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover {
    color: darkred;
  }
`

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
                <XIcon size={24} />
              </RemoveButton>
            </LocationItem>
          ))}
        </LocationList>
      )}
    </Page>
  )
}

export default SavedLocationsPage
