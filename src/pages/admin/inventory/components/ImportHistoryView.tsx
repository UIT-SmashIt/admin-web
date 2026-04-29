import type {IProductImport} from "../../../../types/product.type.ts";
import {formatDateTime} from "../../../../utils/format-date.ts";

export function ImportHistoryView({ history, onClose }: { history: IProductImport[]; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: 600, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden', fontFamily: "'Be Vietnam Pro', sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '0.5px solid #f0f0ee' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Lịch sử nhập / xuất kho</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{history.length} lần gần đây</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
            <tr style={{ background: '#fafafa' }}>
              {['Thời gian', 'Mặt hàng', 'Số lượng', 'Ghi chú'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', color: '#888', fontWeight: 500, fontSize: 12, borderBottom: '1px solid #f0f0ee' }}>{h}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {history.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#bbb', fontSize: 13 }}>Chưa có lịch sử</td></tr>
            ) : [...history].reverse().map(h => (
              <tr key={h.importId} style={{ borderBottom: '0.5px solid #f5f5f3' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                <td style={{ padding: '10px 14px', color: '#888', fontSize: 11.5, whiteSpace: 'nowrap' as const }}>{formatDateTime(h.updatedAt)}</td>
                <td style={{ padding: '10px 14px', fontWeight: 500, color: '#1a1a1a' }}>{h.productName}</td>
                {/*<td style={{ padding: '10px 14px', color: '#666' }}>{h.unit}</td>*/}
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#22863a' }}>{h.quantity}</td>
                <td style={{ padding: '10px 14px', color: '#aaa', fontSize: 12 }}>{h.note || '—'}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}