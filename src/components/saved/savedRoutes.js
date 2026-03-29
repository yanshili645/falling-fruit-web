import { Route } from 'react-router-dom'

import SavedListsPage from './SavedListsPage'
import SavedLocationsPage from './SavedLocationsPage'

const pages = [
  {
    path: ['/lists'],
    component: SavedListsPage,
  },
  {
    path: ['/lists/:listId'],
    component: SavedLocationsPage,
  },
]

const savedRoutes = [
  ...pages.map((props) => <Route key={props.path[0]} {...props} />),
]

export default savedRoutes
