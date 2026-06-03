import { useState } from 'react';
import type { MaintenanceCreatePayload } from '../../../../types/maintenance.type';
import type { ICourt } from '../../../../types/court.type';
import type { IFacility } from '../../../../types/facility.type';

interface CreateMaintenanceModalProps {
  courts: ICourt[];
  facilities: IFacility[];
  categories: Array<{ id: number; name: string }>;
  onCreate: (payload: MaintenanceCreatePayload) => void;
  onBack: () => void;
}

export function CreateMaintenanceModal({
  courts,
  facilities,
  categories,
  onCreate,
  onBack,
}: CreateMaintenanceModalProps) {
  const [form, setForm] = useState({
    detail: '',
    categoryId: categories[0]?.id || 0,
    facilityId: facilities[0]?.facilityId || '',
    courtId: courts[0]?.courtId || 0,
  });

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.detail.trim()) return;
    onCreate({
      detail: form.detail,
      categoryId: parseInt(String(form.categoryId)),
      facilityId: parseInt(String(form.facilityId)),
      courtId: parseInt(String(form.courtId)),
    });
  };

  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e8e8e8', borderRadius: 9,
    padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', background: '#fff', outline: 'none', transition: 'border-color 0.15s',
  };

  const Label = ({ children }: { children: string }) => (
    <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600, letterSpacing: '0.04em' }}>{children}</label>
  );

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Left panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px', background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.08)' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#D4840A', fontWeight: 600, fontSize: 14.5, fontFamily: 'inherit', padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Tạo phiếu bảo trì
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
          <div>
            <Label>DANH MỤC *</Label>
            <select value={form.categoryId} onChange={e => set('categoryId', parseInt(e.target.value))} style={{ ...inp, appearance: 'none' as const }}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <Label>CƠ SỞ / TRANG THIẾT BỊ *</Label>
            <select value={form.facilityId} onChange={e => set('facilityId', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
              {facilities.map(f => <option key={f.facilityId} value={f.facilityId}>{f.facilityName}</option>)}
            </select>
          </div>

          <div>
            <Label>SÂN *</Label>
            <select value={form.courtId} onChange={e => set('courtId', parseInt(e.target.value))} style={{ ...inp, appearance: 'none' as const }}>
              {courts.map(c => <option key={c.courtId} value={c.courtId}>{c.courtId}</option>)}
            </select>
          </div>

          <div>
            <Label>NỘI DUNG CHI TIẾT *</Label>
            <textarea
              value={form.detail}
              onChange={e => set('detail', e.target.value)}
              placeholder="Mô tả chi tiết về vấn đề bảo trì..."
              rows={6}
              style={{ ...inp, resize: 'none' as const, background: '#fff', lineHeight: 1.5 }}
              onFocus={e => (e.currentTarget.style.borderColor = '#D4840A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e8e8e8')} />
          </div>
        </div>
      </div>

      {/* Right panel - Summary */}
      <div style={{ width: 280, padding: '22px 22px', background: '#f7f7f5', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Tóm tắt thông tin</div>

        <div>
          <Label>DANH MỤC (tóm tắt)</Label>
          <input value={categories.find(c => c.id === form.categoryId)?.name || ''} readOnly placeholder="—"
            style={{ ...inp, background: '#f5f5f3', color: '#888', cursor: 'default' }} />
        </div>

        <div>
          <Label>CƠ SỞ (tóm tắt)</Label>
          <input value={facilities.find(f => f.facilityId === String(form.facilityId))?.facilityName || ''} readOnly placeholder="—"
            style={{ ...inp, background: '#f5f5f3', color: '#888', cursor: 'default' }} />
        </div>

        <div>
          <Label>SÂN (tóm tắt)</Label>
          <input value={courts.find(c => c.courtId === form.courtId)?.courtId || ''} readOnly placeholder="—"
            style={{ ...inp, background: '#f5f5f3', color: '#888', cursor: 'default' }} />
        </div>

        <div>
          <Label>CHIỀU DÀI NỘI DUNG</Label>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a', padding: '10px 13px' }}>
            {form.detail.length} ký tự
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={handleCreate} disabled={!form.detail.trim()} style={{
          padding: '13px', borderRadius: 10, border: 'none',
          background: form.detail.trim() ? '#D4840A' : '#e0e0e0',
          color: '#fff', fontWeight: 700, fontSize: 14,
          cursor: form.detail.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
          transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          🔧 Tạo phiếu
        </button>
      </div>
    </div>
  );
}
