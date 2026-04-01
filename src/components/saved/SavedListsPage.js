import { Check, X } from '@styled-icons/boxicons-regular'
import { Pencil, Trash } from '@styled-icons/boxicons-solid'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { fetchLists, removeList, renameList } from '../../redux/saveSlice'
import { formatISOString } from '../entry/textFormatters'
import { BackButton } from '../ui/ActionButtons'
import { theme } from '../ui/GlobalStyle'
import Input from '../ui/Input'
import { Page } from '../ui/PageTemplate'

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 0.5rem 0;
`

const ListName = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
`

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: ${({ color }) => color || theme.secondaryText};
  flex-shrink: 0;

  &:hover {
    background: ${theme.secondaryBackground};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 0.5rem 0;
`

const EditInput = styled(Input)`
  flex: 1;
  height: 34px;
  font-size: 1rem;
  font-weight: bold;
`

const ConfirmDeleteRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: ${theme.secondaryText};
`

const ConfirmButton = styled.button`
  background: none;
  border: 1px solid
    ${({ danger }) => (danger ? theme.red : theme.secondaryText)};
  border-radius: 4px;
  padding: 2px 10px;
  cursor: pointer;
  font-size: 0.85rem;
  color: ${({ danger }) => (danger ? theme.red : theme.secondaryText)};

  &:hover {
    background: ${({ danger }) =>
      danger ? theme.red : theme.secondaryBackground};
    color: ${({ danger }) => (danger ? '#fff' : theme.headerText)};
  }
`

const ListCard = ({ list, language }) => {
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(list.name)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  const handleEditClick = () => {
    setEditName(list.name)
    setConfirmingDelete(false)
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setEditName(list.name)
  }

  const handleConfirmEdit = () => {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== list.name) {
      dispatch(renameList({ listId: list.listId, newName: trimmed }))
    }
    setEditing(false)
  }

  const handleDeleteClick = () => {
    setEditing(false)
    setConfirmingDelete(true)
  }

  const handleCancelDelete = () => {
    setConfirmingDelete(false)
  }

  const handleConfirmDelete = () => {
    dispatch(removeList({ listId: list.listId }))
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        backgroundColor: '#fff',
      }}
    >
      {editing ? (
        <EditRow>
          <EditInput
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onEnter={handleConfirmEdit}
          />
          <IconButton
            onClick={handleCancelEdit}
            color={theme.red}
            title="Cancel"
          >
            <X />
          </IconButton>
          <IconButton
            onClick={handleConfirmEdit}
            color={theme.green}
            title="Confirm"
          >
            <Check />
          </IconButton>
        </EditRow>
      ) : confirmingDelete ? (
        <ConfirmDeleteRow>
          <span>Delete &ldquo;{list.name}&rdquo;?</span>
          <ConfirmButton danger onClick={handleConfirmDelete}>
            Delete
          </ConfirmButton>
          <ConfirmButton onClick={handleCancelDelete}>Cancel</ConfirmButton>
        </ConfirmDeleteRow>
      ) : (
        <ListHeader>
          <ListName>{list.name}</ListName>
          <IconButton onClick={handleEditClick} title="Rename list">
            <Pencil />
          </IconButton>
          <IconButton
            onClick={handleDeleteClick}
            color={theme.red}
            title="Delete list"
          >
            <Trash />
          </IconButton>
        </ListHeader>
      )}

      {list.locationIds.length > 0 ? (
        <Link to={`/lists/${list.listId}`}>
          {list.locationIds.length}{' '}
          {list.locationIds.length === 1 ? 'location' : 'locations'}
        </Link>
      ) : (
        <span>0 locations</span>
      )}
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
  )
}

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
            <ListCard key={list.listId} list={list} language={language} />
          ))}
        </div>
      )}
    </Page>
  )
}

export default SavedListsPage
