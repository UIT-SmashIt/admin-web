import { useState } from 'react';
import type { RacketRental, RacketStatus } from '../../../../types/racket.type';

const STATUS_COLORS: Record<RacketStatus, { bg: string; color: string; label: string }> = {
  'Đã đặt': { bg: '#E3F2FD', color: '#1976D2', label: 'Đã đặt' },
  'Đang sử dụng': { bg: '#FFF3E0', color: '#F57C00', label: 'Đang sử dụng' },
  'Hoàn tất': { bg: '#E8F5E9', color: '#388E3C', label: 'Hoàn tất' },
};

export function RacketStatusTab({ rentals, onBack }: { rentals: RacketRental[], onBack?: () => void }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit', 
      minute: '2-digit', 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: '#f5f5f5',
                color: '#666',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>←</span>
            </button>
          )}
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
            Quản lý trạng thái vợt
          </h3>
        </div>
      </div>

      {rentals.length === 0 ? (
        <div
          style={{
            padding: '20px',
            borderRadius: 10,
            background: '#fafafa',
            border: '1px dashed #e0e0e0',
            textAlign: 'center',
            color: '#bbb',
            fontSize: 13,
          }}
        >
          Chưa có đơn thuê vợt
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 10, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          >
            <thead>
              <tr style={{ background: '#f8f8f6', borderBottom: '1px solid #f0f0f0' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                  Mã đơn
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                  Tên sân
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                  Vợt
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                  Giờ mượn
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                  Giờ trả
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#666' }}>
                  Trạng thái
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#666' }}>
                  Tác vụ
                </th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental, idx) => {
                const statusColor = STATUS_COLORS[rental.status];
                return (
                  <tr
                    key={rental.rentalId}
                    style={{
                      borderBottom: idx < rentals.length - 1 ? '1px solid #f5f5f5' : 'none',
                      background: idx % 2 === 0 ? '#fff' : '#fafafa',
                    }}
                  >
                    <td style={{ padding: '12px 14px', color: '#1a1a1a', fontWeight: 500 }}>
                      {rental.orderId}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>{rental.courtName}</td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>
                      {rental.racketName} <span style={{ color: '#aaa' }}>({rental.quantity})</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#555', fontSize: 12 }}>
                      {formatDateTime(rental.rentalTime)}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#555', fontSize: 12 }}>
                      {formatDateTime(rental.returnTime)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: statusColor.bg,
                          color: statusColor.color,
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {statusColor.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        onClick={() => setEditingId(editingId === rental.rentalId ? null : rental.rentalId)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: '1px solid #e0e0e0',
                          background: '#fff',
                          color: '#666',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {editingId === rental.rentalId ? '✓' : '✎'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
