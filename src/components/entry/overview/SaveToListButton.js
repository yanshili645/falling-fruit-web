import {
  BookmarkAlt,
  BookmarkPlus,
  Check,
  Plus,
} from '@styled-icons/boxicons-regular'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import {
  getListsForLocation,
  toggleLocationInList,
} from '../../../utils/locationLists'
import Button from '../../ui/Button'

const LISTS = ['Favourites', 'Want to visit', 'Grafted in 2025']

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
`

const ListItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
  text-align: left;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    flex-shrink: 0;
    color: ${({ checked }) => (checked ? '#4caf50' : '#aaa')};
  }
`

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid #eee;
`

const AddNewItem = styled(ListItem)`
  color: #555;
  font-style: italic;
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
        leftIcon={isSavedToAny ? <BookmarkAlt /> : <BookmarkPlus />}
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
                {checked ? <Check size={16} /> : <BookmarkAlt size={16} />}
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
