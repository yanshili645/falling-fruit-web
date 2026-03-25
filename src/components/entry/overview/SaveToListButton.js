import {
  Bookmark,
  Bookmark as BookmarkSolid,
} from '@styled-icons/boxicons-solid'
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
`

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid ${theme.secondaryBackground};
`

const AddNewItem = styled(ListItem)`
  text-align: center;
  color: ${theme.headerText};
  font-weight: bold;
`

/**
 * Stacks both label rows on top of each other so the button always
 * reserves space for whichever is wider, regardless of translation.
 * Each row contains the icon + text together so the icon stays snug
 * next to the label text in both states.
 */
const ButtonLabelWrapper = styled.span`
  display: inline-grid;
  justify-items: center;
`

const ButtonLabel = styled.span`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  grid-area: 1 / 1;
`

const SaveToListButton = ({
  locationId,
  saveLabel = 'Save',
  savedLabel = 'Saved',
}) => {
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
      <Button secondary onClick={() => setOpen((o) => !o)}>
        <ButtonLabelWrapper>
          <ButtonLabel visible={!isSavedToAny}>
            <Bookmark size={18} />
            {saveLabel}
          </ButtonLabel>
          <ButtonLabel visible={isSavedToAny}>
            <BookmarkSolid size={18} />
            {savedLabel}
          </ButtonLabel>
        </ButtonLabelWrapper>
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
                {listName}
              </ListItem>
            )
          })}
          <Divider />
          <AddNewItem onClick={handleAddNew}>Add new list</AddNewItem>
        </Dropdown>
      )}
    </Wrapper>
  )
}

export default SaveToListButton
