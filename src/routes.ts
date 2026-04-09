import { RootRoute, Router } from '@tanstack/react-router'
import rootRoute from './routes/root'
import indexRoute from './routes/index'
import placeholderRoutes from './routes/placeholder'

const routeTree = rootRoute.addChildren([indexRoute, ...placeholderRoutes])

export const router = new Router({ routeTree })