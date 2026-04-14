import { Route } from '@tanstack/react-router'
import CourtStatus from '../pages/CourtStatus'
import Banhang from '../pages/Sale'
import KhoDichVu from '../pages/Inventory'
import Nhanvien from '../pages/Staff'
import DoanhThu from '../pages/Revenue'
import rootRoute from './root'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontSize: 18,
        fontWeight: 500,
        color: '#ccc',
      }}
    >
      {title}
    </div>
  )
}

const placeholderRoutes = [
  new Route({
    getParentRoute: () => rootRoute,
    path: '/trang-thai-san',
    component: CourtStatus,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/ban-hang',
    component: Banhang,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/kho-dich-vu',
    component: KhoDichVu,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/nhan-su',
    component: Nhanvien,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/doanh-thu',
    component: DoanhThu,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/khach-hang',
    component: () => <PlaceholderPage title="Quản lý khách hàng" />,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/voucher',
    component: () => <PlaceholderPage title="Quản lý voucher" />,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/bao-tri',
    component: () => <PlaceholderPage title="Bảo trì" />,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/lich-dat',
    component: () => <PlaceholderPage title="Lịch đặt" />,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/duyet-don',
    component: () => <PlaceholderPage title="Duyệt đơn" />,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/cong-dong',
    component: () => <PlaceholderPage title="Cộng đồng" />,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/thong-tin',
    component: () => <PlaceholderPage title="Thông tin cá nhân" />,
  }),
]

export default placeholderRoutes