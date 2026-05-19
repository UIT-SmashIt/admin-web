import { useState } from "react";
import type {IAdmin} from "../../../../types/admin.type.ts";
import type { ISchedule, ScheduleAddPayload, ScheduleEditPayload } from "../../../../types/schedule.type.ts";
import {formatDateToYYYYMMDD, formatNumberToTime, formatTimeToNumber} from "../../../../utils/format-date.ts";
import {DAY_LABELS} from "../consts/day-label.ts";
import {HOURS} from "../consts/hours.ts";
import {initials} from "../utils/slice-name.ts";

export function ScheduleModal({
                      staffList,
                      dayIndex,
                      date,
                      existing,
                      onAdd,
                      onEdit,
                      onDelete,
                      onClose,
                    }: {
  staffList: IAdmin[];
  dayIndex: number;
  date?: Date;
  existing: ISchedule | null;
  onAdd: (s: ScheduleAddPayload) => void;
  onEdit: (id: number, s: ScheduleEditPayload) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
}) {
  const [selectedStaff, setSelectedStaff] = useState<number[]>(existing?.adminIds ?? []);
  const [startHour, setStartHour] = useState(existing ? formatTimeToNumber(existing.fromTime) : 6);
  const [endHour, setEndHour] = useState(existing ? formatTimeToNumber(existing.toTime) : 10);

  const toggleStaff = (id: number) =>
    setSelectedStaff(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSave = () => {
    if (!selectedStaff.length || endHour <= startHour) return;
    if (existing) {
      onEdit(
        existing.scheduleId,
        {
          fromTime: formatNumberToTime(startHour),
          toTime: formatNumberToTime(endHour),
          adminIds: selectedStaff
        })
    } else {
      onAdd({
        workDate: formatDateToYYYYMMDD(date),
        dayOfWeek: dayIndex,
        fromTime: formatNumberToTime(startHour),
        toTime: formatNumberToTime(endHour),
        adminIds: selectedStaff
      });
    }
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
        <button key={s.adminId} onClick={() => toggleStaff(s.adminId)} style={selStyle(selectedStaff.includes(s.adminId))}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
        width: 28, height: 28, borderRadius: '50%',
          background: s.color + '22', border: `2px solid ${s.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0,
      }}>{initials(s.adminName)}</div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.adminName}</div>
      <div style={{ fontSize: 11, color: '#aaa', fontWeight: 400 }}>{s.role}</div>
      </div>
        {selectedStaff.includes(s.adminId) && (
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
        <button onClick={() => { onDelete(existing.scheduleId); onClose(); }} style={{
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