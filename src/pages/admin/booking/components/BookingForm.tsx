import { useMemo, useState } from 'react';
import { useFetchProducts } from '../../../../hooks/useProduct';
import { useFetchCourts } from '../../../../hooks/useCourt';
import { TimeSlotGrid } from './TimeSlotGrid';
import { ServicesModal } from './ServicesModal';
import { InvoiceModal } from './InvoiceModal';
import type { IProduct } from '../../../../types/product.type';
import type { ICourt } from '../../../../types/court.type';

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

export function BookingForm({ onBack, onSubmit, loading = false }: BookingFormProps) {
  const { data: products = [] } = useFetchProducts();
  const { data: courts = [] } = useFetchCourts();
  
  const [customerName, setCustomerName] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [phone, setPhone] = useState('');
  const [courtId, setCourtId] = useState(courts[0]?.courtId ?? 1);
  const [date, setDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [services, setServices] = useState<SelectedService[]>([]);
  const [note, setNote] = useState('');
  const [showServices, setShowServices] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const servicesList = useMemo(() => 
    products.length > 0 ? productsToServices(products) : [],
    [products]
  );

  const toggleSlot = (slot: string) =>
    setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);

  const sortedSlots = [...selectedSlots].sort((a, b) => TIME_SLOTS.indexOf(a) - TIME_SLOTS.indexOf(b));
  const startTime = sortedSlots[0] ?? '';
  const endTime = sortedSlots.length > 0
    ? TIME_SLOTS[Math.min(TIME_SLOTS.indexOf(sortedSlots[sortedSlots.length - 1]) + 1, TIME_SLOTS.length - 1)]
    : '';

  const hours = calcHours(startTime, endTime);
  const courtFee = hours * COURT_PRICE_PER_HOUR;
  const serviceFee = services.reduce((s, i) => s + i.service.price * i.qty, 0);
  const total = courtFee + serviceFee;
  const canSubmit = customerName.trim() && selectedSlots.length > 0 && date;

  const handleConfirm = async (method: 'CASH' | 'QR') => {
    const orderData = {
      customerName,
      customerCode,
      phone,
      courtId,
      date,
      startTime,
      endTime,
      note,
      services: services.map(s => ({
        productId: s.service.id,
        productName: s.service.name,
        quantity: s.qty,
        unitPrice: s.service.price,
        unit: s.service.unit,
      })),
      type: 'single',
      paymentMethod: method,
    };
    
    try {
      await onSubmit(orderData);
      setShowInvoice(false);
      onBack();
    } catch (error) {
      console.error('Submit error:', error);
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
          customerName={customerName} courtId={courtId} courts={courts.map(c => ({ id: c.courtId, name: c.name }))}
          startTime={startTime} endTime={endTime} services={services}
          onConfirm={handleConfirm} onClose={() => setShowInvoice(false)}
          loading={loading}
        />
      )}

      {/* Left: form */}
      <div style={{ width: 300, flexShrink: 0, overflowY: 'auto', padding: '22px 24px', background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 13 }}>
        <button onClick={onBack} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer', color: '#D4840A', fontWeight: 600, fontSize: 15, fontFamily: 'inherit', padding: 0, marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Đặt lịch
        </button>

        {[
          { label: 'Tên khách hàng *', val: customerName, set: setCustomerName, ph: 'Nguyễn Văn A' },
          { label: 'Mã khách hàng', val: customerCode, set: setCustomerCode, ph: 'VD: NVA01' },
          { label: 'Số điện thoại', val: phone, set: setPhone, ph: '09xx xxx xxx' },
        ].map(f => (
          <div key={f.label}>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>{f.label.toUpperCase()}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={inp} disabled={loading}
              onFocus={e => (e.target.style.borderColor = '#D4840A')}
              onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
          </div>
        ))}

        {/* Court selector */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 11.5, color: '#999', fontWeight: 600 }}>CHỌN SÂN</label>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {courts.map((c: ICourt) => (
              <button key={c.courtId} onClick={() => setCourtId(c.courtId)} disabled={loading} style={{
                flex: 1, padding: '9px 8px', borderRadius: 9, fontSize: 13,
                border: `1.5px solid ${courtId === c.courtId ? '#D4840A' : '#e0e0e0'}`,
                background: courtId === c.courtId ? '#FFF3E0' : '#fafafa',
                color: courtId === c.courtId ? '#D4840A' : '#666',
                fontWeight: courtId === c.courtId ? 700 : 400,
                cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
              }}>{c.name}</button>
            ))}
          </div>
        </div>

        {/* Services button */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>DỊCH VỤ KÈM</label>
          <button onClick={() => setShowServices(true)} disabled={loading || servicesList.length === 0} style={{
            width: '100%', padding: '11px', borderRadius: 9,
            border: '1.5px solid #378ADD', background: '#EFF6FF',
            color: '#1D4ED8', fontWeight: 600, fontSize: 13.5,
            cursor: loading || servicesList.length === 0 ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: servicesList.length === 0 ? 0.5 : 1,
          }}>
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

        {/* Note */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GHI CHÚ</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Ghi chú thêm..." style={{ ...inp, resize: 'none' as const, lineHeight: 1.5 }} disabled={loading}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>

        {/* Summary */}
        {selectedSlots.length > 0 && (
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
              <div style={{ fontSize: 11.5, color: '#aaa' }}>Cọc sân: {fmt(courtFee / 2)}đ</div>
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <button onClick={() => canSubmit && setShowInvoice(true)} disabled={!canSubmit || loading} style={{
          padding: '13px', borderRadius: 10, border: 'none',
          background: canSubmit && !loading ? '#D4840A' : '#e0e0e0',
          color: '#fff', fontWeight: 700, fontSize: 14,
          cursor: canSubmit && !loading ? 'pointer' : 'default', fontFamily: 'inherit', marginTop: 8,
        }}>
          {loading ? '⏳ Đang xử lý...' : 'Đặt trước'}
        </button>
      </div>

      {/* Right: time slot grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: '#f7f7f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Chọn thời gian</div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} disabled={loading} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555', background: '#fff' }} />
        </div>

        <div style={{ background: '#EFF6FF', borderRadius: 14, padding: '16px', border: '1px solid #BFDBFE' }}>
          <TimeSlotGrid courtId={courtId} selected={selectedSlots} onSelect={toggleSlot} timeSlots={TIME_SLOTS} />
        </div>

        {selectedSlots.length > 0 && (
          <div style={{ marginTop: 14, padding: '12px 16px', background: '#fff', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.08)', fontSize: 13 }}>
            <span style={{ color: '#888' }}>Đã chọn: </span>
            <span style={{ fontWeight: 600, color: '#378ADD' }}>{startTime} – {endTime}</span>
            <span style={{ color: '#aaa', marginLeft: 8 }}>({hours}h · {fmt(courtFee)}đ)</span>
          </div>
        )}
      </div>
    </div>
  );
}
