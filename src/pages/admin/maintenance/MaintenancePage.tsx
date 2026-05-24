import { useState } from 'react';
import { Spin } from 'antd';
import { useFetchMaintenances, useCreateMaintenance, useEditMaintenance } from '../../../hooks/useMaintenance';
import { useFetchCourts } from '../../../hooks/useCourt';
import { useFetchFacilities, useFetchFacilityCategories } from '../../../hooks/useFacility';
import type { IMaintenance, MaintenanceCreatePayload, MaintenanceStatus } from '../../../types/maintenance.type';
import { MaintenanceListView } from './components/MaintenanceListView';
import { CreateMaintenanceModal } from './components/CreateMaintenanceModal';
import { DetailModal } from './components/DetailModal';

type View = 'list' | 'create';

export default function MaintenancePage() {
  const { data: maintenances, isLoading: maintenancesLoading } = useFetchMaintenances();
  const { data: courts, isLoading: courtsLoading } = useFetchCourts();
  const { data: facilities, isLoading: facilitiesLoading } = useFetchFacilities();
  const { data: facilityCategories, isLoading: categoriesLoading } = useFetchFacilityCategories();
  
  const { mutate: createMaintenance } = useCreateMaintenance();
  const { mutate: editMaintenance } = useEditMaintenance();

  const [view, setView] = useState<View>('list');
  const [detailItem, setDetailItem] = useState<IMaintenance | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleCreate = (payload: MaintenanceCreatePayload) => {
    createMaintenance(payload);
    showToast('✓ Đã tạo phiếu bảo trì');
    setView('list');
  };

  const handleStatusChange = (id: number, status: MaintenanceStatus) => {
    editMaintenance({
      id,
      data: { status }
    });
    showToast(`✓ Cập nhật trạng thái: ${status}`);
  };

  if (maintenancesLoading || courtsLoading || facilitiesLoading || categoriesLoading) {
    return <Spin fullscreen />;
  }

  const categories = (facilityCategories ?? []).map(c => ({
    id: parseInt(c.facilityCategoryId),
    name: c.name
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f7f7f5', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' as const, pointerEvents: 'none' as const }}>
          {toast}
        </div>
      )}

      {/* Detail Modal */}
      {detailItem && (
        <DetailModal
          maintenance={detailItem}
          onStatusChange={handleStatusChange}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Bảo trì</div>
        {view === 'create' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span style={{ fontSize: 14, color: '#D4840A', fontWeight: 500 }}>Tạo phiếu</span>
          </>
        )}
        <div style={{ flex: 1 }} />
        {view === 'list' && (
          <button onClick={() => setView('create')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, border: 'none', background: '#D4840A', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(212,132,10,0.3)' }}>
            🔧 Tạo phiếu bảo trì
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {view === 'create' ? (
          <CreateMaintenanceModal
            courts={courts ?? []}
            facilities={facilities ?? []}
            categories={categories}
            onCreate={handleCreate}
            onBack={() => setView('list')}
          />
        ) : (
          <MaintenanceListView
            maintenances={maintenances ?? []}
            onSelectItem={setDetailItem}
          />
        )}
      </div>
    </div>
  );
}
