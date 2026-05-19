import type {AdminUpdatePayload, IAdmin} from "../../../../types/admin.type.ts";
import {useState} from "react";
import type {AdminRole} from "../../../../const/adminRole.const.ts";
import {PALETTE} from "../../../../const/palette.const.ts";
import {initials} from "../utils/slice-name.ts";
import {ColorPalettePicker} from "../../../../components/ColorPalettePicker.tsx";

const ADMIN_ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: 'Employee', label: 'Nhân viên' },
  { value: 'Manager', label: 'Quản lý' },
];

export function AdminListModal({
                          staffList,
                          onEdit,
                          onDelete,
                          onClose,
                        }: {
  staffList: IAdmin[];
  onEdit: (id: number, s: AdminUpdatePayload) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<IAdmin | null>(null);
  const [form, setForm] = useState<{ name: string, role: AdminRole, email: string, phone: string}>({ name: '', role: "Employee", email: '' , phone: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [selPalette, setSelPalette] = useState<{ color: string; text: string }>(
    editing ? { color: editing.color, text: editing.color } : PALETTE[0]
  );

  const openEdit = (s: IAdmin) => { setEditing(s); setForm({ name: s.adminName, role: s.role, email: s.email, phone: s.phoneNumber }); setMode('edit'); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    onEdit(
      editing!.adminId,
      {
        adminName: form.name,
        email: form.email,
        phoneNumber: form.phone,
        role: form.role,
        color: selPalette.text
      });
    setMode('list');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e8e8e8', borderRadius: 9,
    padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', outline: 'none', background: '#fafafa',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.42)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 18, width: 520,
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        overflow: 'hidden', fontFamily: "'Be Vietnam Pro', sans-serif",
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '0.5px solid #f0f0ee', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {mode !== 'list' && (
              <button onClick={() => setMode('list')} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: '#D4840A', display: 'flex', alignItems: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
              </button>
            )}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
                {mode === 'list' ? 'Danh sách nhân viên' : 'Sửa thông tin'}
              </div>
              {mode === 'list' && (
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 1 }}>{staffList.length} nhân viên</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: '50%', border: 'none',
              background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {mode === 'list' ? (
            <div style={{ padding: '8px 0' }}>
              {staffList.map(s => (
                <div key={s.adminId}
                     style={{
                       display: 'flex', alignItems: 'center', gap: 14,
                       padding: '12px 22px', borderBottom: '0.5px solid #f5f5f3',
                       transition: 'background 0.1s',
                     }}
                     onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafaf8'}
                     onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                    background: s.color + '22',
                    border: `2px solid ${s.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: s.color,
                  }}>
                    {initials(s.adminName)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{s.adminName}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {s.role} · {s.phoneNumber}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(s)} style={{
                      padding: '6px 12px', borderRadius: 7, border: '1px solid #e8e8e8',
                      background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    }}>Sửa</button>
                    {deleteConfirm === s.adminId ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => { onDelete(s.adminId); setDeleteConfirm(null); }} style={{
                          padding: '6px 10px', borderRadius: 7, border: 'none',
                          background: '#A32D2D', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                        }}>Xóa</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{
                          padding: '6px 10px', borderRadius: 7, border: '1px solid #e0e0e0',
                          background: '#fff', color: '#666', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                        }}>Hủy</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(s.adminId)} style={{
                        padding: '6px 12px', borderRadius: 7,
                        border: '1px solid #FECDD3', background: '#FFF5F5',
                        color: '#A32D2D', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                      }}>Xóa</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  HỌ VÀ TÊN <span style={{ color: '#D4840A' }}>*</span>
                </label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                       placeholder="Nguyễn Văn A" style={inputStyle}
                       onFocus={e => (e.target.style.borderColor = '#D4840A')}
                       onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  VỊ TRÍ
                </label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminRole }))}
                        style={{ ...inputStyle, appearance: 'none' as const }}>
                  {ADMIN_ROLE_OPTIONS.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  SỐ ĐIỆN THOẠI
                </label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                       placeholder="09xx xxx xxx" style={inputStyle}
                       onFocus={e => (e.target.style.borderColor = '#D4840A')}
                       onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                <ColorPalettePicker palette={PALETTE} selectedPalette={selPalette} onChange={setSelPalette} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={handleSave} disabled={!form.name.trim()} style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: form.name.trim() ? '#D4840A' : '#e0e0e0',
                  color: '#fff', fontWeight: 700, fontSize: 14,
                  cursor: form.name.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
                }}>
                  ✓ Lưu thay đổi
                </button>
                <button onClick={() => setMode('list')} style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  border: '1.5px solid #e0e0e0', background: '#fff',
                  color: '#666', fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>Hủy</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}