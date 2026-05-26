import type { IPromotion } from '/Users/NAT/DA2/admin-web/src/types/promotion.type';

interface Props {
  promotions: IPromotion[];
  onEdit: (p: IPromotion) => void;
  onView: (p: IPromotion) => void;
  onDelete: (p: IPromotion) => void;
}

export default function PromotionListView({ promotions, onEdit, onView, onDelete }: Props) {
  const isActive = (promotion: IPromotion) => {
    const today = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return start <= today && today <= end && !promotion.hidden;
  };

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 150px 100px 120px 80px', padding: '10px 16px', background: '#fafafa', borderBottom: '0.5px solid #ebebeb', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        {['STT', 'Tiêu đề', 'Khoảng thời gian', 'Sản phẩm', 'Trạng thái', ''].map((h, i) => (
          <div
            key={i}
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: '#999',
              letterSpacing: '0.04em',
              textAlign: i === 5 ? 'center' : 'left',
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {promotions.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#bbb', fontSize: 13, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>
          Không tìm thấy promotion nào
        </div>
      ) : (
        promotions.map((p, idx) => (
          <div
            key={p.promotionId}
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr 150px 100px 120px 80px',
              padding: '13px 16px',
              borderBottom: '0.5px solid #f5f5f3',
              cursor: 'pointer',
              transition: 'background 0.1s',
              alignItems: 'center',
              opacity: isActive(p) ? 1 : 0.6,
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
            onClick={() => onView(p)}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafaf8'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
          >
            <div style={{ fontSize: 13, color: '#bbb' }}>{idx + 1}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{p.title}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{p.description}</div>
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>
              {p.startDate} - {p.endDate}
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>{p.details.length} sản phẩm</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: isActive(p) ? '#22863a' : '#d4840a' }}>
              {isActive(p) ? '✅ Hoạt động' : p.hidden ? '❌ Ẩn' : '⏸️ Chưa bắt đầu'}
            </div>
            <div
              style={{ display: 'flex', gap: 6, justifyContent: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(p)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: '1px solid #e8e8e8',
                  background: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0';
                  (e.currentTarget as HTMLButtonElement).style.color = '#D4840A';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                  (e.currentTarget as HTMLButtonElement).style.color = '#666';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(p)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: '1px solid #e8e8e8',
                  background: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#bbb',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5';
                  (e.currentTarget as HTMLButtonElement).style.color = '#A32D2D';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                  (e.currentTarget as HTMLButtonElement).style.color = '#bbb';
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
