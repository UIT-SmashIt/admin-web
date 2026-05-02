import { useState } from 'react';
import {
  useAddSchedule,
  useEditSchedule,
  useFetchSchedules,
  useRemoveSchedule
} from "../../../hooks/useSchedule.ts";
import { Spin } from 'antd';
import type {ISchedule, ScheduleAddPayload, ScheduleEditPayload} from "../../../types/schedule.type.ts";
import type {AdminUpdatePayload} from "../../../types/admin.type.ts";
import {useEditAdmin, useFetchAdmins, useRemoveAdmin} from "../../../hooks/useAdmin.ts";
import {ScheduleGrid} from "./components/ScheduleGrid.tsx";
import {ScheduleModal} from "./components/ScheduleModal.tsx";
import {AdminListModal} from "./components/AdminListModal.tsx";
import {HistoryView} from "./components/HistoryView.tsx";
import {formatDate} from "./utils/format-date-string.ts";

type View = 'schedule' | 'staff-list' | 'history';

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

export default function NhanSu() {
  const [view, setView] = useState<View>('schedule');
  const { data: admins, isLoading: adminsLoading } = useFetchAdmins();
  const { mutate: editAdmin } = useEditAdmin();
  const { mutate: removeAdmin } = useRemoveAdmin();
  const { data: schedules, isLoading: schedulesLoading} = useFetchSchedules();
  const { mutate: addSchedule } = useAddSchedule();
  const { mutate: editSchedule } = useEditSchedule();
  const { mutate: removeSchedule } = useRemoveSchedule();
  const [baseDate] = useState(new Date());
  const weekDates = getWeekDates(baseDate);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [shiftModal, setShiftModal] = useState<{ dayIndex: number; date?: Date, existing: ISchedule | null } | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const editStaff = (id: number,s: AdminUpdatePayload) => {
    editAdmin({id, data: s});
    showToast('✓ Đã cập nhật');
  }
  const deleteStaff = (id: number) => {
    removeAdmin(id);
    showToast('✓ Đã xóa');
  };

  const addShift = (newSchedule: ScheduleAddPayload) => {
    addSchedule(newSchedule);
    showToast('✓ Đã thêm lịch: ' + newSchedule.workDate);
  };

  const editShift = (id: number, schedule: ScheduleEditPayload) => {
    editSchedule({id, data: schedule});
    showToast('✓ Đã cập nhật');
  };

  const deleteShift = (id: number) => {
    removeSchedule(id);
    showToast('✓ Đã xóa');
  }

  if (schedulesLoading || adminsLoading) {
    return <Spin fullscreen/>
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#f7f7f5', fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>
      {toast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' as const, pointerEvents: 'none' as const }}>
          {toast}
        </div>
      )}
      {/* Modals */}
      {showStaffModal && (
        <AdminListModal
          staffList={admins ?? []}
          onEdit={editStaff}
          onDelete={deleteStaff}
          onClose={() => setShowStaffModal(false)}
        />
      )}
      {shiftModal && (
        <ScheduleModal
          staffList={admins ?? []}
          dayIndex={shiftModal.dayIndex}
          date={shiftModal.date}
          existing={shiftModal.existing}
          onAdd={addShift}
          onEdit={editShift}
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
            staffList={admins ?? []}
            shifts={schedules ?? []}
            weekDates={weekDates}
            onCellClick={({dayIndex, date}) => setShiftModal({ dayIndex, date, existing: null })}
            onShiftClick={shift => setShiftModal({ dayIndex: shift.dayOfWeek, existing: shift })}
          />
        ) : (
          <HistoryView
            staffList={admins ?? []}
            shifts={schedules ?? []}
            weekDates={weekDates}
            onBack={() => setView('schedule')}
          />
        )}
      </div>
    </div>
  );
}