import { useState, useMemo } from 'react';
import { useFetchPromotions, useDeletePromotion } from '/Users/NAT/DA2/admin-web/src/hooks/usePromotion.ts';
import PromotionModal from './components/PromotionModal';
import PromotionListView from '/Users/NAT/DA2/admin-web/src/pages/admin/voucher/components/PromotionListView';
import type { IPromotion } from '/Users/NAT/DA2/admin-web/src/types/promotion.type.ts';

export default function VoucherPage() {
  const { data: promotions = [], isLoading } = useFetchPromotions();
  const { mutate: deletePromotion } = useDeletePromotion();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ mode: 'add' | 'edit' | 'view' | null; promotion: IPromotion | null }>({
    mode: null,
    promotion: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<IPromotion | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...promotions]
      .filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .sort((a, b) =>
        sortDir === 'asc'
          ? a.title.localeCompare(b.title, 'vi')
          : b.title.localeCompare(a.title, 'vi')
      );
  }, [promotions, search, sortDir]);

  const handleDelete = () => {
    if (deleteTarget) {
      deletePromotion(deleteTarget.promotionId);
      setDeleteTarget(null);
    }
  };

  const isActive = (promotion: IPromotion) => {
    const today = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return start <= today && today <= end && !promotion.hidden;
  };

  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        <div style={{ fontSize: 14, color: '#999' }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", background: '#f7f7f5' }}>
        {modal.mode && (
          <PromotionModal
            mode={modal.mode}
            promotion={modal.promotion}
            onClose={() => setModal({ mode: null, promotion: null })}
          />
        )}

        {deleteTarget && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setDeleteTarget(null)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                width: 340,
                padding: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                textAlign: 'center',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>🗑️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
                Xóa promotion?
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
                Promotion <strong style={{ color: '#D4840A' }}>{deleteTarget.title}</strong> sẽ bị xóa vĩnh viễn.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#A32D2D',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Xóa
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    border: '1.5px solid #e0e0e0',
                    background: '#fff',
                    color: '#555',
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Promotions</div>
            <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 2 }}>
              {filtered.filter(p => isActive(p)).length} đang hoạt động · {filtered.length} tổng cộng
            </div>
          </div>
          <button
            onClick={() => setModal({ mode: 'add', promotion: null })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 18px',
              borderRadius: 10,
              border: 'none',
              background: '#D4840A',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(212,132,10,0.3)',
            }}
          >
            ➕ Tạo promotion
          </button>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <svg
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#333"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm tên, mô tả..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #e8e8e8',
                borderRadius: 9,
                padding: '9px 12px 9px 34px',
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
                color: '#1a1a1a',
                background: '#fff',
              }}
              onFocus={e => (e.target.style.borderColor = '#D4840A')}
              onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
            />
          </div>
          <button
            onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}
            style={{
              padding: '9px 14px',
              borderRadius: 9,
              border: '1px solid #e8e8e8',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12.5,
              color: '#666',
              fontFamily: 'inherit',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10M11 18h2" />
            </svg>
            {sortDir === 'asc' ? 'A→Z' : 'Z→A'}
          </button>
        </div>

        {/* List View */}
        <PromotionListView
          promotions={filtered}
          onEdit={(p: IPromotion) => setModal({ mode: 'edit', promotion: p })}
          onView={(p: IPromotion) => setModal({ mode: 'view', promotion: p })}
          onDelete={(p: IPromotion) => setDeleteTarget(p)}
        />

        {filtered.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
            Hiển thị {filtered.length} / {promotions.length} promotions
          </div>
        )}
      </div>
    </>
  );
}
