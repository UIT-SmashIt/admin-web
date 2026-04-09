import { Route } from '@tanstack/react-router'
import Dashboard from '../pages/Dashboard'
import rootRoute from './root'

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
})

export default indexRoute