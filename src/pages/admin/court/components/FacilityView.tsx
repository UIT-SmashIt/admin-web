import { useState } from 'react';
import { useFetchFacilities, useAddFacility, useEditFacility, useRemoveFacility, useFetchFacilityCategories } from '../../../../hooks/useFacility';
import type { IFacility, FacilityStatus } from '../../../../types/facility.type';

export function FacilityView() {
  const { data: facilities, isLoading: loading, error } = useFetchFacilities();
  const { data: categories } = useFetchFacilityCategories();
  const addFacilityMutation = useAddFacility();
  const editFacilityMutation = useEditFacility();
  const removeFacilityMutation = useRemoveFacility();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<IFacility | null>(null);
  const [formData, setFormData] = useState({
    facilityName: '',
    description: '',
    status: 'Stock' as FacilityStatus,
    categoryId: '',
  });

  const isSubmitting = addFacilityMutation.isPending || editFacilityMutation.isPending;
  const isDeleting = removeFacilityMutation.isPending;

  const handleOpenModal = (facility?: IFacility) => {
    if (facility) {
      setEditingFacility(facility);
      setFormData({
        facilityName: facility.facilityName,
        description: facility.description,
        status: facility.status,
        categoryId: facility.categoryName,
      });
    } else {
      setEditingFacility(null);
      setFormData({
        facilityName: '',
        description: '',
        status: 'Stock' as FacilityStatus,
        categoryId: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFacility(null);
    setFormData({
      facilityName: '',
      description: '',
      status: 'Stock' as FacilityStatus,
      categoryId: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.facilityName.trim() || !formData.description.trim() || !formData.categoryId.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const payload = {
      facilityName: formData.facilityName,
      description: formData.description,
      status: formData.status,
      categoryId: formData.categoryId,
    };

    try {
      if (editingFacility) {
        await editFacilityMutation.mutateAsync({
          id: editingFacility.facilityId,
          data: payload,
        });
        alert('Cập nhật cơ sở vật chất thành công');
      } else {
        await addFacilityMutation.mutateAsync(payload);
        alert('Thêm cơ sở vật chất thành công');
      }
      handleCloseModal();
    } catch (err) {
      alert('Có lỗi xảy ra');
      console.error(err);
    }
  };

  const handleDelete = async (facilityId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cơ sở vật chất này?')) return;

    try {
      await removeFacilityMutation.mutateAsync(facilityId);
      alert('Xóa cơ sở vật chất thành công');
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa');
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stock':
        return { bg: '#EAF3DE', color: '#3B6D11' };
      case 'Out_of_stock':
        return { bg: '#FCEBEB', color: '#A32D2D' };
      case 'Maintenance':
        return { bg: '#FFF3E0', color: '#E67E22' };
      case 'Damaged':
        return { bg: '#FCE4EC', color: '#C2185B' };
      default:
        return { bg: '#E6F1FB', color: '#185FA5' };
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'Stock': 'Còn hàng',
      'Out_of_stock': 'Hết hàng',
      'Maintenance': 'Bảo trì',
      'Damaged': 'Hỏng',
    };
    return labels[status] || status;
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>Quản lý cơ sở vật chất</div>
          <div style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>Danh sách các cơ sở vật chất</div>
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
          + Thêm cơ sở mới
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
          Lỗi khi tải danh sách cơ sở vật chất
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

      {/* Facilities table */}
      {!loading && (facilities?.length ?? 0) > 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '0.5px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1fr',
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
            <div>Tên</div>
            <div>Mô tả</div>
            <div>Trạng thái</div>
            <div>Thao tác</div>
          </div>

          {/* Table rows */}
          {(facilities ?? []).map((facility) => {
            const statusStyle = getStatusColor(facility.status);
            return (
              <div
                key={facility.facilityId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1fr',
                  padding: '12px 16px',
                  borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                  alignItems: 'center',
                  fontSize: 13,
                  gap: 12,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = '#fafaf8';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <div style={{ color: '#1a1a1a', fontWeight: 500 }}>
                  {facility.facilityId}
                </div>
                <div style={{ color: '#1a1a1a', fontWeight: 500 }}>
                  {facility.facilityName}
                </div>
                <div style={{ color: '#666' }}>
                  {facility.description.length > 50
                    ? `${facility.description.substring(0, 50)}...`
                    : facility.description}
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
                  {getStatusLabel(facility.status)}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button
                    onClick={() => handleOpenModal(facility)}
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
                    onClick={() => handleDelete(facility.facilityId)}
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
      {!loading && (facilities?.length ?? 0) === 0 && !error && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '40px 16px',
            textAlign: 'center',
            border: '0.5px solid rgba(0,0,0,0.08)',
            color: '#888',
            fontSize: 13,
          }}
        >
          Không có cơ sở vật chất nào
        </div>
      )}

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
              {editingFacility ? 'Sửa cơ sở vật chất' : 'Thêm cơ sở vật chất mới'}
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                Tên cơ sở
              </label>
              <input
                type="text"
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                placeholder="Nhập tên cơ sở"
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
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  fontSize: 13,
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                Danh mục
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Chọn danh mục</option>
                {(categories ?? []).map((cat) => (
                  <option key={cat.facilityCategoryId} value={cat.facilityCategoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as FacilityStatus })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              >
                <option value="Stock">Còn hàng</option>
                <option value="Out_of_stock">Hết hàng</option>
                <option value="Maintenance">Bảo trì</option>
                <option value="Damaged">Hỏng</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#e0e0e0';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = '#f0f0f0';
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
                  transition: 'background 0.15s',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) (e.target as HTMLButtonElement).style.background = '#134078';
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) (e.target as HTMLButtonElement).style.background = '#185FA5';
                }}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
