import { useState } from 'react';
import { Spin } from 'antd';
import { useFetchAdminOrders, useCreateAdminOrder, useUpdateAdminOrder, useInvoiceOrder } from '../../../hooks/useOrder';
import { useFetchCourts } from '../../../hooks/useCourt';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { OrderDetailsView } from './components/OrderDetailsView';
import type { AdminOrder } from '../../../types/order.type';

type View = 'list' | 'add-booking' | 'view-order' | 'edit-order';

export default function BookingPage() {
  const { data: orders = [], isLoading: ordersLoading } = useFetchAdminOrders();
  const { data: courts = [], isLoading: courtsLoading } = useFetchCourts();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateAdminOrder();
  const { mutate: updateOrder, isPending: isUpdatingOrder } = useUpdateAdminOrder();
  const { mutate: invoiceOrder } = useInvoiceOrder();

  const [view, setView] = useState<View>('list');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddOrder = async (data: any) => {
    return new Promise<AdminOrder>((resolve, reject) => {
      createOrder(data, {
        onSuccess: createdOrder => {
          showToast('✓ Đặt lịch thành công!');
          resolve(createdOrder);
        },
        onError: (error: any) => {
          showToast('✗ Lỗi: ' + (error?.message || 'Không thể đặt lịch'));
          reject(error);
        },
      });
    });
  };

  const handleViewOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setView('view-order');
  };

  const handleEditOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setView('edit-order');
  };

  const handleUpdateOrder = async (data: any) => {
    if (!selectedOrder) return;
    return new Promise<void>((resolve, reject) => {
      updateOrder(
        { id: selectedOrder.courtOrderId, payload: data },
        {
          onSuccess: () => {
            showToast('✓ Cập nhật đơn thành công!');
            setView('list');
            setSelectedOrder(null);
            resolve();
          },
          onError: (error: any) => {
            showToast('✗ Lỗi: ' + (error?.message || 'Không thể cập nhật'));
            reject(error);
          },
        }
      );
    });
  };

  const handleInvoice = (orderId: number, payload: any) => {
    invoiceOrder(
      { id: orderId, payload },
      {
        onSuccess: () => {
          showToast('✓ Xuất hóa đơn thành công!');
          setView('list');
        },
        onError: (error: any) => {
          showToast('✗ Lỗi: ' + (error?.message || 'Không thể xuất hóa đơn'));
        },
      }
    );
  };

  const isLoading = ordersLoading || courtsLoading || isCreatingOrder || isUpdatingOrder;

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
              onView={handleViewOrder}
              onEdit={handleEditOrder}
              loading={ordersLoading}
            />
          </Spin>
        </div>
      )}

      {view === 'view-order' && selectedOrder && (
        <OrderDetailsView
          order={selectedOrder}
          courts={courts}
          onBack={() => {
            setView('list');
            setSelectedOrder(null);
          }}
          onEdit={() => handleEditOrder(selectedOrder)}
          onInvoice={handleInvoice}
          loading={isLoading}
        />
      )}

      {view === 'add-booking' && (
        <BookingForm
          onBack={() => setView('list')}
          onSubmit={handleAddOrder}
          loading={isCreatingOrder}
        />
      )}

      {view === 'edit-order' && selectedOrder && (
        <BookingForm
          order={selectedOrder}
          onBack={() => {
            setView('list');
            setSelectedOrder(null);
          }}
          onSubmit={handleUpdateOrder}
          loading={isUpdatingOrder}
          isEditing={true}
        />
      )}
    </>
  );
}
