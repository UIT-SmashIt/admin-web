import type {IAdmin} from "../../../../types/admin.type.ts";
import type {ISchedule} from "../../../../types/schedule.type.ts";
import {HOURS} from "../consts/hours.ts";
import {DAY_LABELS} from "../consts/day-label.ts";
import {formatTimeToNumber} from "../../../../utils/format-date.ts";

export function ScheduleGrid({
                        staffList,
                        shifts,
                        weekDates,
                        onCellClick,
                        onShiftClick,
                      }: {
  staffList: IAdmin[];
  shifts: ISchedule[];
  weekDates: Date[];
  onCellClick: ({dayIndex, date}: {dayIndex: number, date: Date}) => void;
  onShiftClick: (shift: ISchedule) => void;
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
          const dayShifts = shifts.filter(s => s.dayOfWeek === di);
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
                    onClick={() => onCellClick({ dayIndex: di, date})}
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
                  const startOffset = (formatTimeToNumber(shift.fromTime) - HOURS[0]) * HOUR_H;
                  const height = (formatTimeToNumber(shift.toTime) - formatTimeToNumber(shift.fromTime)) * HOUR_H - 2;
                  const shiftStaff = staffList.filter(s => shift.adminIds.includes(s.adminId));

                  return (
                    <div
                      key={shift.scheduleId}
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
                        {shift.fromTime.padStart(2,'0')}:00 – {shift.toTime.padStart(2,'0')}:00
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {shiftStaff.map(s => (
                          <div key={s.adminId} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{
                              width: 14, height: 14, borderRadius: '50%',
                              background: s.color, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 7, color: '#fff', fontWeight: 700,
                            }}>{s.adminName[0]}</div>
                            <span style={{ fontSize: 10.5, color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.adminName.split(' ').slice(-1)[0]}
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