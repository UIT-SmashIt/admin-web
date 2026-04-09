import { Outlet, RootRoute } from '@tanstack/react-router'
import MainLayout from '../layouts/MainLayout'

const rootRoute = new RootRoute({
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
})

export default rootRoute