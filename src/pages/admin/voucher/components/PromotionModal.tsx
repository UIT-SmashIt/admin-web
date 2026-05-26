import { useState } from 'react';
import { useAddPromotion, useEditPromotion } from '/Users/NAT/DA2/admin-web/src/hooks/usePromotion.ts';
import type { IPromotion, IPromotionDetail } from '/Users/NAT/DA2/admin-web/src/types/promotion.type.ts';

interface Props {
  mode: 'add' | 'edit' | 'view';
  promotion: IPromotion | null;
  onClose: () => void;
}

export default function PromotionModal({ mode, promotion, onClose }: Props) {
  const isView = mode === 'view';
  const { mutate: addPromotion, isPending: isAdding } = useAddPromotion();
  const { mutate: editPromotion, isPending: isEditing } = useEditPromotion();

  const [form, setForm] = useState({
    title: promotion?.title ?? '',
    description: promotion?.description ?? '',
    startDate: promotion?.startDate ?? '',
    endDate: promotion?.endDate ?? '',
    hidden: promotion?.hidden ?? false,
    details: promotion?.details ?? [],
  });

  const [detailForm, setDetailForm] = useState({
    productId: 0,
    minQuantity: 0,
  });

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleAddDetail = () => {
    if (detailForm.productId > 0 && detailForm.minQuantity > 0) {
      setForm(f => ({
        ...f,
        details: [
          ...f.details,
          {
            promotionDetailId: Date.now(),
            productId: detailForm.productId,
            minQuantity: detailForm.minQuantity,
          },
        ],
      }));
      setDetailForm({ productId: 0, minQuantity: 0 });
    }
  };

  const handleRemoveDetail = (detailId: number) => {
    setForm(f => ({
      ...f,
      details: f.details.filter((d: IPromotionDetail) => d.promotionDetailId !== detailId),
    }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim() || !form.startDate || !form.endDate) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (mode === 'add') {
      addPromotion({
        ...form,
        details: form.details.map((d: IPromotionDetail) => ({ ...d, promotionDetailId: 0 })),
      });
    } else if (mode === 'edit' && promotion) {
      editPromotion({
        id: promotion.promotionId,
        data: {
          promotionId: promotion.promotionId,
          ...form,
        },
      });
    }
    onClose();
  };

  const inp: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    border: '1.5px solid #e8e8e8',
    borderRadius: 9,
    padding: '10px 13px',
    fontSize: 13.5,
    fontFamily: 'inherit',
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          width: 600,
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '0.5px solid #f0f0ee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
            {mode === 'add' ? '➕ Tạo promotion' : mode === 'edit' ? '✏️ Chỉnh sửa promotion' : '👁️ Chi tiết promotion'}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              border: 'none',
              background: '#f5f5f3',
              cursor: 'pointer',
              fontSize: 14,
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
          {isView && promotion ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #FFF7ED, #FFF3E0)',
                  border: '1px solid #FDE68A',
                }}
              >
                <div style={{ fontSize: 11, color: '#B45309', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>
                  TIÊU ĐỀ
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#D4840A', letterSpacing: '0.04em' }}>
                  {promotion.title}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Bắt đầu', value: promotion.startDate },
                  { label: 'Kết thúc', value: promotion.endDate },
                  { label: 'Mô tả', value: promotion.description },
                  { label: 'Trạng thái', value: promotion.hidden ? '❌ Ẩn' : '✅ Hiển thị' },
                ].map(f => (
                  <div key={f.label} style={{ padding: '12px 14px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0ee' }}>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, fontWeight: 500 }}>{f.label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              {promotion.details.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 600 }}>SẢN PHẨM</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {promotion.details.map((d: IPromotionDetail) => (
                      <div
                        key={d.promotionDetailId}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: '#f5f5f5',
                          border: '1px solid #efefef',
                          fontSize: 12,
                          color: '#555',
                        }}
                      >
                        ID {d.productId} - Tối thiểu {d.minQuantity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>
                  TIÊU ĐỀ *
                </label>
                <input
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Tên promotion..."
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = '#D4840A')}
                  onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
                />
              </div>

              <div>
                <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>
                  MÔ TẢ *
                </label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Mô tả chi tiết..."
                  style={{ ...inp, minHeight: 80, resize: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#D4840A')}
                  onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>
                    NGÀY BẮT ĐẦU
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => set('startDate', e.target.value)}
                    style={inp}
                    onFocus={e => (e.target.style.borderColor = '#D4840A')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>
                    NGÀY KẾT THÚC
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => set('endDate', e.target.value)}
                    style={inp}
                    onFocus={e => (e.target.style.borderColor = '#D4840A')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => set('hidden', !form.hidden)}
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    border: 'none',
                    cursor: 'pointer',
                    background: !form.hidden ? '#D4840A' : '#e0e0e0',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: 2,
                      left: !form.hidden ? 20 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
                <span style={{ fontSize: 13, color: !form.hidden ? '#22863a' : '#888' }}>
                  {!form.hidden ? 'Hiển thị' : 'Ẩn'}
                </span>
              </div>

              {/* Details section */}
              <div>
                <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  SẢN PHẨM ÁP DỤNG
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: 8, marginBottom: 10 }}>
                  <input
                    type="number"
                    min={1}
                    placeholder="Mã sản phẩm"
                    value={detailForm.productId}
                    onChange={e => setDetailForm(d => ({ ...d, productId: +e.target.value }))}
                    style={inp}
                    onFocus={e => (e.target.style.borderColor = '#D4840A')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Min qty"
                    value={detailForm.minQuantity}
                    onChange={e => setDetailForm(d => ({ ...d, minQuantity: +e.target.value }))}
                    style={inp}
                    onFocus={e => (e.target.style.borderColor = '#D4840A')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
                  />
                  <button
                    onClick={handleAddDetail}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 9,
                      border: 'none',
                      background: '#D4840A',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 12.5,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Thêm
                  </button>
                </div>

                {form.details.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {form.details.map((d: IPromotionDetail) => (
                      <div
                        key={d.promotionDetailId}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 10px',
                          borderRadius: 8,
                          background: '#f5f5f5',
                          border: '1px solid #efefef',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#555' }}>
                          ID {d.productId} - Min {d.minQuantity}
                        </span>
                        <button
                          onClick={() => handleRemoveDetail(d.promotionDetailId)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: 'none',
                            background: '#ffebee',
                            color: '#d32f2f',
                            fontSize: 11,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!isView && (
          <div style={{ padding: '16px 24px', borderTop: '0.5px solid #f0f0ee', display: 'flex', gap: 10 }}>
            <button
              onClick={handleSave}
              disabled={isAdding || isEditing || !form.title.trim() || !form.description.trim()}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 10,
                border: 'none',
                background: form.title && form.description ? '#D4840A' : '#e0e0e0',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: form.title && form.description ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              {isAdding || isEditing ? '...' : mode === 'add' ? '➕ Tạo' : '✓ Lưu'}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 10,
                border: '1.5px solid #e0e0e0',
                background: '#fff',
                color: '#666',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
