import { useState } from 'react';
import {
  type Booking, COURTS, WEEKDAYS, TIME_SLOTS, BOOKED_SLOTS, PENDING_SLOTS,
  COURT_PRICE_PER_HOUR, fmt, calcHours,
} from './LichDatTypes';

// ─── Time Slot Grid ───────────────────────────────────────────────────────────

function TimeSlotGrid({
  courtId,
  selected,
  onSelect,
}: {
  courtId: number;
  selected: string[];
  onSelect: (slot: string) => void;
}) {
  const booked = BOOKED_SLOTS[courtId] ?? [];
  const pending = PENDING_SLOTS[courtId] ?? [];

  const cols = 5;
  const rows: string[][] = [];
  for (let i = 0; i < TIME_SLOTS.length; i += cols) {
    rows.push(TIME_SLOTS.slice(i, i + cols));
  }

  return (
    <div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
          {row.map(slot => {
            const isBooked = booked.includes(slot);
            const isPending = pending.includes(slot);
            const isSelected = selected.includes(slot);
            let bg = '#fff', color = '#333', border = '1px solid #e0e0e0', fontWeight: number = 400;
            if (isBooked) { bg = '#E53E3E'; color = '#fff'; border = 'none'; }
            else if (isPending) { bg = '#F6C90E'; color = '#1a1a1a'; border = 'none'; }
            else if (isSelected) { bg = '#378ADD'; color = '#fff'; border = 'none'; fontWeight = 700; }
            return (
              <button
                key={slot}
                disabled={isBooked || isPending}
                onClick={() => onSelect(slot)}
                style={{
                  flex: 1, padding: '7px 4px', borderRadius: 7, border,
                  background: bg, color, fontWeight, fontSize: 11.5,
                  cursor: isBooked || isPending ? 'default' : 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.12s',
                  minWidth: 0,
                }}
                onMouseEnter={e => {
                  if (!isBooked && !isPending && !isSelected)
                    (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF';
                }}
                onMouseLeave={e => {
                  if (!isBooked && !isPending && !isSelected)
                    (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                }}
              >{slot}</button>
            );
          })}
        </div>
      ))}
      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
        {[
          { color: '#fff', border: '1px solid #e0e0e0', label: 'Trống' },
          { color: '#378ADD', label: 'Lịch bạn chọn' },
          { color: '#F6C90E', label: 'Chờ xác nhận' },
          { color: '#E53E3E', label: 'Đã đặt' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#666' }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: l.color, border: l.border ?? 'none', flexShrink: 0 }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Invoice Modal ────────────────────────────────────────────────────────────

function InvoiceModal({
  customerName, courtId, startTime, endTime, weekDays,
  onConfirm, onClose,
}: {
  customerName: string; courtId: number; startTime: string; endTime: string;
  weekDays: number[]; onConfirm: (method: 'cash' | 'qr') => void; onClose: () => void;
}) {
  const [method, setMethod] = useState<'cash' | 'qr' | null>(null);
  const court = COURTS.find(c => c.id === courtId);
  const hours = calcHours(startTime, endTime);
  const weeksPerMonth = 4;
  const courtFee = hours * COURT_PRICE_PER_HOUR * weekDays.length * weeksPerMonth;
  const deposit = courtFee / 2;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: 420, boxShadow: '0 24px 80px rgba(0,0,0,0.22)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ background: 'linear-gradient(135deg,#D4840A,#F5A623)', padding: '20px 24px' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>Hóa đơn đặt lịch cố định</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{customerName}</div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Sân', value: court?.name },
              { label: 'Khung giờ', value: `${startTime} – ${endTime} (${hours}h)` },
              { label: 'Ngày trong tuần', value: weekDays.map(d => WEEKDAYS[d]).join(', ') || '—' },
              { label: 'Giá/giờ', value: `${fmt(COURT_PRICE_PER_HOUR)}đ` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 10px', borderRadius: 7, background: '#fafafa' }}>
                <span style={{ color: '#888' }}>{r.label}</span>
                <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{r.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
              <span style={{ color: '#555' }}>Tổng tháng</span>
              <span style={{ color: '#D4840A' }}>{fmt(courtFee)}đ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, background: '#FFF7ED', padding: '10px 12px', borderRadius: 9 }}>
              <span style={{ color: '#D4840A' }}>💰 Cọc trước (50%)</span>
              <span style={{ color: '#D4840A', fontSize: 16 }}>{fmt(deposit)}đ</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#aaa', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Phương thức thanh toán cọc</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { key: 'cash' as const, icon: '💵', label: 'Tiền mặt' },
                { key: 'qr' as const, icon: '📱', label: 'Mã QR' },
              ].map(m => (
                <button key={m.key} onClick={() => setMethod(m.key)} style={{
                  flex: 1, padding: '14px', borderRadius: 12,
                  border: `2px solid ${method === m.key ? '#D4840A' : '#e0e0e0'}`,
                  background: method === m.key ? '#FFF7ED' : '#fff',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: method === m.key ? '#D4840A' : '#555' }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => method && onConfirm(method)} disabled={!method} style={{
              flex: 1, padding: '13px', borderRadius: 10, border: 'none',
              background: method ? '#D4840A' : '#e0e0e0', color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: method ? 'pointer' : 'default', fontFamily: 'inherit',
            }}>✓ Xác nhận đặt lịch</button>
            <button onClick={onClose} style={{ padding: '13px 20px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

interface Props {
  editing?: Booking;
  onBack: () => void;
  onSave: (b: Booking) => void;
}

export default function DatLichCoDinh({ editing, onBack, onSave }: Props) {
  const [customerName, setCustomerName] = useState(editing?.customerName ?? '');
  const [customerCode, setCustomerCode] = useState(editing?.customerCode ?? '');
  const [phone, setPhone] = useState(editing?.phone ?? '');
  const [courtId, setCourtId] = useState(editing?.courtId ?? 1);
  const [weekDays, setWeekDays] = useState<number[]>(editing?.weekDays ?? []);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(
    editing ? [editing.startTime] : []
  );
  const [note, setNote] = useState(editing?.note ?? '');
  const [showInvoice, setShowInvoice] = useState(false);
  const [date, setDate] = useState(editing?.date ?? '');

  const toggleDay = (d: number) =>
    setWeekDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const toggleSlot = (slot: string) =>
    setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);

  const sortedSlots = [...selectedSlots].sort((a, b) =>
    TIME_SLOTS.indexOf(a) - TIME_SLOTS.indexOf(b)
  );
  const startTime = sortedSlots[0] ?? '';
  const endTime = sortedSlots.length > 0
    ? TIME_SLOTS[Math.min(TIME_SLOTS.indexOf(sortedSlots[sortedSlots.length - 1]) + 1, TIME_SLOTS.length - 1)]
    : '';

  const hours = calcHours(startTime, endTime);
  const courtFee = hours * COURT_PRICE_PER_HOUR * weekDays.length * 4;

  const canSubmit = customerName.trim() && weekDays.length > 0 && selectedSlots.length > 0;

  const handleConfirm = (method: 'cash' | 'qr') => {
    const booking: Booking = {
      id: editing?.id ?? Date.now(),
      type: 'fixed',
      customerName, customerCode, phone,
      courtId, weekDays,
      date: date || new Date().toLocaleDateString('vi-VN'),
      startTime, endTime,
      courtFee, serviceFee: 0,
      deposit: courtFee / 2,
      paymentStatus: 'deposited',
      paymentMethod: method,
      services: [], note,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    onSave(booking);
    setShowInvoice(false);
    onBack();
  };

  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e8e8e8', borderRadius: 9,
    padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', background: '#fff', outline: 'none', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {showInvoice && (
        <InvoiceModal
          customerName={customerName} courtId={courtId}
          startTime={startTime} endTime={endTime} weekDays={weekDays}
          onConfirm={handleConfirm} onClose={() => setShowInvoice(false)}
        />
      )}

      {/* Left: form */}
      <div style={{ width: 300, flexShrink: 0, overflowY: 'auto', padding: '22px 24px', background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#D4840A', fontWeight: 600, fontSize: 15, fontFamily: 'inherit', padding: 0, marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Đặt lịch cố định
        </button>

        {[
          { label: 'Tên khách hàng *', val: customerName, set: setCustomerName, ph: 'Nguyễn Văn A' },
          { label: 'Mã khách hàng', val: customerCode, set: setCustomerCode, ph: 'VD: NVA01' },
          { label: 'Số điện thoại', val: phone, set: setPhone, ph: '09xx xxx xxx' },
        ].map(f => (
          <div key={f.label}>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>{f.label.toUpperCase()}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={inp}
              onFocus={e => (e.target.style.borderColor = '#D4840A')}
              onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
          </div>
        ))}

        {/* Court selector */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>CHỌN SÂN</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {COURTS.map(c => (
              <button key={c.id} onClick={() => setCourtId(c.id)} style={{
                flex: 1, padding: '9px 8px', borderRadius: 9, fontSize: 13,
                border: `1.5px solid ${courtId === c.id ? '#D4840A' : '#e0e0e0'}`,
                background: courtId === c.id ? '#FFF3E0' : '#fafafa',
                color: courtId === c.id ? '#D4840A' : '#666',
                fontWeight: courtId === c.id ? 700 : 400,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
              }}>{c.name}</button>
            ))}
          </div>
        </div>

        {/* Weekday picker */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 8, fontWeight: 600 }}>CHỌN NGÀY TRONG TUẦN</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {WEEKDAYS.map((day, i) => (
              <button key={i} onClick={() => toggleDay(i)} style={{
                padding: '7px 10px', borderRadius: 8, fontSize: 12.5,
                border: `1.5px solid ${weekDays.includes(i) ? '#378ADD' : '#e0e0e0'}`,
                background: weekDays.includes(i) ? '#EFF6FF' : '#fafafa',
                color: weekDays.includes(i) ? '#1D4ED8' : '#666',
                fontWeight: weekDays.includes(i) ? 700 : 400,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${weekDays.includes(i) ? '#378ADD' : '#ccc'}`, background: weekDays.includes(i) ? '#378ADD' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {weekDays.includes(i) && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}
                </span>
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GHI CHÚ</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Ghi chú thêm..." style={{ ...inp, resize: 'none' as const, lineHeight: 1.5 }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>

        {/* Summary */}
        {selectedSlots.length > 0 && weekDays.length > 0 && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FFF7ED', border: '1px solid #FDE68A', fontSize: 12.5 }}>
            <div style={{ color: '#888', marginBottom: 4 }}>Ước tính/tháng:</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#D4840A' }}>{fmt(courtFee)}đ</div>
            <div style={{ color: '#aaa', fontSize: 11.5, marginTop: 2 }}>Cọc: {fmt(courtFee / 2)}đ</div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <button onClick={() => canSubmit && setShowInvoice(true)} disabled={!canSubmit} style={{
          padding: '13px', borderRadius: 10, border: 'none',
          background: canSubmit ? '#D4840A' : '#e0e0e0',
          color: '#fff', fontWeight: 700, fontSize: 14,
          cursor: canSubmit ? 'pointer' : 'default', fontFamily: 'inherit',
          marginTop: 8, transition: 'opacity 0.15s',
        }}>Đặt trước</button>
      </div>

      {/* Right: time slot grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: '#f7f7f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Chọn thời gian</div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555', background: '#fff' }} />
        </div>

        <div style={{ background: '#EFF6FF', borderRadius: 14, padding: '16px', border: '1px solid #BFDBFE' }}>
          <TimeSlotGrid courtId={courtId} selected={selectedSlots} onSelect={toggleSlot} />
        </div>

        {selectedSlots.length > 0 && (
          <div style={{ marginTop: 14, padding: '12px 16px', background: '#fff', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.08)', fontSize: 13 }}>
            <span style={{ color: '#888' }}>Đã chọn: </span>
            <span style={{ fontWeight: 600, color: '#378ADD' }}>{startTime} – {endTime}</span>
            <span style={{ color: '#aaa', marginLeft: 8 }}>({hours}h · {fmt(hours * COURT_PRICE_PER_HOUR)}đ/ngày)</span>
          </div>
        )}
      </div>
    </div>
  );
}