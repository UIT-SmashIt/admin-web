import { useState } from 'react';
import { useFetchFacilityCategories, useAddFacilityCategory, useEditFacilityCategory, useRemoveFacilityCategory } from '../../../../hooks/useFacility';
import type { IFacilityCategory } from '../../../../types/facility.type';

export function FacilityCategoryView() {
  const { data: categories, isLoading: loading, error } = useFetchFacilityCategories();
  const addCategoryMutation = useAddFacilityCategory();
  const editCategoryMutation = useEditFacilityCategory();
  const removeCategoryMutation = useRemoveFacilityCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IFacilityCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const isSubmitting = addCategoryMutation.isPending || editCategoryMutation.isPending;
  const isDeleting = removeCategoryMutation.isPending;

  const handleOpenModal = (category?: IFacilityCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
    };

    try {
      if (editingCategory) {
        await editCategoryMutation.mutateAsync({
          id: editingCategory.facilityCategoryId,
          data: payload,
        });
        alert('Cập nhật danh mục thành công');
      } else {
        await addCategoryMutation.mutateAsync(payload);
        alert('Thêm danh mục thành công');
      }
      handleCloseModal();
    } catch (err) {
      alert('Có lỗi xảy ra');
      console.error(err);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      await removeCategoryMutation.mutateAsync(categoryId);
      alert('Xóa danh mục thành công');
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa');
      console.error(err);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>Quản lý danh mục</div>
          <div style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>Danh sách danh mục cơ sở vật chất</div>
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
          + Thêm danh mục mới
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
          Lỗi khi tải danh sách danh mục
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

      {/* Categories table */}
      {!loading && (categories?.length ?? 0) > 0 && (
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
              gridTemplateColumns: '1fr 2fr 1.5fr',
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
            <div>Tên danh mục</div>
            <div>Thao tác</div>
          </div>

          {/* Table rows */}
          {(categories ?? []).map((category) => (
            <div
              key={category.facilityCategoryId}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1.5fr',
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
                {category.facilityCategoryId}
              </div>
              <div>
                <div style={{ color: '#1a1a1a', fontWeight: 500, marginBottom: 4 }}>
                  {category.name}
                </div>
                <div style={{ color: '#888', fontSize: 11 }}>
                  {category.description.length > 60
                    ? `${category.description.substring(0, 60)}...`
                    : category.description}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleOpenModal(category)}
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
                  onClick={() => handleDelete(category.facilityCategoryId)}
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
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && (categories?.length ?? 0) === 0 && !error && (
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
          Không có danh mục nào
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
              {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                Tên danh mục
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên danh mục"
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
