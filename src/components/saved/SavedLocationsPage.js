import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { fetchLists, fetchLocationsForList } from '../../redux/saveSlice'
import { TypesAccess } from '../../utils/localizedTypes'
import { BackButton } from '../ui/ActionButtons'
import { Page } from '../ui/PageTemplate'

const LocationList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const LocationItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
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

  const { lists, isLoading, currentListLocations, isLoadingLocations } =
    useSelector((state) => state.save)

  const typesAccess = useSelector((state) => new TypesAccess(state.type.types))

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
        <LocationList>
          {(currentListLocations || []).map((location) => (
            <LocationItem key={location.id}>
              <LocationTypesList
                location={location}
                typesAccess={typesAccess}
              />
              {location.address && <Address>{location.address}</Address>}
            </LocationItem>
          ))}
        </LocationList>
      )}
    </Page>
  )
}

export default SavedLocationsPage
