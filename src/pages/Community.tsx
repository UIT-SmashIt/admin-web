import { useState, useMemo } from 'react';
import { COURTS, PLAY_LEVELS, fmt } from '../pages/Lịch đặt/LichDatTypes';

const globalStyles = `
  html, body {
    color-scheme: light;
  }
  * {
    color-scheme: light;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommunityPost {
  id: number;
  authorName: string;
  authorCode: string;
  phone: string;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  currentPlayers: number;
  level: string;
  caption: string;
  hashtags: string[];
  postedAt: string;
  isFull: boolean;
  courtFee: number;
}

type ModalMode = 'add' | 'edit' | 'view' | null;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 1, authorName: 'Trần Thị Bình', authorCode: 'TTB02', phone: '0912345678',
    courtId: 2, date: '20/04/2026', startTime: '7:00', endTime: '9:00',
    maxPlayers: 4, currentPlayers: 2, level: 'Trung bình',
    caption: '🏸 Tìm 2 người chơi cầu lông sáng 20/04 tại Sân 2, 7:00–9:00. Trình độ trung bình. Ai quan tâm nhắn tin nhé!',
    hashtags: ['#cầulông', '#tìmđồng_đội', '#badminton'],
    postedAt: '16/04/2026 09:15', isFull: false, courtFee: 320000,
  },
  {
    id: 2, authorName: 'Phạm Hương', authorCode: 'PH04', phone: '0934567890',
    courtId: 1, date: '22/04/2026', startTime: '18:00', endTime: '20:00',
    maxPlayers: 6, currentPlayers: 6, level: 'Khá',
    caption: '🏸 Đủ người rồi nhé! Sân 1, 22/04, 18:00–20:00. Hẹn gặp trên sân 💪 Thi đấu nghiêm túc, ai đến đúng giờ nha!',
    hashtags: ['#cầulông', '#sportsHCM', '#badminton'],
    postedAt: '14/04/2026 20:10', isFull: true, courtFee: 160000,
  },
  {
    id: 3, authorName: 'Đỗ Minh Khoa', authorCode: 'DMK07', phone: '0967123456',
    courtId: 3, date: '23/04/2026', startTime: '14:00', endTime: '16:00',
    maxPlayers: 4, currentPlayers: 1, level: 'Mọi trình độ',
    caption: '🏸 Mình đặt Sân 3 chiều 23/04, 14:00–16:00. Cần thêm 3 người. Mọi trình độ đều ok, vui vẻ là chính! 😄',
    hashtags: ['#cầulông', '#tìmđồng_đội', '#sânxịn'],
    postedAt: '16/04/2026 13:20', isFull: false, courtFee: 160000,
  },
];

const ALL_HASHTAGS = ['#cầulông', '#tìmđồng_đội', '#badminton', '#sportsHCM', '#sânxịn', '#mọitrìnhđộ'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
}
const AUTHOR_COLORS = ['#7B1FA2', '#D4840A', '#378ADD', '#22863a', '#C62828'];
function authorColor(code: string) { return AUTHOR_COLORS[code.charCodeAt(0) % AUTHOR_COLORS.length]; }

// ─── Post Form Modal ──────────────────────────────────────────────────────────

function PostModal({ mode, post, onSave, onClose }: {
  mode: ModalMode; post: CommunityPost | null;
  onSave: (p: CommunityPost) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({
    authorName: post?.authorName ?? '',
    authorCode: post?.authorCode ?? '',
    phone: post?.phone ?? '',
    courtId: post?.courtId ?? 1,
    date: post?.date ?? '',
    startTime: post?.startTime ?? '',
    endTime: post?.endTime ?? '',
    maxPlayers: post?.maxPlayers ?? 4,
    currentPlayers: post?.currentPlayers ?? 1,
    level: post?.level ?? PLAY_LEVELS[0],
    caption: post?.caption ?? '',
    hashtags: post?.hashtags ?? [] as string[],
    courtFee: post?.courtFee ?? 160000,
  });

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const toggleTag = (tag: string) =>
    setForm(f => ({ ...f, hashtags: f.hashtags.includes(tag) ? f.hashtags.filter(t => t !== tag) : [...f.hashtags, tag] }));

  const spotsLeft = form.maxPlayers - form.currentPlayers;

  const buildCaption = () => {
    const court = COURTS.find(c => c.id === form.courtId);
    return `🏸 Tìm ${spotsLeft} người chơi cầu lông ngày ${form.date} tại ${court?.name}, ${form.startTime}–${form.endTime}.\nTrình độ: ${form.level}. Hiện có ${form.currentPlayers}/${form.maxPlayers} người.\nAi quan tâm nhắn tin nhé! 💪`;
  };

  const handleSave = () => {
    if (!form.authorName.trim() || !form.caption.trim()) return;
    onSave({
      id: post?.id ?? Date.now(),
      ...form,
      isFull: form.currentPlayers >= form.maxPlayers,
      postedAt: post?.postedAt ?? new Date().toLocaleString('vi-VN'),
    });
    onClose();
  };

  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', border: '1.5px solid #e8e8e8', borderRadius: 9,
    padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit', color: '#1a1a1a',
    background: '#fff', outline: 'none', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: 560, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
            {mode === 'add' ? '📢 Tạo bài đăng mới' : '✏️ Chỉnh sửa bài đăng'}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            {[
              { label: 'Tên người đăng *', val: form.authorName, key: 'authorName' as const, ph: 'Nguyễn Văn A' },
              { label: 'Mã khách hàng', val: form.authorCode, key: 'authorCode' as const, ph: 'NVA01' },
              { label: 'Số điện thoại', val: form.phone, key: 'phone' as const, ph: '09xx xxx xxx' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>{f.label.toUpperCase()}</label>
                <input value={f.val} onChange={e => set(f.key, e.target.value)} placeholder={f.ph} style={inp}
                  onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
                  onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
              </div>
            ))}

            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>CHỌN SÂN</label>
              <select value={form.courtId} onChange={e => set('courtId', +e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
                {COURTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Date & time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>NGÀY</label>
              <input value={form.date} onChange={e => set('date', e.target.value)} placeholder="DD/MM/YYYY" style={inp}
                onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
                onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
            </div>
            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GIỜ BẮT ĐẦU</label>
              <input value={form.startTime} onChange={e => set('startTime', e.target.value)} placeholder="6:00" style={inp}
                onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
                onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
            </div>
            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GIỜ KẾT THÚC</label>
              <input value={form.endTime} onChange={e => set('endTime', e.target.value)} placeholder="8:00" style={inp}
                onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
                onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
            </div>
          </div>

          {/* Players */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 8, fontWeight: 600 }}>SỐ LƯỢNG NGƯỜI CHƠI</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {[
                { label: 'Tối đa', val: form.maxPlayers, inc: () => set('maxPlayers', form.maxPlayers + 1), dec: () => set('maxPlayers', Math.max(form.currentPlayers, form.maxPlayers - 1)) },
                { label: 'Hiện có', val: form.currentPlayers, inc: () => set('currentPlayers', Math.min(form.maxPlayers, form.currentPlayers + 1)), dec: () => set('currentPlayers', Math.max(1, form.currentPlayers - 1)) },
              ].map(ctrl => (
                <div key={ctrl.label}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 5 }}>{ctrl.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={ctrl.dec} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #D8B4FE', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#7B1FA2', minWidth: 26, textAlign: 'center' }}>{ctrl.val}</span>
                    <button onClick={ctrl.inc} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #D8B4FE', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                  </div>
                </div>
              ))}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#aaa', marginBottom: 5 }}>Còn chỗ</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: spotsLeft > 0 ? '#7B1FA2' : '#22863a' }}>{spotsLeft}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
              {Array.from({ length: form.maxPlayers }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < form.currentPlayers ? '#7B1FA2' : '#E9D5FF' }} />
              ))}
            </div>
          </div>

          {/* Level */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>TRÌNH ĐỘ</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PLAY_LEVELS.map(l => (
                <button key={l} onClick={() => set('level', l)} style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                  border: `1px solid ${form.level === l ? '#7B1FA2' : '#e0e0e0'}`,
                  background: form.level === l ? '#7B1FA2' : '#fafafa',
                  color: form.level === l ? '#fff' : '#666',
                  fontWeight: form.level === l ? 600 : 400, transition: 'all 0.12s',
                }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11.5, color: '#999', fontWeight: 600 }}>CAPTION *</label>
              <button onClick={() => set('caption', buildCaption())} style={{ fontSize: 11, color: '#7B1FA2', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                ✨ Tự động tạo
              </button>
            </div>
            <textarea value={form.caption} onChange={e => set('caption', e.target.value)} rows={4}
              placeholder="Viết caption để tìm người chơi cùng..." style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
              onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
            <div style={{ fontSize: 11, color: '#aaa', textAlign: 'right', marginTop: 3 }}>{form.caption.length} ký tự</div>
          </div>

          {/* Hashtags */}
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>HASHTAG</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ALL_HASHTAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                  border: `1px solid ${form.hashtags.includes(tag) ? '#7B1FA2' : '#e0e0e0'}`,
                  background: form.hashtags.includes(tag) ? '#F3E8FF' : '#fafafa',
                  color: form.hashtags.includes(tag) ? '#7B1FA2' : '#888',
                  fontWeight: form.hashtags.includes(tag) ? 600 : 400, transition: 'all 0.12s',
                }}>{tag}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '0.5px solid #f0f0ee', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={handleSave} disabled={!form.authorName.trim() || !form.caption.trim()} style={{
            flex: 1, padding: '12px', borderRadius: 10, border: 'none',
            background: (form.authorName && form.caption) ? 'linear-gradient(135deg,#7B1FA2,#9C27B0)' : '#e0e0e0',
            color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: (form.authorName && form.caption) ? 'pointer' : 'default', fontFamily: 'inherit',
          }}>
            {mode === 'add' ? '📢 Đăng bài' : '✓ Lưu thay đổi'}
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post, onEdit, onDelete, onJoin }: {
  post: CommunityPost;
  onEdit: () => void; onDelete: () => void; onJoin: () => void;
}) {
  const court = COURTS.find(c => c.id === post.courtId);
  const spotsLeft = post.maxPlayers - post.currentPlayers;
  const fillPct = (post.currentPlayers / post.maxPlayers) * 100;
  const color = authorColor(post.authorCode);

  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: post.isFull ? '1.5px solid #BBF7D0' : '0.5px solid rgba(0,0,0,0.08)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
    >
      {/* Color top stripe */}
      <div style={{ height: 4, background: post.isFull ? 'linear-gradient(90deg,#22863a,#38A169)' : 'linear-gradient(90deg,#7B1FA2,#9C27B0)' }} />

      <div style={{ padding: '16px', flex: 1 }}>
        {/* Author row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: color + '18', border: `2px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>
              {initials(post.authorName)}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a1a' }}>{post.authorName}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{post.postedAt}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={onEdit} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, transition: 'all 0.12s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}>✏️</button>
            <button onClick={onDelete} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, transition: 'all 0.12s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}>🗑️</button>
          </div>
        </div>

        {/* Info chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {[
            { icon: '🏸', text: court?.name },
            { icon: '📅', text: post.date },
            { icon: '⏰', text: `${post.startTime}–${post.endTime}` },
            { icon: '⭐', text: post.level },
          ].map((c, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 9px', borderRadius: 20, background: '#f5f5f3', fontSize: 11.5, color: '#555', fontWeight: 500 }}>
              <span style={{ fontSize: 10 }}>{c.icon}</span>{c.text}
            </span>
          ))}
        </div>

        {/* Caption */}
        <div style={{ fontSize: 13.5, color: '#333', lineHeight: 1.65, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
          {post.caption}
        </div>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
            {post.hashtags.map(tag => (
              <span key={tag} style={{ fontSize: 11.5, color: '#7B1FA2', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Players bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Số người chơi</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: post.isFull ? '#22863a' : '#7B1FA2' }}>
              {post.currentPlayers}/{post.maxPlayers}
              {post.isFull ? ' · ✅ Đủ người' : ` · Còn ${spotsLeft} chỗ`}
            </span>
          </div>
          <div style={{ height: 6, background: '#F3E8FF', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: 6, width: `${fillPct}%`, borderRadius: 3, background: post.isFull ? 'linear-gradient(90deg,#22863a,#38A169)' : 'linear-gradient(90deg,#7B1FA2,#9C27B0)', transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
            {Array.from({ length: post.maxPlayers }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 24, borderRadius: 5, background: i < post.currentPlayers ? (post.isFull ? '#22863a' : '#7B1FA2') : '#f0f0ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                {i < post.currentPlayers ? '👤' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Fee info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#888', marginBottom: 12, padding: '8px 10px', background: '#fafafa', borderRadius: 8 }}>
          <span>Chi phí sân</span>
          <span style={{ fontWeight: 700, color: '#D4840A' }}>{fmt(post.courtFee)}đ</span>
        </div>
      </div>

      {/* Join button */}
      <div style={{ padding: '0 16px 16px' }}>
        <button onClick={onJoin} disabled={post.isFull} style={{
          width: '100%', padding: '11px', borderRadius: 10, border: 'none',
          background: post.isFull ? '#f0f0ee' : 'linear-gradient(135deg,#7B1FA2,#9C27B0)',
          color: post.isFull ? '#aaa' : '#fff',
          fontWeight: 700, fontSize: 13.5,
          cursor: post.isFull ? 'default' : 'pointer', fontFamily: 'inherit',
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => { if (!post.isFull) (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
        >
          {post.isFull ? '✅ Đã đủ người' : `🏸 Tham gia (còn ${spotsLeft} chỗ)`}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CongDong() {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [modal, setModal] = useState<{ mode: ModalMode; post: CommunityPost | null }>({ mode: null, post: null });
  const [deleteTarget, setDeleteTarget] = useState<CommunityPost | null>(null);
  const [search, setSearch] = useState('');
  const [filterFull, setFilterFull] = useState<'all' | 'open' | 'full'>('all');
  const [filterLevel, setFilterLevel] = useState('Tất cả');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter(p =>
      (p.caption.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q) ||
       COURTS.find(c => c.id === p.courtId)?.name.toLowerCase().includes(q) || false) &&
      (filterFull === 'all' || (filterFull === 'open' && !p.isFull) || (filterFull === 'full' && p.isFull)) &&
      (filterLevel === 'Tất cả' || p.level === filterLevel)
    ).sort((a, b) => a.postedAt < b.postedAt ? 1 : -1);
  }, [posts, search, filterFull, filterLevel]);

  const handleSave = (p: CommunityPost) => setPosts(prev => prev.some(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [p, ...prev]);
  const handleDelete = (id: number) => setPosts(prev => prev.filter(x => x.id !== id));
  const handleJoin = (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id || p.isFull) return p;
      const next = p.currentPlayers + 1;
      return { ...p, currentPlayers: next, isFull: next >= p.maxPlayers };
    }));
    showToast('🎉 Đã đăng ký tham gia! Chủ bài sẽ liên hệ với bạn.');
  };

  const openCount = posts.filter(p => !p.isFull).length;
  const fullCount = posts.filter(p => p.isFull).length;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", background: '#f7f7f5', position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      {modal.mode && (
        <PostModal mode={modal.mode} post={modal.post} onSave={handleSave} onClose={() => setModal({ mode: null, post: null })} />
      )}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDeleteTarget(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 340, padding: '24px', textAlign: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🗑️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Xóa bài đăng?</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Bài đăng của <strong>{deleteTarget.authorName}</strong> sẽ bị xóa vĩnh viễn.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { handleDelete(deleteTarget.id); setDeleteTarget(null); }} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#A32D2D', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Cộng đồng 🏸</div>
          <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 2 }}>
            {openCount} đang tìm người · {fullCount} đã đủ · {posts.length} tổng bài đăng
          </div>
        </div>
        <button onClick={() => setModal({ mode: 'add', post: null })} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg,#7B1FA2,#9C27B0)', color: '#fff', fontWeight: 700, fontSize: 13.5,
          cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(123,31,162,0.3)',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
        >
          📢 Đăng tìm người
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: 220 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm bài đăng, tên, sân..."
            style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e8e8e8', borderRadius: 9, padding: '8px 12px 8px 34px', fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#1a1a1a', background: '#fff' }}
            onFocus={e => (e.target.style.borderColor = '#7B1FA2')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {([
            { key: 'all', label: 'Tất cả', count: posts.length },
            { key: 'open', label: '🟢 Còn chỗ', count: openCount },
            { key: 'full', label: '✅ Đủ người', count: fullCount },
          ] as const).map(f => (
            <button key={f.key} onClick={() => setFilterFull(f.key)} style={{
              padding: '6px 13px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              border: `1px solid ${filterFull === f.key ? '#7B1FA2' : '#e0e0e0'}`,
              background: filterFull === f.key ? '#F3E8FF' : '#fff',
              color: filterFull === f.key ? '#7B1FA2' : '#666',
              fontWeight: filterFull === f.key ? 700 : 400, transition: 'all 0.12s',
            }}>{f.label} ({f.count})</button>
          ))}
        </div>

        {/* Level filter */}
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ border: '1px solid #e8e8e8', borderRadius: 9, padding: '7px 12px', fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555', background: '#fff', cursor: 'pointer' }}>
          <option value="Tất cả">Mọi trình độ</option>
          {PLAY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#bbb', background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>🏸</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#ccc' }}>Chưa có bài đăng nào</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Hãy đăng bài để tìm người chơi cùng!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(p => (
            <PostCard key={p.id} post={p}
              onEdit={() => setModal({ mode: 'edit', post: p })}
              onDelete={() => setDeleteTarget(p)}
              onJoin={() => handleJoin(p.id)}
            />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div style={{ marginTop: 16, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
          Hiển thị {filtered.length} / {posts.length} bài đăng
        </div>
      )}
    </div>
    </>
  );
}