import { useMemo, useState } from 'react';
import { useFetchProducts } from '../../../../hooks/useProduct';
import { useFetchCourts } from '../../../../hooks/useCourt';
import { ServicesModal } from './ServicesModal';
import { InvoiceModal } from './InvoiceModal';
import type { IProduct } from '../../../../types/product.type';
import type { ICourt } from '../../../../types/court.type';
import type { AdminOrder } from '../../../../types/order.type';

interface ServiceItem {
  id: number;
  name: string;
  unit: string;
  price: number;
  category: string;
}

interface SelectedService {
  service: ServiceItem;
  qty: number;
}

interface BookingFormProps {
  onBack: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  order?: AdminOrder;
  isEditing?: boolean;
}

const fmt = (n: number) => n.toLocaleString('vi-VN');
const TIME_SLOTS = [
  '6:00','6:30','7:00','7:30','8:00','8:30','9:00','9:30',
  '10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00','20:30','21:00',
];
const COURT_PRICE_PER_HOUR = 80000;

function calcHours(start: string, end: string): number {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  return Math.max(0, (toMin(end) - toMin(start)) / 60);
}

function productsToServices(products: IProduct[]): ServiceItem[] {
  return products
    .filter(p => p.categoryId !== 1)
    .flatMap(p => 
      p.details.map(d => ({
        id: p.productId,
        name: p.productName,
        unit: d.unit,
        price: d.unitPrice ?? 0,
        category: p.categoryId.toString(),
      }))
    );
}

export function BookingForm({ onBack, onSubmit, loading = false, order, isEditing = false }: BookingFormProps) {
  const { data: products = [] } = useFetchProducts();
  const { data: courts = [] } = useFetchCourts();
  
  const [courtIds, setCourtIds] = useState<number[]>(order?.courtIds ?? [courts[0]?.courtId ?? 1]);
  const [date, setDate] = useState(order?.orderDate ?? '');
  const [startTime, setStartTime] = useState(order?.startHour ?? '');
  const [endTime, setEndTime] = useState(order?.endHour ?? '');
  const [services, setServices] = useState<SelectedService[]>([]);
  const [showServices, setShowServices] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const servicesList = useMemo(() => 
    products.length > 0 ? productsToServices(products) : [],
    [products]
  );

  const hours = calcHours(startTime, endTime);
  const courtFee = hours * COURT_PRICE_PER_HOUR;
  const serviceFee = services.reduce((s, i) => s + i.service.price * i.qty, 0);
  const total = courtFee + serviceFee;
  const canSubmit = courtIds.length > 0 && startTime && endTime && date && (!isEditing || services.length > 0);

  const handleConfirm = async () => {
    if (isEditing) {
      const orderData = {
        services: services.map(s => ({
          productId: s.service.id,
          productCategoryId: parseInt(s.service.category),
          quantity: s.qty,
        })),
      };
      try {
        await onSubmit(orderData);
        setShowInvoice(false);
        onBack();
      } catch (error) {
        console.error('Submit error:', error);
      }
    } else {
      const orderData = {
        orderDate: date,
        startHour: startTime,
        endHour: endTime,
        courtIds,
      };
      try {
        await onSubmit(orderData);
        setShowInvoice(false);
        onBack();
      } catch (error) {
        console.error('Submit error:', error);
      }
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e8e8e8', borderRadius: 9,
    padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', background: '#fff', outline: 'none', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {showServices && (
        <ServicesModal selected={services} onChange={setServices} onClose={() => setShowServices(false)} services={servicesList} />
      )}
      {showInvoice && (
        <InvoiceModal
          customerName={isEditing ? order?.guestName ?? '' : ''}
          courtId={courtIds[0] ?? 1}
          courts={courts.map(c => ({ id: c.courtId, name: c.name }))}
          startTime={startTime}
          endTime={endTime}
          services={services}
          onConfirm={handleConfirm}
          onClose={() => setShowInvoice(false)}
          loading={loading}
        />
      )}

      {/* Left: form */}
      <div style={{ width: 300, flexShrink: 0, overflowY: 'auto', padding: '22px 24px', background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 13 }}>
        <button onClick={onBack} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer', color: '#D4840A', fontWeight: 600, fontSize: 15, fontFamily: 'inherit', padding: 0, marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          {isEditing ? 'Chỉnh sửa' : 'Đặt lịch'}
        </button>

        {!isEditing && (
          <>
            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>NGÀY ĐẶT *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                disabled={loading}
                style={{...inp }}
                onFocus={e => (e.target.style.borderColor = '#D4840A')}
                onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
              />
            </div>

            {/* Court selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11.5, color: '#999', fontWeight: 600 }}>CHỌN SÂN *</label>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {courts.map((c: ICourt) => (
                  <button
                    key={c.courtId}
                    onClick={() => {
                      if (courtIds.includes(c.courtId)) {
                        setCourtIds(courtIds.filter(id => id !== c.courtId));
                      } else {
                        setCourtIds([...courtIds, c.courtId]);
                      }
                    }}
                    disabled={loading}
                    style={{
                      flex: '1 1 48%', padding: '9px 8px', borderRadius: 9, fontSize: 13,
                      border: `1.5px solid ${courtIds.includes(c.courtId) ? '#D4840A' : '#e0e0e0'}`,
                      background: courtIds.includes(c.courtId) ? '#FFF3E0' : '#fafafa',
                      color: courtIds.includes(c.courtId) ? '#D4840A' : '#666',
                      fontWeight: courtIds.includes(c.courtId) ? 700 : 400,
                      cursor: loading ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.12s',
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GIỜ BẮT ĐẦU *</label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                disabled={loading}
                style={{...inp, appearance: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#D4840A')}
                onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
              >
                <option value="">-- Chọn giờ bắt đầu --</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GIỜ KẾT THÚC *</label>
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                disabled={loading}
                style={{...inp, appearance: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#D4840A')}
                onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
              >
                <option value="">-- Chọn giờ kết thúc --</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Services button */}
        {(isEditing || servicesList.length > 0) && (
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>DỊCH VỤ KÈM</label>
            <button
              onClick={() => setShowServices(true)}
              disabled={loading || servicesList.length === 0}
              style={{
                width: '100%', padding: '11px', borderRadius: 9,
                border: '1.5px solid #378ADD', background: '#EFF6FF',
                color: '#1D4ED8', fontWeight: 600, fontSize: 13.5,
                cursor: loading || servicesList.length === 0 ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                opacity: servicesList.length === 0 ? 0.5 : 1,
              }}
            >
              <span style={{ fontSize: 16 }}>+</span> Dịch vụ
              {services.length > 0 && (
                <span style={{ background: '#378ADD', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                  {services.length}
                </span>
              )}
            </button>
            {services.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {services.map(s => (
                  <div key={s.service.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 10px', background: '#f5f5f3', borderRadius: 6 }}>
                    <span style={{ color: '#555' }}>{s.service.name} ×{s.qty}</span>
                    <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{fmt(s.service.price * s.qty)}đ</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {startTime && endTime && !isEditing && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FFF7ED', border: '1px solid #FDE68A', fontSize: 12.5 }}>
            <div style={{ color: '#888', marginBottom: 6 }}>Tóm tắt:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                <span>Sân ({hours}h)</span><span style={{ fontWeight: 600 }}>{fmt(courtFee)}đ</span>
              </div>
              {serviceFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                  <span>Dịch vụ</span><span style={{ fontWeight: 600 }}>{fmt(serviceFee)}đ</span>
                </div>
              )}
              <div style={{ borderTop: '1px dashed #FDE68A', paddingTop: 5, marginTop: 3, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14, color: '#D4840A' }}>
                <span>Tổng</span><span>{fmt(total)}đ</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <input
          type="button"
          onClick={() => canSubmit && setShowInvoice(true)}
          disabled={!canSubmit || loading}
          value={loading ? '⏳ Đang xử lý...' : isEditing ? 'Cập nhật' : 'Đặt trước'}
          style={{
            padding: '13px', borderRadius: 10, border: 'none',
            background: canSubmit && !loading ? '#D4840A' : '#e0e0e0',
            color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: canSubmit && !loading ? 'pointer' : 'default', fontFamily: 'inherit', marginTop: 8,
          }}
        />
      </div>

      {/* Right: time slot grid or info */}
      {!isEditing && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: '#f7f7f5' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Chọn thời gian</div>

          {date ? (
            <div style={{ background: '#EFF6FF', borderRadius: 14, padding: '16px', border: '1px solid #BFDBFE' }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                <strong>Ngày:</strong> {date}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => {
                      if (startTime === '') setStartTime(slot);
                      else if (endTime === '') setEndTime(slot);
                    }}
                    disabled={loading}
                    style={{
                      padding: '8px', borderRadius: 6,
                      border: '1px solid #e0e0e0',
                      background: startTime === slot || endTime === slot ? '#378ADD' : '#fff',
                      color: startTime === slot || endTime === slot ? '#fff' : '#333',
                      fontWeight: startTime === slot || endTime === slot ? 700 : 400,
                      fontSize: 12,
                      cursor: loading ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', background: '#fff', borderRadius: 10, color: '#aaa' }}>
              Vui lòng chọn ngày trước
            </div>
          )}
        </div>
      )}
    </div>
  );
}
