import { useState } from 'react';
import { useFetchCourts, useAddCourt, useEditCourt, useRemoveCourt } from '../../../hooks/useCourt';
import type { ICourt, CourtStatus } from '../../../types/court.type';
import { FacilityView } from './components/FacilityView';
import { FacilityCategoryView } from './components/FacilityCategoryView';
import { FacilityCriterionView } from './components/FacilityCriterionView';

type TabType = 'courts' | 'facilities' | 'categories' | 'criteria';

export default function FacilityStatus() {
  const { data: courts, isLoading: loading, error } = useFetchCourts();
  const addCourtMutation = useAddCourt();
  const editCourtMutation = useEditCourt();
  const removeCourtMutation = useRemoveCourt();

  const [activeTab, setActiveTab] = useState<TabType>('courts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<ICourt | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    numOfIndex: '',
    unitPrice: '',
    status: 'Available' as CourtStatus,
  });
  
  const isSubmitting = addCourtMutation.isPending || editCourtMutation.isPending;
  const isDeleting = removeCourtMutation.isPending;

  const tabs = [
    { id: 'courts' as TabType, label: 'Sân' },
    { id: 'facilities' as TabType, label: 'Cơ sở vật chất' },
    { id: 'categories' as TabType, label: 'Danh mục' },
    { id: 'criteria' as TabType, label: 'Tiêu chí' },
  ];

  const handleOpenModal = (court?: ICourt) => {
    if (court) {
      setEditingCourt(court);
      setFormData({
        name: court.name,
        numOfIndex: court.numOfIndex.toString(),
        unitPrice: court.unitPrice.toString(),
        status: court.status,
      });
    } else {
      setEditingCourt(null);
      setFormData({
        name: '',
        numOfIndex: '',
        unitPrice: '',
        status: 'Available' as CourtStatus,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourt(null);
    setFormData({
      name: '',
      numOfIndex: '',
      unitPrice: '',
      status: 'Available' as CourtStatus,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.numOfIndex.trim() || !formData.unitPrice.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const payload = {
      name: formData.name,
      numOfIndex: parseInt(formData.numOfIndex),
      unitPrice: parseInt(formData.unitPrice),
      status: formData.status,
    };

    try {
      if (editingCourt) {
        await editCourtMutation.mutateAsync({
          id: editingCourt.courtId as number,
          data: payload,
        });
        alert('Cập nhật sân  thành công');
      } else {
        await addCourtMutation.mutateAsync(payload);
        alert('Thêm sân  thành công');
      }
      handleCloseModal();
    } catch (err) {
      alert('Có lỗi xảy ra');
      console.error(err);
    }
  };

  const handleDelete = async (courtId: string | number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sân  này?')) return;

    try {
      await removeCourtMutation.mutateAsync(courtId as number);
      alert('Xóa sân  thành công');
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa');
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: '#EAF3DE', color: '#3B6D11' };
      case 'Unavailable':
        return { bg: '#FCEBEB', color: '#A32D2D' };
      case 'Maintenance':
        return { bg: '#FFF3E0', color: '#E67E22' };
      default:
        return { bg: '#E6F1FB', color: '#185FA5' };
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'Available': 'Có sẵn',
      'Unavailable': 'Không có sẵn',
      'Maintenance': 'Bảo trì',
    };
    return labels[status] || status;
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN');
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        background: '#f7f7f5',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>Trạng thái cơ sở vật chất</div>
            <div style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>Quản lý sân và các cơ sở vật chất</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            background: '#fff',
            borderRadius: '12px 12px 0 0',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                color: activeTab === tab.id ? '#185FA5' : '#888',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #185FA5' : '1px solid rgba(0,0,0,0.08)',
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  (e.target as HTMLButtonElement).style.color = '#1a1a1a';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  (e.target as HTMLButtonElement).style.color = '#888';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ paddingTop: 16 }}>
        {/* Courts Tab */}
        {activeTab === 'courts' && (
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '20px',
              border: '0.5px solid rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Quản lý sân </div>
              </div>
              <button
                onClick={() => handleOpenModal()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#185FA5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#134078';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#185FA5';
                }}
              >
                + Thêm sân mới
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  backgroundColor: '#FCEBEB',
                  color: '#A32D2D',
                  padding: '12px 16px',
                  marginBottom: 16,
                  borderRadius: 8,
                  border: '0.5px solid #F4A9A9',
                  fontSize: 13,
                }}
              >
                Lỗi khi tải danh sách sân
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px 0',
                  color: '#888',
                }}
              >
                <div style={{ fontSize: 14 }}>Đang tải dữ liệu...</div>
              </div>
            )}

            {/* Courts table */}
            {!loading && (courts?.length ?? 0) > 0 && (
              <div
                style={{
                  background: '#f7f7f5',
                  borderRadius: 8,
                  border: '0.5px solid rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  marginTop: 16,
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    backgroundColor: '#f7f7f5',
                    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#888',
                    gap: 12,
                  }}
                >
                  <div>ID</div>
                  <div>Tên sân</div>
                  <div>Giá / giờ</div>
                  <div>Trạng thái</div>
                  <div>Thao tác</div>
                </div>

                {/* Table rows */}
                {(courts ?? []).map((court) => {
                  const statusStyle = getStatusColor(court.status);
                  return (
                    <div
                      key={court.courtId}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                        padding: '12px 16px',
                        borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                        alignItems: 'center',
                        fontSize: 13,
                        gap: 12,
                        transition: 'background 0.15s',
                        background: '#fff',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = '#fafaf8';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = '#fff';
                      }}
                    >
                      <div style={{ color: '#1a1a1a', fontWeight: 500 }}>{court.courtId}</div>
                      <div style={{ color: '#1a1a1a', fontWeight: 500 }}>{court.name}</div>
                      <div style={{ color: '#1a1a1a', fontWeight: 500 }}>
                        {formatPrice(court.unitPrice)} VND
                      </div>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 500,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {getStatusLabel(court.status)}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleOpenModal(court)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#E8F4F8',
                            color: '#185FA5',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.background = '#D1E8F2';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.background = '#E8F4F8';
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(court.courtId)}
                          disabled={isDeleting}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#FCEBEB',
                            color: '#A32D2D',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 500,
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            transition: 'background 0.15s',
                            opacity: isDeleting ? 0.6 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!isDeleting) (e.target as HTMLButtonElement).style.background = '#F4A9A9';
                          }}
                          onMouseLeave={(e) => {
                            if (!isDeleting) (e.target as HTMLButtonElement).style.background = '#FCEBEB';
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && (courts?.length ?? 0) === 0 && !error && (
              <div
                style={{
                  background: '#f7f7f5',
                  borderRadius: 8,
                  padding: '40px 16px',
                  textAlign: 'center',
                  border: '0.5px solid rgba(0,0,0,0.08)',
                  color: '#888',
                  fontSize: 13,
                  marginTop: 16,
                }}
              >
                Không có sân  nào
              </div>
            )}
          </div>
        )}

        {/* Facilities Tab */}
        {activeTab === 'facilities' && (
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '20px',
              border: '0.5px solid rgba(0,0,0,0.08)',
            }}
          >
            <FacilityView />
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '20px',
              border: '0.5px solid rgba(0,0,0,0.08)',
            }}
          >
            <FacilityCategoryView />
          </div>
        )}

        {/* Criteria Tab */}
        {activeTab === 'criteria' && (
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '20px',
              border: '0.5px solid rgba(0,0,0,0.08)',
            }}
          >
            <FacilityCriterionView />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>
              {editingCourt ? 'Sửa sân ' : 'Thêm sân  mới'}
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                Tên sân
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên sân"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                Số sân
              </label>
              <input
                type="number"
                value={formData.numOfIndex}
                onChange={(e) => setFormData({ ...formData, numOfIndex: e.target.value })}
                placeholder="Nhập số sân"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                Giá / giờ (VND)
              </label>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                placeholder="Nhập giá"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CourtStatus })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              >
                <option value="Available">Có sẵn</option>
                <option value="Unavailable">Không có sẵn</option>
                <option value="Maintenance">Bảo trì</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e0e0e0',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#185FA5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLButtonElement).style.background = '#134078';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#185FA5';
                }}
              >
                {isSubmitting ? 'Đang lưu...' : editingCourt ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
