interface TimeSlotGridProps {
  courtId?: number;
  selected: string[];
  onSelect: (slot: string) => void;
  bookedSlots?: string[];
  pendingSlots?: string[];
  timeSlots?: string[];
}

const DEFAULT_TIME_SLOTS = [
  '6:00','6:30','7:00','7:30','8:00','8:30','9:00','9:30',
  '10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00','20:30','21:00',
];

export function TimeSlotGrid({
  selected,
  onSelect,
  bookedSlots = [],
  pendingSlots = [],
  timeSlots = DEFAULT_TIME_SLOTS,
}: TimeSlotGridProps) {
  const cols = 5;
  const rows: string[][] = [];
  for (let i = 0; i < timeSlots.length; i += cols) {
    rows.push(timeSlots.slice(i, i + cols));
  }

  return (
    <div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
          {row.map(slot => {
            const isBooked = bookedSlots.includes(slot);
            const isPending = pendingSlots.includes(slot);
            const isSelected = selected.includes(slot);
            let bg = '#fff', color = '#333', border = '1px solid #e0e0e0', fw: number = 400;
            if (isBooked) { bg = '#E53E3E'; color = '#fff'; border = 'none'; }
            else if (isPending) { bg = '#F6C90E'; color = '#1a1a1a'; border = 'none'; }
            else if (isSelected) { bg = '#378ADD'; color = '#fff'; border = 'none'; fw = 700; }
            return (
              <button
                key={slot} disabled={isBooked || isPending} onClick={() => onSelect(slot)}
                style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border, background: bg, color, fontWeight: fw, fontSize: 11.5, cursor: isBooked || isPending ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.12s', minWidth: 0 }}
                onMouseEnter={e => { if (!isBooked && !isPending && !isSelected) (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; }}
                onMouseLeave={e => { if (!isBooked && !isPending && !isSelected) (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
              >{slot}</button>
            );
          })}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
        {[
          { bg: '#fff', border: '1px solid #e0e0e0', label: 'Trống' },
          { bg: '#378ADD', label: 'Lịch bạn chọn' },
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
