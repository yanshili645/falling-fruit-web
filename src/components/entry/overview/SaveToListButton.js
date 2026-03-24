import { Bookmark, Plus } from '@styled-icons/boxicons-regular'
import { Bookmark as BookmarkSolid } from '@styled-icons/boxicons-solid'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import {
  getListsForLocation,
  toggleLocationInList,
} from '../../../utils/locationLists'
import Button from '../../ui/Button'
import { theme } from '../../ui/GlobalStyle'

const LISTS = ['Favourites', 'Want to visit', 'Grafted in 2025']

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 100;
  background: ${theme.background};
  border: 1px solid ${theme.secondaryBackground};
  border-radius: 0.375em;
  box-shadow: 0 4px 12px ${theme.shadow};
  min-width: 200px;
  overflow: hidden;
  font-family: ${theme.fonts};
`

const ListItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: ${({ checked }) => (checked ? theme.transparentOrange : 'none')};
  border: none;
  border-bottom: 1px solid ${theme.secondaryBackground};
  cursor: pointer;
  font-size: 0.875rem;
  font-family: ${theme.fonts};
  font-weight: normal;
  color: ${theme.secondaryText};
  text-align: left;
  box-sizing: border-box;

  &:hover {
    background: ${({ checked }) => !checked && theme.transparentBlue};
  }

  svg {
    flex-shrink: 0;
    color: ${({ checked }) => (checked ? theme.orange : theme.tertiaryText)};
  }
`

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid ${theme.secondaryBackground};
`

const AddNewItem = styled(ListItem)`
  color: ${theme.text};
  font-style: italic;
  font-weight: normal;

  svg {
    color: ${theme.tertiaryText};
  }
`

const SaveToListButton = ({ locationId }) => {
  const [open, setOpen] = useState(false)
  const [savedLists, setSavedLists] = useState([])
  const wrapperRef = useRef(null)

  useEffect(() => {
    setSavedLists(getListsForLocation(locationId))
  }, [locationId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleToggle = (listName) => {
    const updated = toggleLocationInList(locationId, listName)
    setSavedLists(updated)
  }

  const handleAddNew = () => {
    alert('Add new list — coming soon!')
  }

  const isSavedToAny = savedLists.length > 0

  return (
    <Wrapper ref={wrapperRef}>
      <Button
        leftIcon={isSavedToAny ? <BookmarkSolid /> : <Bookmark />}
        secondary
        onClick={() => setOpen((o) => !o)}
      >
        {isSavedToAny ? 'Saved' : 'Save'}
      </Button>
      {open && (
        <Dropdown>
          {LISTS.map((listName) => {
            const checked = savedLists.includes(listName)
            return (
              <ListItem
                key={listName}
                checked={checked}
                onClick={() => handleToggle(listName)}
              >
                {checked ? <BookmarkSolid size={16} /> : <Bookmark size={16} />}
                {listName}
              </ListItem>
            )
          })}
          <Divider />
          <AddNewItem onClick={handleAddNew}>
            <Plus size={16} />
            Add new list…
          </AddNewItem>
        </Dropdown>
      )}
    </Wrapper>
  )
}

export default SaveToListButton
