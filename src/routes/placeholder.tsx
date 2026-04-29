import { Route } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import CourtStatus from '../pages/CourtStatus'
import Banhang from '../pages/Sale'
import KhoDichVu from '../pages/admin/inventory/InventoryPage.tsx'
import Nhanvien from '../pages/Staff'
import DoanhThu from '../pages/Revenue'
import KhachHang from '../pages/Customer'
import Voucher from '../pages/Voucher'
import BaoTri from '../pages/Maintenance'
import LichDat from '../pages/Lịch đặt/Lichdat'
import DatLichLinhHoat from '../pages/Lịch đặt/DatLichLinhHoat'
import DatLichCongDong from '../pages/Lịch đặt/DatLichCongDong'
import type { Booking } from '../pages/Lịch đặt/LichDatTypes'
import DuyetDon from '../pages/Approval'
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

function LichDatWrapper() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])

  return (
    <LichDat
      onNavigateCommunity={() => navigate({ to: '/dat-lich-cong-dong' })}
      onNavigateSingle={() => navigate({ to: '/dat-lich-linh-hoat' })}
      bookings={bookings}
      setBookings={setBookings}
    />
  )
}

function DatLichLinhHoatWrapper() {
  const navigate = useNavigate()

  return (
    <DatLichLinhHoat
      onBack={() => navigate({ to: '/lich-dat' })}
      onSave={() => navigate({ to: '/lich-dat' })}
    />
  )
}

function DatLichCongDongWrapper() {
  const navigate = useNavigate()

  return (
    <DatLichCongDong
      onBack={() => navigate({ to: '/lich-dat' })}
      onSave={() => navigate({ to: '/lich-dat' })}
    />
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
    component: LichDatWrapper,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/dat-lich-linh-hoat',
    component: DatLichLinhHoatWrapper,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/dat-lich-cong-dong',
    component: DatLichCongDongWrapper,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: '/duyet-don',
    component: DuyetDon,
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