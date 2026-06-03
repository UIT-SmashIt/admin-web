import { useState } from 'react';
import { useFetchCourts, useAddCourt, useEditCourt, useRemoveCourt, useUpdateCourtPrice } from '../../../hooks/useCourt';
import type { ICourt } from '../../../types/court.type';
import { FacilityView } from './components/FacilityView';
import { FacilityCategoryView } from './components/FacilityCategoryView';
import { FacilityCriterionView } from './components/FacilityCriterionView';

type TabType = 'courts' | 'facilities' | 'categories' | 'criteria';

export default function FacilityStatus() {
  const { data: courts, isLoading: loading, error } = useFetchCourts();
  const addCourtMutation = useAddCourt();
  const editCourtMutation = useEditCourt();
  const removeCourtMutation = useRemoveCourt();
  const updatePriceMutation = useUpdateCourtPrice();

  const [activeTab, setActiveTab] = useState<TabType>('courts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<ICourt | null>(null);
  
  const [formData, setFormData] = useState({
    numOfIndex: '',
  });
  const [priceForm, setPriceForm] = useState({
    newPrice: '',
  });
  
  const isSubmitting = addCourtMutation.isPending || editCourtMutation.isPending;
  const isDeleting = removeCourtMutation.isPending;
  const isUpdatingPrice = updatePriceMutation.isPending;

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
        numOfIndex: court.numOfIndex.toString(),
      });
    } else {
      setEditingCourt(null);
      setFormData({
        numOfIndex: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourt(null);
    setFormData({ numOfIndex: '' });
  };

  const handleSubmit = async () => {
    if (!formData.numOfIndex.trim()) {
      alert('Vui lòng điền số hiệu sân');
      return;
    }

    const payload = {
      numOfIndex: parseInt(formData.numOfIndex),
    };

    try {
      if (editingCourt) {
        await editCourtMutation.mutateAsync({
          id: editingCourt.courtId,
          data: payload,
        });
        alert('Cập nhật thông tin sân thành công');
      } else {
        await addCourtMutation.mutateAsync(payload);
        alert('Thêm sân thành công');
      }
      handleCloseModal();
    } catch (err) {
      alert('Có lỗi xảy ra');
      console.error(err);
    }
  };

  const handleUpdatePrice = async () => {
    if (!priceForm.newPrice.trim()) {
      alert('Vui lòng nhập giá tiền mới');
      return;
    }
    try {
      await updatePriceMutation.mutateAsync({
        newPrice: parseInt(priceForm.newPrice),
      });
      alert('Cập nhật cấu hình giá sân thành công');
      setIsPriceModalOpen(false);
      setPriceForm({ newPrice: '' });
    } catch (err) {
      alert('Có lỗi xảy ra khi cập nhật giá');
      console.error(err);
    }
  };

  const handleDelete = async (courtId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sân này?')) return;

    try {
      await removeCourtMutation.mutateAsync(courtId);
      alert('Xóa sân thành công');
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa');
      console.error(err);
    }
  };

  const getStatusStyle = (isMaintenance: boolean) => {
    return isMaintenance 
      ? { bg: '#FCEBEB', color: '#A32D2D', label: 'Bảo trì' }
      : { bg: '#EAF3DE', color: '#3B6D11', label: 'Hoạt động' };
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
            <div style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>Quản lý hệ thống sân và trang thiết bị</div>
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
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Quản lý danh sách sân</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setIsPriceModalOpen(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#FFF3E0',
                    color: '#E67E22',
                    border: '1px solid #FFE0B2',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cấu hình giá chung
                </button>
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
                  }}
                >
                  + Thêm sân mới
                </button>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: '#FCEBEB', color: '#A32D2D', padding: '12px 16px', marginBottom: 16, borderRadius: 8, fontSize: 13 }}>
                Lỗi khi tải danh sách sân từ hệ thống.
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0', color: '#888' }}>
                <div style={{ fontSize: 14 }}>Đang tải dữ liệu...</div>
              </div>
            )}

            {!loading && (courts?.length ?? 0) > 0 && (
              <div style={{ background: '#f7f7f5', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden', marginTop: 16 }}>
                {/* Table header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 2fr 1fr',
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
                  <div>SỐ THỨ TỰ SÂN</div>
                  <div>TRẠNG THÁI</div>
                  <div>THAO TÁC</div>
                </div>

                {/* Table rows */}
                {(courts ?? []).map((court) => {
                  const status = getStatusStyle(court.isMaintenance);
                  return (
                    <div
                      key={court.courtId}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 2fr 1fr',
                        padding: '12px 16px',
                        borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                        alignItems: 'center',
                        fontSize: 13,
                        gap: 12,
                        background: '#fff',
                      }}
                    >
                      <div style={{ color: '#1a1a1a', fontWeight: 500 }}>#{court.courtId}</div>
                      <div style={{ color: '#1a1a1a', fontWeight: 500 }}>Sân số {court.numOfIndex}</div>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 500,
                            backgroundColor: status.bg,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleOpenModal(court)}
                          style={{ padding: '4px 8px', backgroundColor: '#E8F4F8', color: '#185FA5', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(court.courtId)}
                          disabled={isDeleting}
                          style={{ padding: '4px 8px', backgroundColor: '#FCEBEB', color: '#A32D2D', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && (courts?.length ?? 0) === 0 && !error && (
              <div style={{ background: '#f7f7f5', borderRadius: 8, padding: '40px 16px', textAlign: 'center', color: '#888', fontSize: 13, marginTop: 16 }}>
                Không tìm thấy sân nào trên hệ thống.
              </div>
            )}
          </div>
        )}

        {activeTab === 'facilities' && <div style={{ background: '#fff', borderRadius: 12, padding: '20px' }}><FacilityView /></div>}
        {activeTab === 'categories' && <div style={{ background: '#fff', borderRadius: 12, padding: '20px' }}><FacilityCategoryView /></div>}
        {activeTab === 'criteria' && <div style={{ background: '#fff', borderRadius: 12, padding: '20px' }}><FacilityCriterionView /></div>}
      </div>

      {/* Modal Thêm/Sửa Sân */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={handleCloseModal}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '24px', width: '90%', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600 }}>{editingCourt ? 'Sửa thông tin sân' : 'Thêm sân mới'}</h2>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Số thứ tự sân (numOfIndex)</label>
              <input
                type="number"
                value={formData.numOfIndex}
                onChange={(e) => setFormData({ numOfIndex: e.target.value })}
                placeholder="Nhập số hiệu index của sân"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.12)', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={handleCloseModal} disabled={isSubmitting} style={{ padding: '8px 16px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '8px 16px', backgroundColor: '#185FA5', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
                {isSubmitting ? 'Đang lưu...' : editingCourt ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cấu Hình Giá Chung */}
      {isPriceModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setIsPriceModalOpen(false)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '24px', width: '90%', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600 }}>Cấu hình giá áp dụng chung</h2>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Giá tiền mới / giờ (VND)</label>
              <input
                type="number"
                value={priceForm.newPrice}
                onChange={(e) => setPriceForm({ newPrice: e.target.value })}
                placeholder="Nhập mức giá mới"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.12)', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setIsPriceModalOpen(false)} disabled={isUpdatingPrice} style={{ padding: '8px 16px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleUpdatePrice} disabled={isUpdatingPrice} style={{ padding: '8px 16px', backgroundColor: '#E67E22', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
                {isUpdatingPrice ? 'Đang cập nhật...' : 'Cập nhật giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}