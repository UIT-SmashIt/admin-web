import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';

// Import your other pages here as you build them:
// import CourtStatus from './pages/CourtStatus';
// import Sales from './pages/Sales';
// ...

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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All authenticated pages share MainLayout */}
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/trang-thai-san" element={<PlaceholderPage title="Trạng thái sân" />} />
          <Route path="/ban-hang" element={<PlaceholderPage title="Bán hàng" />} />
          <Route path="/kho-dich-vu" element={<PlaceholderPage title="Kho & dịch vụ" />} />
          <Route path="/nhan-su" element={<PlaceholderPage title="Quản lý nhân sự" />} />
          <Route path="/doanh-thu" element={<PlaceholderPage title="Doanh thu" />} />
          <Route path="/khach-hang" element={<PlaceholderPage title="Quản lý khách hàng" />} />
          <Route path="/voucher" element={<PlaceholderPage title="Quản lý voucher" />} />
          <Route path="/bao-tri" element={<PlaceholderPage title="Bảo trì" />} />
          <Route path="/lich-dat" element={<PlaceholderPage title="Lịch đặt" />} />
          <Route path="/duyet-don" element={<PlaceholderPage title="Duyệt đơn" />} />
          <Route path="/cong-dong" element={<PlaceholderPage title="Cộng đồng" />} />
          <Route path="/thong-tin" element={<PlaceholderPage title="Thông tin cá nhân" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}