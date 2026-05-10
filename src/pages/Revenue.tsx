import { useState } from 'react';

// ─── Global Styles ────────────────────────────────────────────────────────────
const globalStyles = `
  html, body {
    color-scheme: light;
  }
  * {
    color-scheme: light;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourtStat {
  name: string;
  hours: number;
  revenue: number;
}

interface ServiceStat {
  name: string;
  qty: number;
  unit: string;
  revenue: number;
}

type Period = 'day' | 'week' | 'month' | 'custom';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const COURT_DATA: Record<Period, CourtStat[]> = {
  day: [
    { name: 'Sân 1', hours: 8, revenue: 640000 },
    { name: 'Sân 2', hours: 5, revenue: 400000 },
    { name: 'Sân 3', hours: 11, revenue: 880000 },
  ],
  week: [
    { name: 'Sân 1', hours: 36, revenue: 2780000 },
    { name: 'Sân 2', hours: 18, revenue: 1390000 },
    { name: 'Sân 3', hours: 67, revenue: 4780000 },
  ],
  month: [
    { name: 'Sân 1', hours: 142, revenue: 10800000 },
    { name: 'Sân 2', hours: 98, revenue: 7400000 },
    { name: 'Sân 3', hours: 210, revenue: 15600000 },
  ],
  custom: [
    { name: 'Sân 1', hours: 22, revenue: 1680000 },
    { name: 'Sân 2', hours: 14, revenue: 1050000 },
    { name: 'Sân 3', hours: 38, revenue: 2900000 },
  ],
};

const SERVICE_DATA: Record<Period, ServiceStat[]> = {
  day: [
    { name: 'Vợt', qty: 5, unit: 'cái', revenue: 215000 },
    { name: 'Coca', qty: 12, unit: 'chai', revenue: 180000 },
    { name: 'Cầu lông', qty: 3, unit: 'hộp', revenue: 660000 },
  ],
  week: [
    { name: 'Vợt', qty: 36, unit: 'cái', revenue: 1550000 },
    { name: 'Coca', qty: 18, unit: 'chai', revenue: 600000 },
    { name: 'Cầu lông', qty: 12, unit: 'hộp', revenue: 2640000 },
    { name: 'Nước suối', qty: 44, unit: 'chai', revenue: 352000 },
  ],
  month: [
    { name: 'Vợt', qty: 120, unit: 'cái', revenue: 5200000 },
    { name: 'Coca', qty: 340, unit: 'chai', revenue: 5100000 },
    { name: 'Cầu lông', qty: 88, unit: 'hộp', revenue: 19360000 },
    { name: 'Nước suối', qty: 210, unit: 'chai', revenue: 1680000 },
    { name: 'Snack', qty: 95, unit: 'gói', revenue: 475000 },
  ],
  custom: [
    { name: 'Vợt', qty: 14, unit: 'cái', revenue: 612000 },
    { name: 'Coca', qty: 28, unit: 'chai', revenue: 420000 },
    { name: 'Cầu lông', qty: 9, unit: 'hộp', revenue: 1980000 },
  ],
};

const WEEKLY_CHART = [
  { day: 'T2', court: 980000, service: 320000 },
  { day: 'T3', court: 1200000, service: 410000 },
  { day: 'T4', court: 750000, service: 280000 },
  { day: 'T5', court: 1600000, service: 520000 },
  { day: 'T6', court: 1450000, service: 480000 },
  { day: 'T7', court: 2100000, service: 680000 },
  { day: 'CN', court: 1800000, service: 560000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n >= 1000000
    ? (n / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M'
    : n.toLocaleString('vi-VN');

const fmtFull = (n: number) => n.toLocaleString('vi-VN');

function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: typeof WEEKLY_CHART }) {
  const maxVal = Math.max(...data.map(d => d.court + d.service));

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, padding: '0 4px' }}>
      {data.map((d, i) => {
        const total = d.court + d.service;
        const courtH = (d.court / maxVal) * 100;
        const serviceH = (d.service / maxVal) * 100;
        return (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{
              width: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'stretch', justifyContent: 'flex-end', height: 96, gap: 1,
              position: 'relative',
            }}>
              {/* Tooltip on hover */}
              <div style={{
                position: 'absolute', bottom: '105%', left: '50%', transform: 'translateX(-50%)',
                background: '#1a1a1a', color: '#fff', borderRadius: 6, padding: '4px 8px',
                fontSize: 10.5, whiteSpace: 'nowrap', pointerEvents: 'none',
                opacity: 0, transition: 'opacity 0.15s',
              }} className="chart-tooltip">
                {fmt(total)}
              </div>
              <div style={{ height: `${serviceH}%`, background: '#D4840A', borderRadius: '3px 3px 0 0', minHeight: 2 }} />
              <div style={{ height: `${courtH}%`, background: '#378ADD', borderRadius: serviceH > 0 ? 0 : '3px 3px 0 0', minHeight: 2 }} />
            </div>
            <span style={{ fontSize: 10, color: '#aaa', fontWeight: 500 }}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Revenue Table ────────────────────────────────────────────────────────────

function CourtTable({ data }: { data: CourtStat[] }) {
  const totalHours = data.reduce((s, r) => s + r.hours, 0);
  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0);
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div style={{
      flex: 1, background: '#fff', borderRadius: 14,
      border: '0.5px solid rgba(0,0,0,0.08)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 80px 110px',
        padding: '10px 16px', background: '#fafafa',
        borderBottom: '0.5px solid #ebebeb',
      }}>
        {['Dịch vụ', 'Số lượng', 'Tổng tiền'].map((h, i) => (
          <div key={h} style={{
            fontSize: 12, fontWeight: 600, color: '#999',
            textAlign: i === 0 ? 'left' : 'right',
            letterSpacing: '0.03em',
          }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1 }}>
        {data.map((row, i) => {
          const barPct = (row.revenue / maxRevenue) * 100;
          return (
            <div key={i} style={{ position: 'relative', borderBottom: '0.5px solid #f5f5f3' }}>
              {/* Progress bar background */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${barPct * 0.6}%`,
                background: '#378ADD0A',
                pointerEvents: 'none',
              }} />
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 110px',
                padding: '14px 16px', position: 'relative',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(55,138,221,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: ['#378ADD', '#D4840A', '#22863a', '#7B1FA2'][i % 4],
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{row.name}</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13.5, color: '#555' }}>
                  {row.hours}h
                </div>
                <div style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: '#1a1a1a' }}>
                  {fmtFull(row.revenue)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 80px 110px',
        padding: '13px 16px',
        background: '#D4840A',
        borderTop: '2px solid #D4840A',
      }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>Tổng</div>
        <div style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: '#fff' }}>
          {totalHours}h
        </div>
        <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 800, color: '#fff' }}>
          {fmtFull(totalRevenue)}
        </div>
      </div>
    </div>
  );
}

function ServiceTable({ data }: { data: ServiceStat[] }) {
  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0);
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div style={{
      flex: 1, background: '#fff', borderRadius: 14,
      border: '0.5px solid rgba(0,0,0,0.08)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 90px 110px',
        padding: '10px 16px', background: '#fafafa',
        borderBottom: '0.5px solid #ebebeb',
      }}>
        {['Dịch vụ', 'Số lượng', 'Tổng tiền'].map((h, i) => (
          <div key={h} style={{
            fontSize: 12, fontWeight: 600, color: '#999',
            textAlign: i === 0 ? 'left' : 'right',
            letterSpacing: '0.03em',
          }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1 }}>
        {data.map((row, i) => {
          const barPct = (row.revenue / maxRevenue) * 100;
          return (
            <div key={i} style={{ position: 'relative', borderBottom: '0.5px solid #f5f5f3' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${barPct * 0.6}%`,
                background: '#D4840A0A',
                pointerEvents: 'none',
              }} />
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 90px 110px',
                padding: '14px 16px', position: 'relative',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(212,132,10,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: ['#D4840A', '#378ADD', '#22863a', '#7B1FA2', '#C62828'][i % 5],
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{row.name}</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13.5, color: '#555' }}>
                  {row.qty} {row.unit}
                </div>
                <div style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: '#1a1a1a' }}>
                  {fmtFull(row.revenue)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 90px 110px',
        padding: '13px 16px',
        background: '#D4840A',
      }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>Tổng</div>
        <div style={{ textAlign: 'right', fontSize: 13.5, color: '#fff', fontWeight: 600 }} />
        <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 800, color: '#fff' }}>
          {fmtFull(totalRevenue)}
        </div>
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  label, value, sub, color, icon,
}: {
  label: string; value: string; sub: string; color: string; icon: React.ReactNode;
}) {
  return (
    <div style={{
      flex: '1 1 0', background: '#fff', borderRadius: 14,
      border: '0.5px solid rgba(0,0,0,0.08)',
      padding: '16px 18px', minWidth: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#aaa', fontWeight: 500 }}>{label}</div>
        <div style={{
          width: 32, height: 32, borderRadius: 9, background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, flexShrink: 0,
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoanhThu() {
  const [period, setPeriod] = useState<Period>('week');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const courts = COURT_DATA[period];
  const services = SERVICE_DATA[period];

  const totalCourtRev = courts.reduce((s, r) => s + r.revenue, 0);
  const totalServiceRev = services.reduce((s, r) => s + r.revenue, 0);
  const grandTotal = totalCourtRev + totalServiceRev;
  const totalHours = courts.reduce((s, r) => s + r.hours, 0);

  const periodLabel: Record<Period, string> = {
    day: 'hôm nay',
    week: 'tuần này',
    month: 'tháng này',
    custom: 'tùy chọn',
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 24px',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        background: '#f7f7f5',
      }}>
      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Doanh thu</div>
          <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 2 }}>
            Thống kê {periodLabel[period]} · {todayStr()}
          </div>
        </div>

        {/* Period selector */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['day', 'week', 'month', 'custom'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '7px 14px', borderRadius: 8,
                background: period === p ? '#D4840A' : '#fff',
                color: period === p ? '#fff' : '#666',
                fontWeight: period === p ? 600 : 400,
                fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${period === p ? '#D4840A' : '#e8e8e8'}`,
                transition: 'all 0.15s',
              }}
            >
              {p === 'day' ? 'Hôm nay' : p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Tùy chọn'}
            </button>
          ))}

          {period === 'custom' && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                style={{
                  border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 10px',
                  fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555',
                }} />
              <span style={{ color: '#bbb', fontSize: 12 }}>→</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                style={{
                  border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 10px',
                  fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555',
                }} />
            </div>
          )}
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <MetricCard
          label="Tổng doanh thu"
          value={fmt(grandTotal) + 'đ'}
          sub={`Đặt sân + Dịch vụ`}
          color="#D4840A"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
        <MetricCard
          label="Doanh thu đặt sân"
          value={fmt(totalCourtRev) + 'đ'}
          sub={`${totalHours}h · ${courts.length} sân`}
          color="#378ADD"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          }
        />
        <MetricCard
          label="Doanh thu dịch vụ"
          value={fmt(totalServiceRev) + 'đ'}
          sub={`${services.length} loại dịch vụ`}
          color="#22863a"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
          }
        />
        <MetricCard
          label="Tỷ lệ dịch vụ"
          value={grandTotal ? Math.round(totalServiceRev / grandTotal * 100) + '%' : '—'}
          sub="so với tổng doanh thu"
          color="#7B1FA2"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          }
        />
      </div>

      {/* Chart + Tables row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* ── Left: Thống kê sân ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#1a1a1a',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 4, height: 16, background: '#378ADD', borderRadius: 2 }} />
            Thống kê sân
          </div>
          <CourtTable data={courts} />
        </div>

        {/* ── Right: Thống kê dịch vụ ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#1a1a1a',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 4, height: 16, background: '#D4840A', borderRadius: 2 }} />
            Thống kê dịch vụ
          </div>
          <ServiceTable data={services} />
        </div>
      </div>

      {/* Chart section */}
      <div style={{
        background: '#fff', borderRadius: 14,
        border: '0.5px solid rgba(0,0,0,0.08)',
        padding: '18px 20px',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Doanh thu 7 ngày qua</div>
            <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 2 }}>Đặt sân và dịch vụ</div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[{ color: '#378ADD', label: 'Đặt sân' }, { color: '#D4840A', label: 'Dịch vụ' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#888' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <MiniBarChart data={WEEKLY_CHART} />

        {/* Y-axis labels */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 10,
          paddingTop: 10, borderTop: '0.5px solid #f0f0ee',
        }}>
          {WEEKLY_CHART.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#1a1a1a' }}>
                {fmt(d.court + d.service)}
              </div>
              <div style={{ fontSize: 10, color: '#bbb', marginTop: 1 }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grand total banner */}
      <div style={{
        marginTop: 16, padding: '16px 22px',
        background: 'linear-gradient(135deg, #D4840A, #F5A623)',
        borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(212,132,10,0.25)',
      }}>
        <div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
            Tổng cộng {periodLabel[period]}
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginTop: 2 }}>
            {fmtFull(grandTotal)}đ
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Đặt sân</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{fmtFull(totalCourtRev)}đ</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Dịch vụ</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{fmtFull(totalServiceRev)}đ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}