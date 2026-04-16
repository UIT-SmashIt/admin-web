import { useState } from 'react';
import {
  type Booking, type SelectedService, COURTS, TIME_SLOTS,
  BOOKED_SLOTS, PENDING_SLOTS, SERVICES_LIST, PLAY_LEVELS,
  COURT_PRICE_PER_HOUR, fmt, calcHours,
  isoToVN, minCommunityDate,
} from './LichDatTypes';

// ─── Time Slot Grid ───────────────────────────────────────────────────────────

function TimeSlotGrid({ courtId, selected, onSelect }: {
  courtId: number; selected: string[]; onSelect: (s: string) => void;
}) {
  const booked = BOOKED_SLOTS[courtId] ?? [];
  const pending = PENDING_SLOTS[courtId] ?? [];
  const cols = 5;
  const rows: string[][] = [];
  for (let i = 0; i < TIME_SLOTS.length; i += cols) rows.push(TIME_SLOTS.slice(i, i + cols));

  return (
    <div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
          {row.map(slot => {
            const isBooked = booked.includes(slot);
            const isPending = pending.includes(slot);
            const isSel = selected.includes(slot);
            let bg = '#fff', color = '#333', border = '1px solid #e0e0e0', fw = 400;
            if (isBooked)  { bg = '#E53E3E'; color = '#fff'; border = 'none'; }
            else if (isPending) { bg = '#F6C90E'; color = '#1a1a1a'; border = 'none'; }
            else if (isSel) { bg = '#7B1FA2'; color = '#fff'; border = 'none'; fw = 700; }
            return (
              <button key={slot} disabled={isBooked || isPending} onClick={() => onSelect(slot)}
                style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border, background: bg, color, fontWeight: fw, fontSize: 11.5, cursor: isBooked || isPending ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.12s', minWidth: 0 }}
                onMouseEnter={e => { if (!isBooked && !isPending && !isSel) (e.currentTarget as HTMLButtonElement).style.background = '#F3E8FF'; }}
                onMouseLeave={e => { if (!isBooked && !isPending && !isSel) (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
              >{slot}</button>
            );
          })}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
        {[
          { bg: '#fff', border: '1px solid #e0e0e0', label: 'Trống' },
          { bg: '#7B1FA2', label: 'Lịch bạn chọn' },
          { bg: '#F6C90E', label: 'Chờ xác nhận' },
          { bg: '#E53E3E', label: 'Đã đặt' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#666' }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: l.bg, border: l.border ?? 'none', flexShrink: 0 }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Services Modal ───────────────────────────────────────────────────────────

function ServicesModal({ selected, onChange, onClose }: {
  selected: SelectedService[]; onChange: (s: SelectedService[]) => void; onClose: () => void;
}) {
  const [local, setLocal] = useState<SelectedService[]>(selected.map(s => ({ ...s })));
  const [cat, setCat] = useState('Tất cả');
  const cats = ['Tất cả', ...Array.from(new Set(SERVICES_LIST.map(s => s.category)))];
  const displayed = cat === 'Tất cả' ? SERVICES_LIST : SERVICES_LIST.filter(s => s.category === cat);
  const getQty = (id: number) => local.find(s => s.service.id === id)?.qty ?? 0;
  const setQty = (svc: typeof SERVICES_LIST[0], qty: number) => {
    if (qty <= 0) setLocal(prev => prev.filter(s => s.service.id !== svc.id));
    else setLocal(prev => {
      const ex = prev.find(s => s.service.id === svc.id);
      if (ex) return prev.map(s => s.service.id === svc.id ? { ...s, qty } : s);
      return [...prev, { service: svc, qty }];
    });
  };
  const total = local.reduce((s, i) => s + i.service.price * i.qty, 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 350, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: 500, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px 14px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>🛒 Chọn dịch vụ</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '10px 22px', overflowX: 'auto', borderBottom: '0.5px solid #f0f0ee', flexShrink: 0 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, border: `1px solid ${cat === c ? '#7B1FA2' : '#e0e0e0'}`, background: cat === c ? '#7B1FA2' : '#fafafa', color: cat === c ? '#fff' : '#666', fontWeight: cat === c ? 600 : 400, transition: 'all 0.12s' }}>{c}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px' }}>
          {displayed.map(svc => {
            const qty = getQty(svc.id);
            return (
              <div key={svc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '0.5px solid #f5f5f3' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{svc.name}</div>
                  <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 1 }}>{fmt(svc.price)}đ / {svc.unit}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {qty > 0 && <>
                    <button onClick={() => setQty(svc, qty - 1)} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{qty}</span>
                  </>}
                  <button onClick={() => setQty(svc, qty + 1)} style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: qty > 0 ? '#7B1FA2' : '#D4840A', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  {qty > 0 && <button onClick={() => setQty(svc, 0)} style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: '#FFF5F5', color: '#A32D2D', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '14px 22px', borderTop: '0.5px solid #f0f0ee', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#888' }}>Tổng dịch vụ:</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#D4840A' }}>{fmt(total)}đ</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { onChange(local); onClose(); }} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#7B1FA2', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Xác nhận</button>
            <button onClick={onClose} style={{ padding: '12px 18px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Caption Popup ────────────────────────────────────────────────────────────

function CaptionPopup({ caption, onChange, onPost, onSkip }: {
  caption: string; onChange: (v: string) => void;
  onPost: () => void; onSkip: () => void;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 20, width: 480, boxShadow: '0 24px 80px rgba(0,0,0,0.25)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#7B1FA2,#9C27B0)', padding: '20px 24px' }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>📢</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Đăng lên cộng đồng</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>
            Viết caption để tìm người chơi cùng!
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Caption preview card */}
          <div style={{ marginBottom: 14, padding: '14px', borderRadius: 12, background: '#F3E8FF', border: '1.5px solid #D8B4FE', position: 'relative' }}>
            <div style={{ fontSize: 10.5, color: '#7B1FA2', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>PREVIEW BÀI ĐĂNG</div>
            <div style={{ fontSize: 13.5, color: '#3B0764', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{caption || '...'}</div>
            <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 16 }}>🏸</div>
          </div>

          {/* Edit area */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>
              CHỈNH SỬA CAPTION
            </label>
            <textarea
              value={caption}
              onChange={e => onChange(e.target.value)}
              rows={5}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1.5px solid #D8B4FE', borderRadius: 10,
                padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit',
                color: '#1a1a1a', outline: 'none', resize: 'vertical' as const,
                lineHeight: 1.6, background: '#FAFAFA',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
              onBlur={e => (e.target.style.borderColor = '#D8B4FE')}
            />
            <div style={{ fontSize: 11, color: '#aaa', textAlign: 'right', marginTop: 3 }}>
              {caption.length} ký tự
            </div>
          </div>

          {/* Suggested hashtags */}
          <div style={{ marginBottom: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['#cầulông', '#tìmđồng_đội', '#sânxịn', '#badminton', '#sportsHCM'].map(tag => (
              <button key={tag} onClick={() => onChange(caption + ' ' + tag)} style={{
                padding: '4px 10px', borderRadius: 20, fontSize: 11.5,
                border: '1px solid #D8B4FE', background: '#F3E8FF', color: '#7B1FA2',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                transition: 'all 0.12s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#7B1FA2'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F3E8FF'; (e.currentTarget as HTMLButtonElement).style.color = '#7B1FA2'; }}
              >{tag}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onPost} style={{
              flex: 2, padding: '13px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#7B1FA2,#9C27B0)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 3px 12px rgba(123,31,162,0.35)',
            }}>📢 Đăng lên cộng đồng</button>
            <button onClick={onSkip} style={{
              flex: 1, padding: '13px', borderRadius: 10,
              border: '1.5px solid #e0e0e0', background: '#fff',
              color: '#888', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Bỏ qua</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Modal ────────────────────────────────────────────────────────────

function InvoiceModal({ customerName, courtId, startTime, endTime, services, onConfirm, onClose }: {
  customerName: string; courtId: number; startTime: string; endTime: string;
  services: SelectedService[];
  onConfirm: (method: 'cash' | 'qr') => void; onClose: () => void;
}) {
  const [method, setMethod] = useState<'cash' | 'qr' | null>(null);
  const court = COURTS.find(c => c.id === courtId);
  const hours = calcHours(startTime, endTime);
  const courtFee = hours * COURT_PRICE_PER_HOUR;
  const serviceFee = services.reduce((s, i) => s + i.service.price * i.qty, 0);
  const total = courtFee + serviceFee;
  const deposit = courtFee / 2;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: 420, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.22)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ background: 'linear-gradient(135deg,#7B1FA2,#9C27B0)', padding: '20px 24px' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>Hóa đơn đặt lịch cộng đồng</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{customerName}</div>
        </div>
        <div style={{ padding: '20px 24px', maxHeight: 'calc(85vh - 90px)', overflowY: 'auto' }}>
          {[
            { label: 'Sân', value: court?.name },
            { label: 'Khung giờ', value: `${startTime} – ${endTime} (${hours}h)` },
            { label: 'Tiền sân', value: `${fmt(courtFee)}đ` },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 10px', borderRadius: 7, background: '#fafafa', marginBottom: 6 }}>
              <span style={{ color: '#888' }}>{r.label}</span>
              <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{r.value}</span>
            </div>
          ))}

          {services.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', margin: '10px 0 6px', letterSpacing: '0.04em' }}>Dịch vụ</div>
              {services.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 10px', borderRadius: 6, background: '#fafafa', marginBottom: 4 }}>
                  <span style={{ color: '#666' }}>{s.service.name} × {s.qty}</span>
                  <span style={{ fontWeight: 500 }}>{fmt(s.service.price * s.qty)}đ</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              <span style={{ color: '#555' }}>Tổng cộng</span>
              <span style={{ color: '#7B1FA2' }}>{fmt(total)}đ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, background: '#F3E8FF', padding: '10px 12px', borderRadius: 9 }}>
              <span style={{ color: '#7B1FA2' }}>💰 Cọc trước (50% sân)</span>
              <span style={{ color: '#7B1FA2', fontSize: 15 }}>{fmt(deposit)}đ</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#aaa', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Thanh toán cọc qua</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ key: 'cash' as const, icon: '💵', label: 'Tiền mặt' }, { key: 'qr' as const, icon: '📱', label: 'Mã QR' }].map(m => (
                <button key={m.key} onClick={() => setMethod(m.key)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: `2px solid ${method === m.key ? '#7B1FA2' : '#e0e0e0'}`, background: method === m.key ? '#F3E8FF' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: method === m.key ? '#7B1FA2' : '#555' }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => method && onConfirm(method)} disabled={!method} style={{ flex: 1, padding: '13px', borderRadius: 10, border: 'none', background: method ? 'linear-gradient(135deg,#7B1FA2,#9C27B0)' : '#e0e0e0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: method ? 'pointer' : 'default', fontFamily: 'inherit' }}>✓ Xác nhận đặt lịch</button>
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

export default function DatLichCongDong({ editing, onBack, onSave }: Props) {
  const [customerName, setCustomerName] = useState(editing?.customerName ?? '');
  const [customerCode, setCustomerCode] = useState(editing?.customerCode ?? '');
  const [phone, setPhone] = useState(editing?.phone ?? '');
  const [courtId, setCourtId] = useState(editing?.courtId ?? 1);
  const [date, setDate] = useState(editing?.date ? editing.date.split('/').reverse().join('-') : '');
  const [selectedSlots, setSelectedSlots] = useState<string[]>(editing ? [editing.startTime] : []);
  const [services, setServices] = useState<SelectedService[]>(editing?.services ?? []);
  const [note, setNote] = useState(editing?.note ?? '');
  const [maxPlayers, setMaxPlayers] = useState(editing?.maxPlayers ?? 4);
  const [currentPlayers, setCurrentPlayers] = useState(editing?.currentPlayers ?? 1);
  const [level, setLevel] = useState(editing?.level ?? PLAY_LEVELS[0]);
  const [showServices, setShowServices] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);

  const minDate = minCommunityDate();
  const dateError = date && date < minDate;

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

  const canSubmit = customerName.trim() && selectedSlots.length > 0 && date && !dateError;

  const court = COURTS.find(c => c.id === courtId);
  const dateVN = isoToVN(date);

  function buildAutoCaption() {
    const spotsLeft = maxPlayers - currentPlayers;
    const timeStr = startTime && endTime ? `${startTime}–${endTime}` : '';
    return `🏸 Tìm ${spotsLeft > 0 ? spotsLeft : ''} người chơi cầu lông ngày ${dateVN} tại ${court?.name}, ${timeStr}.\nTrình độ: ${level}. Số người hiện có: ${currentPlayers}/${maxPlayers}.\nAi quan tâm nhắn tin nhé! 💪`;
  }

  const [caption, setCaption] = useState('');

  const handleInvoiceConfirm = (method: 'cash' | 'qr') => {
    const booking: Booking = {
      id: editing?.id ?? Date.now(),
      type: 'community',
      customerName, customerCode, phone,
      courtId, date: dateVN, startTime, endTime,
      courtFee, serviceFee, deposit: courtFee / 2,
      paymentStatus: 'deposited', paymentMethod: method,
      services, note, createdAt: new Date().toLocaleDateString('vi-VN'),
      maxPlayers, currentPlayers, level, caption: '',
    };
    setPendingBooking(booking);
    setShowInvoice(false);
    setCaption(buildAutoCaption());
    setShowCaption(true);
  };

  const handlePost = () => {
    if (!pendingBooking) return;
    onSave({ ...pendingBooking, caption });
    setShowCaption(false);
    onBack();
  };

  const handleSkip = () => {
    if (!pendingBooking) return;
    onSave({ ...pendingBooking, caption });
    setShowCaption(false);
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
      {showServices && <ServicesModal selected={services} onChange={setServices} onClose={() => setShowServices(false)} />}
      {showInvoice && (
        <InvoiceModal customerName={customerName} courtId={courtId} startTime={startTime} endTime={endTime} services={services} onConfirm={handleInvoiceConfirm} onClose={() => setShowInvoice(false)} />
      )}
      {showCaption && (
        <CaptionPopup caption={caption} onChange={setCaption} onPost={handlePost} onSkip={handleSkip} />
      )}

      {/* ── Left panel ── */}
      <div style={{ width: 310, flexShrink: 0, overflowY: 'auto', padding: '22px 24px', background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 13 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#7B1FA2', fontWeight: 600, fontSize: 15, fontFamily: 'inherit', padding: 0, marginBottom: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Đặt lịch cộng đồng
        </button>

        {/* Info badge */}
        <div style={{ padding: '10px 12px', borderRadius: 9, background: '#F3E8FF', border: '1px solid #D8B4FE', fontSize: 12, color: '#6D28D9', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
          <span>Lịch cộng đồng cần đặt trước ít nhất <strong>3 ngày</strong> để kịp tìm người chơi.</span>
        </div>

        {/* Customer info */}
        {[
          { label: 'Tên khách hàng *', val: customerName, set: setCustomerName, ph: 'Nguyễn Văn A' },
          { label: 'Mã khách hàng', val: customerCode, set: setCustomerCode, ph: 'VD: NVA01' },
          { label: 'Số điện thoại', val: phone, set: setPhone, ph: '09xx xxx xxx' },
        ].map(f => (
          <div key={f.label}>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>{f.label.toUpperCase()}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={inp}
              onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
              onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
          </div>
        ))}

        {/* Court */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 11.5, color: '#999', fontWeight: 600 }}>CHỌN SÂN</label>
            <span style={{ fontSize: 11.5, color: '#7B1FA2', cursor: 'pointer', fontWeight: 500 }}>Xem bảng giá</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {COURTS.map(c => (
              <button key={c.id} onClick={() => setCourtId(c.id)} style={{
                flex: 1, padding: '9px 8px', borderRadius: 9, fontSize: 13,
                border: `1.5px solid ${courtId === c.id ? '#7B1FA2' : '#e0e0e0'}`,
                background: courtId === c.id ? '#F3E8FF' : '#fafafa',
                color: courtId === c.id ? '#7B1FA2' : '#666',
                fontWeight: courtId === c.id ? 700 : 400,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
              }}>{c.name}</button>
            ))}
          </div>
        </div>

        {/* Players */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 8, fontWeight: 600 }}>SỐ LƯỢNG NGƯỜI CHƠI</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 5 }}>Tối đa</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setMaxPlayers(Math.max(currentPlayers, maxPlayers - 1))} style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #D8B4FE', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#7B1FA2', minWidth: 28, textAlign: 'center' }}>{maxPlayers}</span>
                <button onClick={() => setMaxPlayers(maxPlayers + 1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #D8B4FE', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 5 }}>Hiện có</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setCurrentPlayers(Math.max(1, currentPlayers - 1))} style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #D8B4FE', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#7B1FA2', minWidth: 28, textAlign: 'center' }}>{currentPlayers}</span>
                <button onClick={() => setCurrentPlayers(Math.min(maxPlayers, currentPlayers + 1))} style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #D8B4FE', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
              </div>
            </div>
          </div>
          {/* Players bar preview */}
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {Array.from({ length: maxPlayers }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < currentPlayers ? '#7B1FA2' : '#E9D5FF', transition: 'background 0.2s' }} />
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: '#7B1FA2', marginTop: 5, fontWeight: 500 }}>
            {currentPlayers}/{maxPlayers} người · Còn {maxPlayers - currentPlayers} chỗ trống
          </div>
        </div>

        {/* Level */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>TRÌNH ĐỘ</label>
          <select value={level} onChange={e => setLevel(e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
            {PLAY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Services */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>DỊCH VỤ KÈM</label>
          <button onClick={() => setShowServices(true)} style={{
            width: '100%', padding: '11px', borderRadius: 9,
            border: '1.5px solid #7B1FA2', background: '#F3E8FF',
            color: '#6D28D9', fontWeight: 600, fontSize: 13.5,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>+</span> Dịch vụ
            {services.length > 0 && <span style={{ background: '#7B1FA2', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{services.length}</span>}
          </button>
          {services.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {services.map(s => (
                <div key={s.service.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 10px', background: '#F3E8FF', borderRadius: 6 }}>
                  <span style={{ color: '#555' }}>{s.service.name} ×{s.qty}</span>
                  <span style={{ fontWeight: 600, color: '#7B1FA2' }}>{fmt(s.service.price * s.qty)}đ</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note */}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GHI CHÚ</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Ghi chú thêm..." style={{ ...inp, resize: 'none' as const, lineHeight: 1.5 }}
            onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>

        {/* Summary */}
        {selectedSlots.length > 0 && !dateError && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: '#F3E8FF', border: '1px solid #D8B4FE', fontSize: 12.5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                <span>Sân ({hours}h)</span><span style={{ fontWeight: 600 }}>{fmt(courtFee)}đ</span>
              </div>
              {serviceFee > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                <span>Dịch vụ</span><span style={{ fontWeight: 600 }}>{fmt(serviceFee)}đ</span>
              </div>}
              <div style={{ borderTop: '1px dashed #D8B4FE', paddingTop: 5, marginTop: 3, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14, color: '#7B1FA2' }}>
                <span>Tổng</span><span>{fmt(total)}đ</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#9333EA' }}>Cọc sân: {fmt(courtFee / 2)}đ</div>
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <button onClick={() => canSubmit && setShowInvoice(true)} disabled={!canSubmit} style={{
          padding: '13px', borderRadius: 10, border: 'none',
          background: canSubmit ? 'linear-gradient(135deg,#7B1FA2,#9C27B0)' : '#e0e0e0',
          color: '#fff', fontWeight: 700, fontSize: 14,
          cursor: canSubmit ? 'pointer' : 'default', fontFamily: 'inherit', marginTop: 4,
          boxShadow: canSubmit ? '0 3px 12px rgba(123,31,162,0.3)' : 'none',
        }}>Đặt trước</button>
      </div>

      {/* ── Right panel: time grid ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: '#f7f7f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Chọn thời gian</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <input type="date" value={date} min={minDate} onChange={e => setDate(e.target.value)}
              style={{ border: `1.5px solid ${dateError ? '#E53E3E' : '#e8e8e8'}`, borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555', background: '#fff' }} />
            {dateError && <div style={{ fontSize: 11, color: '#E53E3E', fontWeight: 500 }}>⚠️ Cần đặt trước ít nhất 3 ngày</div>}
            {date && !dateError && <div style={{ fontSize: 11, color: '#7B1FA2', fontWeight: 500 }}>✓ {isoToVN(date)}</div>}
          </div>
        </div>

        <div style={{ background: '#F3E8FF', borderRadius: 14, padding: '16px', border: '1px solid #D8B4FE' }}>
          <TimeSlotGrid courtId={courtId} selected={selectedSlots} onSelect={toggleSlot} />
        </div>

        {selectedSlots.length > 0 && (
          <div style={{ marginTop: 14, padding: '12px 16px', background: '#fff', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.08)', fontSize: 13 }}>
            <span style={{ color: '#888' }}>Đã chọn: </span>
            <span style={{ fontWeight: 600, color: '#7B1FA2' }}>{startTime} – {endTime}</span>
            <span style={{ color: '#aaa', marginLeft: 8 }}>({hours}h · {fmt(courtFee)}đ)</span>
          </div>
        )}
      </div>
    </div>
  );
}