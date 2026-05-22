import { useState } from 'react';
import { COURTS } from './consts/courts';
import { MOCK_ORDERS } from './consts/mock-orders';
import { toInputValue, formatDate } from './utils/helpers';
import { globalStyles } from './utils/styles';
import { AllCourtsView } from './components/AllCourtsView';
import { CourtDetailView } from './components/CourtDetailView';

export default function CourtStatus() {
  const [view, setView] = useState<'all' | 'court'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(toInputValue(new Date()));
  const [selectedCourt, setSelectedCourt] = useState<string>(COURTS[0]);
  const [selectedSlot, setSelectedSlot] = useState<{ court: string; time: string } | null>(null);

  // In production, replace MOCK_ORDERS with a fetch/query filtered by selectedDate
  const orders = MOCK_ORDERS;

  const handleSlotClick = (court: string, time: string) => {
    setSelectedSlot((prev) =>
      prev?.court === court && prev?.time === time ? null : { court, time }
    );
    if (view === 'court') setSelectedCourt(court);
  };

  const handleCourtChange = (court: string) => {
    setSelectedCourt(court);
    setSelectedSlot(null);
  };

  const displayDate = formatDate(new Date(selectedDate + 'T00:00:00'));

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 0',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        background: '#f7f7f5',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <style>{globalStyles}</style>

      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingLeft: 24,
          paddingRight: 24,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>Trạng thái sân</div>
          <div style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>Lịch đặt sân theo ngày</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '0.5px solid rgba(0,0,0,0.12)',
              background: '#fff',
              color: '#1a1a1a',
              fontSize: 12.5,
              fontFamily: 'inherit',
            }}
          />
          <div
            style={{
              fontSize: 12,
              color: '#888',
              background: '#fff',
              padding: '6px 12px',
              borderRadius: 8,
              border: '0.5px solid rgba(0,0,0,0.08)',
            }}
          >
            {displayDate}
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 24,
          paddingRight: 24,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* View toggle */}
        <div
          style={{
            display: 'flex',
            border: '0.5px solid rgba(0,0,0,0.12)',
            borderRadius: 8,
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {(['all', 'court'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 16px',
                fontSize: 12.5,
                background: view === v ? '#378ADD' : 'transparent',
                color: view === v ? '#fff' : '#888',
                fontWeight: view === v ? 500 : 400,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {v === 'all' ? 'Tất cả sân' : 'Theo sân'}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto' }}>
          {[
            { color: '#C0DD97', label: 'Trống' },
            { color: '#F7C1C1', label: 'Đã đặt' },
          ].map(({ color, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ paddingLeft: 24, paddingRight: 24 }}>
        {view === 'all' ? (
          <AllCourtsView orders={orders} selectedSlot={selectedSlot} onSlotClick={handleSlotClick} />
        ) : (
          <CourtDetailView
            orders={orders}
            selectedCourt={selectedCourt}
            selectedSlot={selectedSlot}
            onCourtChange={handleCourtChange}
            onSlotClick={handleSlotClick}
          />
        )}
      </div>
    </div>
  );
}
