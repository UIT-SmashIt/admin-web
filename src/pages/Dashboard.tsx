import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

interface SlotStat {
  time: string;
  count: number;
  pct: number;
}

interface ProductStat {
  rank: number;
  name: string;
  revenue: string;
}

// ─── Mock const ────────────────────────────────────────────────────────────────

const METRICS: MetricCard[] = [
  { label: 'Doanh thu hôm nay', value: '4,2M', change: '▲ 12% so với hôm qua', trend: 'up' },
  { label: 'Lượt đặt sân', value: '38', change: '▲ 5 lượt so với hôm qua', trend: 'up' },
  { label: 'Doanh thu bán hàng', value: '1,1M', change: '▼ 3% so với hôm qua', trend: 'down' },
  { label: 'Đơn chờ duyệt', value: '7', change: 'Cần xử lý ngay', trend: 'neutral' },
];

const SLOTS: SlotStat[] = [
  { time: '06:00 – 08:00', count: 21, pct: 55 },
  { time: '08:00 – 10:00', count: 14, pct: 38 },
  { time: '17:00 – 19:00', count: 38, pct: 100 },
  { time: '19:00 – 21:00', count: 33, pct: 87 },
  { time: '21:00 – 22:00', count: 11, pct: 29 },
];

const PRODUCTS: ProductStat[] = [
  { rank: 1, name: 'Cầu lông Yonex AS-05', revenue: '620K' },
  { rank: 2, name: 'Nước ion Pocari', revenue: '380K' },
  { rank: 3, name: 'Vợt Victor JS-12', revenue: '240K' },
  { rank: 4, name: 'Quấn cán Li-Ning', revenue: '145K' },
  { rank: 5, name: 'Băng cổ tay Yonex', revenue: '98K' },
];

const WEEKLY_COURT = [2800, 3100, 2600, 4200, 3900, 5100, 4700];
const WEEKLY_SALES = [900, 1100, 800, 1100, 1000, 1600, 1300];
const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayLabel() {
  const d = new Date();
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function trendColor(trend: MetricCard['trend']) {
  if (trend === 'up') return '#3B6D11';
  if (trend === 'down') return '#A32D2D';
  return '#888';
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricCardUI({ card }: { card: MetricCard }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: 12,
        padding: '14px 16px',
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 11.5, color: '#888', marginBottom: 6 }}>{card.label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#1a1a1a', lineHeight: 1 }}>{card.value}</div>
      <div style={{ fontSize: 11, color: trendColor(card.trend), marginTop: 5 }}>{card.change}</div>
    </div>
  );
}

function RevenueBarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    async function init() {
      // @ts-expect-error chart.js loaded via CDN script tag
      const Chart = window.Chart;
      if (!Chart || !canvasRef.current) return;

      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
          labels: DAYS,
          datasets: [
            {
              label: 'Đặt sân',
              data: WEEKLY_COURT,
              backgroundColor: '#378ADD',
              borderRadius: 4,
              borderSkipped: false,
            },
            {
              label: 'Bán hàng',
              data: WEEKLY_SALES,
              backgroundColor: '#D4840A',
              borderRadius: 4,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: { font: { size: 11 }, color: '#999' },
            },
            y: {
              stacked: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                font: { size: 11 },
                color: '#999',
                callback: (v: unknown) => `${Number(v) / 1000}K`,
              },
            },
          },
        },
      });
    }

    init();
    return () => {
      if (chartRef.current) (chartRef.current as { destroy: () => void }).destroy();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 180 }}>
      <canvas ref={canvasRef} role="img" aria-label="Biểu đồ doanh thu 7 ngày qua" />
    </div>
  );
}

function DonutChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    async function init() {
      // @ts-expect-error chart.js loaded via CDN script tag
      const Chart = window.Chart;
      if (!Chart || !canvasRef.current) return;

      if (chartRef.current) (chartRef.current as { destroy: () => void }).destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Đặt sân', 'Bán hàng', 'Khác'],
          datasets: [
            {
              data: [68, 26, 6],
              backgroundColor: ['#378ADD', '#D4840A', '#639922'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: { legend: { display: false } },
        },
      });
    }

    init();
    return () => {
      if (chartRef.current) (chartRef.current as { destroy: () => void }).destroy();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 148 }}>
      <canvas ref={canvasRef} role="img" aria-label="Biểu đồ cơ cấu doanh thu" />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
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
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>Dashboard</div>
          <div style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>
            Tổng quan hoạt động hôm nay
          </div>
        </div>
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
          {todayLabel()}
        </div>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {METRICS.map((card) => (
          <MetricCardUI key={card.label} card={card} />
        ))}
      </div>

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 14,
          marginBottom: 14,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Revenue bar chart */}
        <div
          style={{
            background: '#fff',
            border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 14 }}>
            Doanh thu 7 ngày qua
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
            <LegendDot color="#378ADD" label="Đặt sân" />
            <LegendDot color="#D4840A" label="Bán hàng" />
          </div>
          <RevenueBarChart />
        </div>

        {/* Donut chart */}
        <div
          style={{
            background: '#fff',
            border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 10 }}>
            Cơ cấu doanh thu
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <LegendDot color="#378ADD" label="Đặt sân 68%" />
            <LegendDot color="#D4840A" label="Bán hàng 26%" />
            <LegendDot color="#639922" label="Khác 6%" />
          </div>
          <DonutChart />
        </div>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Popular slots */}
        <div
          style={{
            background: '#fff',
            border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 12 }}>
            Khung giờ đặt sân phổ biến
          </div>
          {SLOTS.map((slot) => (
            <div
              key={slot.time}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 0',
                borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                fontSize: 12.5,
              }}
            >
              <span style={{ color: '#888', minWidth: 110 }}>{slot.time}</span>
              <div
                style={{
                  flex: 1,
                  margin: '0 10px',
                  height: 4,
                  background: '#f0f0ee',
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    width: `${slot.pct}%`,
                    height: 4,
                    background: '#D4840A',
                    borderRadius: 2,
                  }}
                />
              </div>
              <span style={{ fontWeight: 500, color: '#1a1a1a', minWidth: 50, textAlign: 'right' }}>
                {slot.count} lượt
              </span>
            </div>
          ))}
        </div>

        {/* Top products */}
        <div
          style={{
            background: '#fff',
            border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 12 }}>
            Sản phẩm bán chạy
          </div>
          {PRODUCTS.map((p) => (
            <div
              key={p.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 0',
                borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                fontSize: 12.5,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: p.rank === 1 ? '#FAEEDA' : '#f0f0ee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 500,
                  color: p.rank === 1 ? '#854F0B' : '#888',
                  flexShrink: 0,
                }}
              >
                {p.rank}
              </div>
              <div style={{ flex: 1, color: '#1a1a1a' }}>{p.name}</div>
              <div style={{ fontWeight: 500, color: '#1a1a1a' }}>{p.revenue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#888' }}>
      <span
        style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }}
      />
      {label}
    </span>
  );
}