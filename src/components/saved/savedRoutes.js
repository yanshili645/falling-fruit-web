import { Route } from 'react-router-dom'

import SavedLocationsPage from './SavedLocationsPage'

const SavedRoutes = () => (
  <>
    <Route path="/saved/:listId" element={<SavedLocationsPage />} />
  </>
)

export default SavedRoutes
