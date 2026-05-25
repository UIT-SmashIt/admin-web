import { Route } from '@tanstack/react-router'
import CourtStatus from '../pages/admin/court/CourtStatus.tsx'
import KhoDichVu from '../pages/admin/inventory/InventoryPage.tsx'
import Nhanvien from '../pages/admin/schedule/Staff.tsx'
import DoanhThu from '../pages/Revenue'
import KhachHang from '../pages/Customer'
import Voucher from '../pages/Voucher'
import BaoTri from '../pages/admin/maintenance/MaintenancePage.tsx'
import BookingPage from '../pages/admin/booking/BookingPage'
import CongDong from '../pages/Community'
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

function BookingPageWrapper() {
  return <BookingPage />
}

const placeholderRoutes = [
  new Route({
    getParentRoute: () => rootRoute,
    path: '/trang-thai-san',
    component: CourtStatus,
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
    component: KhachHang,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/voucher',
    component: Voucher,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/bao-tri',
    component: BaoTri,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/lich-dat',
    component: BookingPageWrapper,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/cong-dong',
    component: CongDong,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/thong-tin',
    component: () => <PlaceholderPage title="Thông tin cá nhân" />,
  }),
]

export default placeholderRoutes