import type {IAdmin} from "../../../../types/admin.type.ts";
import type {ISchedule} from "../../../../types/schedule.type.ts";
import {useState} from "react";
import {formatTimeToNumber} from "../../../../utils/format-date.ts";
import {initials} from "../utils/slice-name.ts";
import {DAY_LABELS} from "../consts/day-label.ts";
import {formatDate} from "../utils/format-date-string.ts";

export function HistoryView({
                       staffList,
                       shifts,
                       weekDates,
                       onBack,
                     }: {
  staffList: IAdmin[];
  shifts: ISchedule[];
  weekDates: Date[];
  onBack: () => void;
}) {
  const [filterDate, setFilterDate] = useState('');

  // Summarize shifts per staff
  const summary = staffList.map(s => ({
    staff: s,
    totalShifts: shifts.filter(sh => sh.adminIds.includes(s.adminId)).length,
    totalHours: shifts
      .filter(sh => sh.adminIds.includes(s.adminId))
      .reduce((sum, sh) => sum + (formatTimeToNumber(sh.toTime) - formatTimeToNumber(sh.fromTime)), 0),
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
          <div key={staff.adminId} style={{
            flex: '1 1 200px', padding: '14px 16px', borderRadius: 12,
            border: '1px solid #ebebeb', background: '#fafafa',
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: staff.color + '22', border: `2px solid ${staff.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: staff.color,
            }}>{initials(staff.adminName)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{staff.adminName}</div>
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
            shift.adminIds.map(sid => {
              const s = staffList.find(x => x.adminId === sid);
              if (!s) return null;
              return (
                <tr key={`${shift.adminIds}-${sid}`}
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
                      }}>{initials(s.adminName)}</div>
                      <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{s.adminName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#555' }}>
                    {DAY_LABELS[shift.dayOfWeek]} {formatDate(weekDates[shift.dayOfWeek])}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#555' }}>
                    {shift.fromTime} – {shift.toTime}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <span style={{
                        background: '#E6F4EC', color: '#22863a',
                        padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                      }}>
                        {formatTimeToNumber(shift.toTime) - formatTimeToNumber(shift.fromTime)}h
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