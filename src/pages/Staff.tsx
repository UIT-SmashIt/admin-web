import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Staff {
  id: number;
  name: string;
  role: string;
  phone: string;
  color: string;
}

interface Shift {
  id: number;
  staffIds: number[];
  dayIndex: number; // 0 = Mon … 6 = Sun
  startHour: number;
  endHour: number;
}

type View = 'schedule' | 'staff-list' | 'history';

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

const STAFF_COLORS = [
  '#378ADD', '#D4840A', '#22863a', '#7B1FA2',
  '#C62828', '#00838F', '#F57F17', '#37474F',
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_STAFF: Staff[] = [
  { id: 1, name: 'Nguyễn Văn An', role: 'Nhân viên', phone: '0901 234 567', color: '#378ADD' },
  { id: 2, name: 'Trần Thị Bình', role: 'Nhân viên', phone: '0912 345 678', color: '#D4840A' },
  { id: 3, name: 'Lê Văn Cường', role: 'Quản lý ca', phone: '0923 456 789', color: '#22863a' },
  { id: 4, name: 'Phạm Thị Dung', role: 'Nhân viên', phone: '0934 567 890', color: '#7B1FA2' },
];

const INITIAL_SHIFTS: Shift[] = [
  { id: 1, staffIds: [1, 2], dayIndex: 0, startHour: 6, endHour: 10 },
  { id: 2, staffIds: [3], dayIndex: 0, startHour: 10, endHour: 14 },
  { id: 3, staffIds: [1, 3], dayIndex: 1, startHour: 6, endHour: 10 },
  { id: 4, staffIds: [2, 4], dayIndex: 2, startHour: 17, endHour: 21 },
  { id: 5, staffIds: [1], dayIndex: 3, startHour: 14, endHour: 21 },
  { id: 6, staffIds: [2, 3, 4], dayIndex: 5, startHour: 6, endHour: 14 },
  { id: 7, staffIds: [1, 2], dayIndex: 6, startHour: 17, endHour: 21 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeekDates(baseDate: Date) {
  const day = baseDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDate(d: Date) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Staff List Modal ─────────────────────────────────────────────────────────

function StaffListModal({
  staffList,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}: {
  staffList: Staff[];
  onAdd: (s: Omit<Staff, 'id' | 'color'>) => void;
  onEdit: (s: Staff) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState({ name: '', role: 'Nhân viên', phone: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => { setForm({ name: '', role: 'Nhân viên', phone: '' }); setMode('add'); };
  const openEdit = (s: Staff) => { setEditing(s); setForm({ name: s.name, role: s.role, phone: s.phone }); setMode('edit'); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (mode === 'add') { onAdd(form); setMode('list'); }
    else if (mode === 'edit' && editing) { onEdit({ ...editing, ...form }); setMode('list'); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e8e8e8', borderRadius: 9,
    padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', outline: 'none', background: '#fafafa',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.42)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 18, width: 520,
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        overflow: 'hidden', fontFamily: "'Be Vietnam Pro', sans-serif",
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '0.5px solid #f0f0ee', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {mode !== 'list' && (
              <button onClick={() => setMode('list')} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: '#D4840A', display: 'flex', alignItems: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
              </button>
            )}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
                {mode === 'list' ? 'Danh sách nhân viên' : mode === 'add' ? 'Thêm nhân viên' : 'Sửa thông tin'}
              </div>
              {mode === 'list' && (
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 1 }}>{staffList.length} nhân viên</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {mode === 'list' && (
              <button onClick={openAdd} style={{
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: '#D4840A', color: '#fff', fontWeight: 600, fontSize: 12.5,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Thêm mới
              </button>
            )}
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: '50%', border: 'none',
              background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {mode === 'list' ? (
            <div style={{ padding: '8px 0' }}>
              {staffList.map(s => (
                <div key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 22px', borderBottom: '0.5px solid #f5f5f3',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafaf8'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                    background: s.color + '22',
                    border: `2px solid ${s.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: s.color,
                  }}>
                    {initials(s.name)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {s.role} · {s.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(s)} style={{
                      padding: '6px 12px', borderRadius: 7, border: '1px solid #e8e8e8',
                      background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    }}>Sửa</button>
                    {deleteConfirm === s.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => { onDelete(s.id); setDeleteConfirm(null); }} style={{
                          padding: '6px 10px', borderRadius: 7, border: 'none',
                          background: '#A32D2D', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                        }}>Xóa</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{
                          padding: '6px 10px', borderRadius: 7, border: '1px solid #e0e0e0',
                          background: '#fff', color: '#666', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                        }}>Hủy</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(s.id)} style={{
                        padding: '6px 12px', borderRadius: 7,
                        border: '1px solid #FECDD3', background: '#FFF5F5',
                        color: '#A32D2D', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                      }}>Xóa</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  HỌ VÀ TÊN <span style={{ color: '#D4840A' }}>*</span>
                </label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nguyễn Văn A" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#D4840A')}
                  onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  VỊ TRÍ
                </label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'none' as const }}>
                  {['Nhân viên', 'Quản lý ca', 'Kế toán', 'Bảo vệ'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  SỐ ĐIỆN THOẠI
                </label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="09xx xxx xxx" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#D4840A')}
                  onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={handleSave} disabled={!form.name.trim()} style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: form.name.trim() ? '#D4840A' : '#e0e0e0',
                  color: '#fff', fontWeight: 700, fontSize: 14,
                  cursor: form.name.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
                }}>
                  {mode === 'add' ? '+ Thêm nhân viên' : '✓ Lưu thay đổi'}
                </button>
                <button onClick={() => setMode('list')} style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  border: '1.5px solid #e0e0e0', background: '#fff',
                  color: '#666', fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>Hủy</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shift Modal ──────────────────────────────────────────────────────────────

function ShiftModal({
  staffList,
  dayIndex,
  existing,
  onSave,
  onDelete,
  onClose,
}: {
  staffList: Staff[];
  dayIndex: number;
  existing: Shift | null;
  onSave: (s: Omit<Shift, 'id'>) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
}) {
  const [selectedStaff, setSelectedStaff] = useState<number[]>(existing?.staffIds ?? []);
  const [startHour, setStartHour] = useState(existing?.startHour ?? 6);
  const [endHour, setEndHour] = useState(existing?.endHour ?? 10);

  const toggleStaff = (id: number) =>
    setSelectedStaff(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSave = () => {
    if (!selectedStaff.length || endHour <= startHour) return;
    onSave({ staffIds: selectedStaff, dayIndex, startHour, endHour });
    onClose();
  };

  const selStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${active ? '#D4840A' : '#e0e0e0'}`,
    background: active ? '#FFF9F0' : '#fafafa', cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 13, color: active ? '#D4840A' : '#555', fontWeight: active ? 600 : 400,
    transition: 'all 0.12s',
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.42)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, width: 420, padding: '22px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
            {existing ? 'Sửa ca làm việc' : 'Thêm ca'} — {DAY_LABELS[dayIndex]}
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%', border: 'none',
            background: '#f5f5f3', cursor: 'pointer', fontSize: 13, color: '#666',
          }}>✕</button>
        </div>

        {/* Time range */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 8 }}>KHUNG GIỜ</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select value={startHour} onChange={e => setStartHour(+e.target.value)} style={{
              flex: 1, border: '1.5px solid #e8e8e8', borderRadius: 9, padding: '9px 12px',
              fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fafafa', appearance: 'none' as const,
            }}>
              {HOURS.map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}
            </select>
            <span style={{ color: '#bbb', fontWeight: 500 }}>→</span>
            <select value={endHour} onChange={e => setEndHour(+e.target.value)} style={{
              flex: 1, border: '1.5px solid #e8e8e8', borderRadius: 9, padding: '9px 12px',
              fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fafafa', appearance: 'none' as const,
            }}>
              {HOURS.filter(h => h > startHour).map(h => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}
            </select>
          </div>
          {endHour <= startHour && (
            <div style={{ color: '#A32D2D', fontSize: 11.5, marginTop: 4 }}>Giờ kết thúc phải sau giờ bắt đầu</div>
          )}
        </div>

        {/* Staff picker */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 8 }}>NHÂN VIÊN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {staffList.map(s => (
              <button key={s.id} onClick={() => toggleStaff(s.id)} style={selStyle(selectedStaff.includes(s.id))}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: s.color + '22', border: `2px solid ${s.color}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0,
                  }}>{initials(s.name)}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: '#aaa', fontWeight: 400 }}>{s.role}</div>
                  </div>
                  {selectedStaff.includes(s.id) && (
                    <span style={{ marginLeft: 'auto', color: '#D4840A', fontSize: 14 }}>✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSave} disabled={!selectedStaff.length || endHour <= startHour} style={{
            flex: 1, padding: '12px', borderRadius: 10, border: 'none',
            background: (selectedStaff.length && endHour > startHour) ? '#D4840A' : '#e0e0e0',
            color: '#fff', fontWeight: 700, fontSize: 13.5,
            cursor: (selectedStaff.length && endHour > startHour) ? 'pointer' : 'default', fontFamily: 'inherit',
          }}>
            {existing ? '✓ Lưu' : '+ Thêm ca'}
          </button>
          {existing && onDelete && (
            <button onClick={() => { onDelete(existing.id); onClose(); }} style={{
              padding: '12px 16px', borderRadius: 10, border: 'none',
              background: '#FFF5F5', color: '#A32D2D', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Xóa</button>
          )}
          <button onClick={onClose} style={{
            padding: '12px 16px', borderRadius: 10, border: '1.5px solid #e0e0e0',
            background: '#fff', color: '#666', fontWeight: 600, fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

// ─── Schedule Grid ────────────────────────────────────────────────────────────

function ScheduleGrid({
  staffList,
  shifts,
  weekDates,
  onCellClick,
  onShiftClick,
}: {
  staffList: Staff[];
  shifts: Shift[];
  weekDates: Date[];
  onCellClick: (dayIndex: number) => void;
  onShiftClick: (shift: Shift) => void;
}) {
  const HOUR_H = 36; // px per hour
  const TIME_W = 52;
  const HEADER_H = 48;

  const gridH = HOURS.length * HOUR_H;

  return (
    <div style={{ flex: 1, overflow: 'auto', position: 'relative', background: '#fff' }}>
      <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
        {/* Time column */}
        <div style={{ width: TIME_W, flexShrink: 0 }}>
          <div style={{ height: HEADER_H }} />
          {HOURS.map(h => (
            <div key={h} style={{
              height: HOUR_H, display: 'flex', alignItems: 'flex-start',
              paddingTop: 4, paddingRight: 8, justifyContent: 'flex-end',
              fontSize: 11, color: '#bbb', fontWeight: 500,
              borderTop: '0.5px solid #f0f0ee',
              boxSizing: 'border-box',
            }}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDates.map((date, di) => {
          const dayShifts = shifts.filter(s => s.dayIndex === di);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={di} style={{ flex: 1, minWidth: 80, position: 'relative' }}>
              {/* Header */}
              <div style={{
                height: HEADER_H, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                borderLeft: '0.5px solid #f0f0ee',
                background: isToday ? '#FFF9F0' : '#fafafa',
                position: 'sticky', top: 0, zIndex: 2,
                borderBottom: '1px solid #ebebeb',
              }}>
                <div style={{ fontSize: 11, color: isToday ? '#D4840A' : '#aaa', fontWeight: 600 }}>
                  {DAY_LABELS[di]}
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 700, marginTop: 2,
                  color: isToday ? '#FFFFFF' : '#1a1a1a',
                  background: isToday ? '#D4840A' : 'transparent',
                  borderRadius: '50%', width: 26, height: 26,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {date.getDate()}
                </div>
              </div>

              {/* Hour cells */}
              <div style={{ position: 'relative', height: gridH, borderLeft: '0.5px solid #f0f0ee' }}>
                {HOURS.map(h => (
                  <div
                    key={h}
                    onClick={() => onCellClick(di)}
                    style={{
                      height: HOUR_H, borderTop: '0.5px solid #f5f5f3',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FFFBF6'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
                  />
                ))}

                {/* Shift blocks */}
                {dayShifts.map(shift => {
                  const startOffset = (shift.startHour - HOURS[0]) * HOUR_H;
                  const height = (shift.endHour - shift.startHour) * HOUR_H - 2;
                  const shiftStaff = staffList.filter(s => shift.staffIds.includes(s.id));

                  return (
                    <div
                      key={shift.id}
                      onClick={e => { e.stopPropagation(); onShiftClick(shift); }}
                      style={{
                        position: 'absolute', top: startOffset + 1, left: 3, right: 3,
                        height, borderRadius: 8, overflow: 'hidden',
                        background: (shiftStaff[0]?.color ?? '#f0f0ee') + '20',
                        border: `1.5px solid ${shiftStaff[0]?.color ?? '#ccc'}44`,
                        cursor: 'pointer', padding: '5px 7px',
                        transition: 'all 0.12s',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                      }}
                    >
                      <div style={{ fontSize: 10, color: shiftStaff[0]?.color ?? '#666', fontWeight: 600, marginBottom: 3 }}>
                        {String(shift.startHour).padStart(2,'0')}:00 – {String(shift.endHour).padStart(2,'0')}:00
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {shiftStaff.map(s => (
                          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{
                              width: 14, height: 14, borderRadius: '50%',
                              background: s.color, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 7, color: '#fff', fontWeight: 700,
                            }}>{s.name[0]}</div>
                            <span style={{ fontSize: 10.5, color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.name.split(' ').slice(-1)[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── History View ─────────────────────────────────────────────────────────────

function HistoryView({
  staffList,
  shifts,
  weekDates,
  onBack,
}: {
  staffList: Staff[];
  shifts: Shift[];
  weekDates: Date[];
  onBack: () => void;
}) {
  const [filterDate, setFilterDate] = useState('');

  // Summarize shifts per staff
  const summary = staffList.map(s => ({
    staff: s,
    totalShifts: shifts.filter(sh => sh.staffIds.includes(s.id)).length,
    totalHours: shifts
      .filter(sh => sh.staffIds.includes(s.id))
      .reduce((sum, sh) => sum + (sh.endHour - sh.startHour), 0),
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
        borderBottom: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          cursor: 'pointer', color: '#D4840A', fontWeight: 600, fontSize: 14,
          fontFamily: 'inherit', padding: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Lịch sử nhân sự
        </button>
        <input
          type="week"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          style={{
            border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 12px',
            fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555',
          }}
        />
      </div>

      {/* Summary cards */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: 10, flexWrap: 'wrap', borderBottom: '0.5px solid #f0f0ee', flexShrink: 0 }}>
        {summary.map(({ staff, totalShifts, totalHours }) => (
          <div key={staff.id} style={{
            flex: '1 1 200px', padding: '14px 16px', borderRadius: 12,
            border: '1px solid #ebebeb', background: '#fafafa',
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: staff.color + '22', border: `2px solid ${staff.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: staff.color,
            }}>{initials(staff.name)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{staff.name}</div>
              <div style={{ fontSize: 11.5, color: '#888', marginTop: 2 }}>{staff.role}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <span style={{
                  fontSize: 11, background: '#FFF3E0', color: '#D4840A',
                  padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                }}>
                  {totalShifts} ca
                </span>
                <span style={{
                  fontSize: 11, background: '#E6F4EC', color: '#22863a',
                  padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                }}>
                  {totalHours}h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        <div style={{ fontSize: 12, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 0 8px' }}>
          Chi tiết ca tuần này
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f7f7f5' }}>
              {['Nhân viên', 'Ngày', 'Khung giờ', 'Số giờ'].map((h, i) => (
                <th key={h} style={{
                  padding: '9px 14px', textAlign: i > 1 ? 'center' : 'left',
                  color: '#888', fontWeight: 600, fontSize: 11.5,
                  borderBottom: '1px solid #ebebeb', letterSpacing: '0.03em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.flatMap(shift =>
              shift.staffIds.map(sid => {
                const s = staffList.find(x => x.id === sid);
                if (!s) return null;
                return (
                  <tr key={`${shift.id}-${sid}`}
                    style={{ borderBottom: '0.5px solid #f5f5f3' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                  >
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: s.color + '22', border: `1.5px solid ${s.color}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: s.color,
                        }}>{initials(s.name)}</div>
                        <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#555' }}>
                      {DAY_LABELS[shift.dayIndex]} {formatDate(weekDates[shift.dayIndex])}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', color: '#555' }}>
                      {String(shift.startHour).padStart(2,'0')}:00 – {String(shift.endHour).padStart(2,'0')}:00
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <span style={{
                        background: '#E6F4EC', color: '#22863a',
                        padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                      }}>
                        {shift.endHour - shift.startHour}h
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NhanSu() {
  const [view, setView] = useState<View>('schedule');
  const [staffList, setStaffList] = useState<Staff[]>(INITIAL_STAFF);
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [baseDate] = useState(new Date());
  const weekDates = getWeekDates(baseDate);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [shiftModal, setShiftModal] = useState<{ dayIndex: number; existing: Shift | null } | null>(null);

  const addStaff = (s: Omit<Staff, 'id' | 'color'>) => {
    const id = Math.max(0, ...staffList.map(x => x.id)) + 1;
    const color = STAFF_COLORS[id % STAFF_COLORS.length];
    setStaffList(prev => [...prev, { id, color, ...s }]);
  };

  const editStaff = (s: Staff) => setStaffList(prev => prev.map(x => x.id === s.id ? s : x));
  const deleteStaff = (id: number) => {
    setStaffList(prev => prev.filter(x => x.id !== id));
    setShifts(prev => prev.map(sh => ({ ...sh, staffIds: sh.staffIds.filter(x => x !== id) })).filter(sh => sh.staffIds.length > 0));
  };

  const addShift = (s: Omit<Shift, 'id'>) => {
    const id = Math.max(0, ...shifts.map(x => x.id)) + 1;
    setShifts(prev => [...prev, { id, ...s }]);
  };

  const deleteShift = (id: number) => setShifts(prev => prev.filter(x => x.id !== id));

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#f7f7f5', fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>
      {/* Modals */}
      {showStaffModal && (
        <StaffListModal
          staffList={staffList}
          onAdd={addStaff}
          onEdit={editStaff}
          onDelete={deleteStaff}
          onClose={() => setShowStaffModal(false)}
        />
      )}
      {shiftModal && (
        <ShiftModal
          staffList={staffList}
          dayIndex={shiftModal.dayIndex}
          existing={shiftModal.existing}
          onSave={addShift}
          onDelete={shiftModal.existing ? deleteShift : undefined}
          onClose={() => setShiftModal(null)}
        />
      )}

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px', background: '#fff',
        borderBottom: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Quản lý nhân sự</div>

        <div style={{ flex: 1 }} />

        {/* Week label */}
        {view !== 'history' && (
          <div style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid #e8e8e8',
            background: '#fafafa', fontSize: 12.5, color: '#666',
          }}>
            {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(
            [
              { key: 'schedule', label: 'Lịch làm việc' },
              { key: 'staff-list', label: 'Danh sách nhân viên' },
              { key: 'history', label: 'Lịch sử' },
            ] as { key: View; label: string }[]
          ).map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.key === 'staff-list') { setShowStaffModal(true); return; }
                setView(tab.key);
              }}
              style={{
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: view === tab.key ? '#D4840A' : '#f0f0ee',
                color: view === tab.key ? '#fff' : '#555',
                fontWeight: view === tab.key ? 600 : 400,
                fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {view === 'schedule' ? (
          <ScheduleGrid
            staffList={staffList}
            shifts={shifts}
            weekDates={weekDates}
            onCellClick={dayIndex => setShiftModal({ dayIndex, existing: null })}
            onShiftClick={shift => setShiftModal({ dayIndex: shift.dayIndex, existing: shift })}
          />
        ) : (
          <HistoryView
            staffList={staffList}
            shifts={shifts}
            weekDates={weekDates}
            onBack={() => setView('schedule')}
          />
        )}
      </div>
    </div>
  );
}