import { useState } from 'react';
import { Spin } from 'antd';
import { useFetchOrders, useAddOrder, useRemoveOrder } from '../../../hooks/useOrder';
import { useFetchCourts } from '../../../hooks/useCourt';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';

type View = 'list' | 'add-booking';

export default function BookingPage() {
  const { data: orders = [], isLoading: ordersLoading } = useFetchOrders();
  const { data: courts = [], isLoading: courtsLoading } = useFetchCourts();
  const { mutate: addOrder, isPending: isAddingOrder } = useAddOrder();
  const { mutate: removeOrder } = useRemoveOrder();

  const [view, setView] = useState<View>('list');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddOrder = async (data: any) => {
    return new Promise<void>((resolve, reject) => {
      addOrder(data, {
        onSuccess: () => {
          showToast('✓ Đặt lịch thành công!');
          resolve();
        },
        onError: (error: any) => {
          showToast('✗ Lỗi: ' + (error?.message || 'Không thể đặt lịch'));
          reject(error);
        },
      });
    });
  };

  const handleDeleteOrder = (id: number) => {
    if (window.confirm('Xác nhận xóa đơn đặt lịch này?')) {
      removeOrder(id, {
        onSuccess: () => {
          showToast('✓ Đã xóa đơn đặt lịch');
        },
        onError: () => {
          showToast('✗ Lỗi khi xóa');
        },
      });
    }
  };

  const isLoading = ordersLoading || courtsLoading || isAddingOrder;

  return (
    <>
      <style>{`html, body { color-scheme: light; } * { color-scheme: light; }`}</style>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: '#fff', padding: '14px 18px', borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontSize: 14, fontWeight: 500,
          animation: 'slideIn 0.3s ease-out',
        }}>
          {toast}
          <style>{`@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
        </div>
      )}

      {view === 'list' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", background: '#f7f7f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>📋 Quản lý đặt lịch</div>
              <div style={{ fontSize: 13.5, color: '#aaa' }}>Tổng: <span style={{ fontWeight: 600, color: '#555' }}>{orders.length} đơn</span></div>
            </div>
            <button
              onClick={() => setView('add-booking')}
              disabled={isLoading}
              style={{
                padding: '12px 24px', borderRadius: 10, border: 'none',
                background: '#D4840A', color: '#fff',
                fontWeight: 700, fontSize: 14,
                cursor: isLoading ? 'default' : 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>+</span> Đặt lịch mới
            </button>
          </div>

          <Spin spinning={isLoading}>
            <BookingList
              orders={orders}
              courts={courts}
              onView={(id) => console.log('View:', id)}
              onEdit={(id) => console.log('Edit:', id)}
              onDelete={handleDeleteOrder}
              loading={ordersLoading}
            />
          </Spin>
        </div>
      )}

      {view === 'add-booking' && (
        <BookingForm
          onBack={() => setView('list')}
          onSubmit={handleAddOrder}
          loading={isAddingOrder}
        />
      )}
    </>
  );
}
