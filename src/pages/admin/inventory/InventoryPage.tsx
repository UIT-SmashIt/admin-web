import { useState, useMemo } from 'react';


import { Spin } from 'antd';
import {
  useAddProduct, useAddProductCategory,
  useAddProductImport,
  useEditProduct, useEditProductCategory,
  useEditProductQuantity, useFetchProductCategories, useFetchProductImports,
  useFetchProducts
} from "../../../hooks/useProduct.ts";
import type {
  IProduct,
  ProductAddPayload, ProductCategoryPayload,
  ProductEditPayload, ProductEditQuantityPayload, ProductImportAddPayload,
} from "../../../types/product.type.ts";
import {StockListView} from "./components/StockListView.tsx";
import {type ItemModalMode, ProductEditor} from "./components/ProductDetailEditor.tsx";
import {CategoryManagerModal} from "./components/CategoryModal.tsx";
import {ImportHistoryView} from "./components/ImportHistoryView.tsx";
import {ImportView} from "./components/ImportView.tsx";
import {AdjustQtyModal} from "./components/AdjustQtyModal.tsx";
import {RacketStatusTab} from "./components/RacketStatusTab.tsx";
import type {RacketRental} from "../../../types/racket.type.ts";

type View = 'list' | 'import' | 'racket';

export default function KhoDichVu() {
  const { data: products, isLoading: productsLoading } = useFetchProducts();
  const { mutate: addProduct } = useAddProduct();
  const { mutate: editProduct } = useEditProduct();
  const { mutate: editProductQuantity } = useEditProductQuantity();
  const { data: imports, isLoading: importsLoading} = useFetchProductImports();
  const { mutate: addImport } = useAddProductImport();
  const { data: categories, isLoading: categoriesLoading} = useFetchProductCategories();
  const { mutate: addCategory } = useAddProductCategory();
  const { mutate: editCategory } = useEditProductCategory();
  const [view, setView] = useState<View>('list');
  const [itemModal, setItemModal] = useState<{ mode: ItemModalMode; item: IProduct | null }>({ mode: null, item: null });
  const [adjustTarget, setAdjustTarget] = useState<IProduct | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [racketRentals] = useState<RacketRental[]>([
    // Placeholder data
    {
      rentalId: 1,
      orderId: '#DH001',
      courtName: 'Sân 1 - Tầng 2',
      rentalTime: new Date(Date.now() - 3600000).toISOString(),
      returnTime: new Date(Date.now() + 3600000).toISOString(),
      status: 'Đang sử dụng',
      racketName: 'Vợt Victor JS-12',
      quantity: 2,
    },
    {
      rentalId: 2,
      orderId: '#DH002',
      courtName: 'Sân 2 - Tầng 1',
      rentalTime: new Date(Date.now() - 7200000).toISOString(),
      returnTime: new Date(Date.now() - 3600000).toISOString(),
      status: 'Hoàn tất',
      racketName: 'Vợt Yonex Astrox',
      quantity: 1,
    },
    {
      rentalId: 3,
      orderId: '#DH003',
      courtName: 'Sân 3 - Tầng 3',
      rentalTime: new Date(Date.now() + 86400000).toISOString(),
      returnTime: new Date(Date.now() + 90000000).toISOString(),
      status: 'Đã đặt',
      racketName: 'Vợt Victor JS-12',
      quantity: 3,
    },
  ]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  // ── CATEGORY CRUD ──────────────────────────────────────────────

  const handleAddCategory = (cat: ProductCategoryPayload) => {
    addCategory(cat);
    showToast('✓ Đã thêm danh mục: ' + cat.name);
  };

  const handleEditCategory = (id: number, cat: ProductCategoryPayload) => {
    editCategory({id: id, data: cat});
    showToast('✓ Đã cập nhật danh mục: ' + cat.name);
  };

  const handleDeleteCategory = (name: string) => {
    // setLocalCategories(prev => prev.filter(c => c.name !== name));
    showToast('🗑 Đã xóa danh mục: ' + name);
  };

  const itemCountByCategory = useMemo(() => {
    const m: Record<string, number> = {};
    (products ?? []).forEach(i => { m[i.categoryId] = (m[i.categoryId] ?? 0) + 1; });
    return m;
  }, [products]);

  // ── CRUD: swap these with API calls ───────────────────────────

  const handleAddItem = (newItem: ProductAddPayload) => {
    addProduct(newItem);
    showToast('✓ Đã thêm: ' + newItem.productName);
  };

  const handleEditItem = (product: ProductEditPayload) => {
    editProduct({id: product.productId, data: product})
    showToast('✓ Đã cập nhật: ' + product.productName);
  };

  const handleAdjustQty = (itemId: number, payload: ProductEditQuantityPayload) => {
    // await api.post('/inventory/adjust', { itemId, variantId, delta, note })
    editProductQuantity({id: itemId, data: payload});
    showToast(`✓ ${payload.quantity > 0 ? 'Nhập +' + payload.quantity : 'Xuất ' + payload} đơn vị`);
  };

  const handleImport = (record: ProductImportAddPayload) => {
    // await api.post('/inventory/import', record)
    addImport(record);
  };

  if (categoriesLoading || productsLoading || importsLoading) { return <Spin fullscreen /> }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f7f7f5', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' as const, pointerEvents: 'none' as const }}>
          {toast}
        </div>
      )}

      {/* Modals */}
      {itemModal.mode && (
        <ProductEditor
          mode={itemModal.mode}
          item={itemModal.item}
          categories={categories ?? []}
          onAdd={handleAddItem}
          onEdit={handleEditItem}
          onClose={() => setItemModal({ mode: null, item: null })} />
      )}
      {adjustTarget && (
        <AdjustQtyModal item={adjustTarget} onSave={handleAdjustQty} onClose={() => setAdjustTarget(null)} />
      )}
      {showHistory && <ImportHistoryView history={imports ?? []} onClose={() => setShowHistory(false)} />}
      {showCategoryManager && (
        <CategoryManagerModal
          categories={categories ?? []}
          itemCountByCategory={itemCountByCategory}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Kho & dịch vụ</div>
        {view === 'import' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span style={{ fontSize: 14, color: '#D4840A', fontWeight: 500 }}>Nhập hàng</span>
          </>
        )}
        {view === 'racket' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span style={{ fontSize: 14, color: '#D4840A', fontWeight: 500 }}>Quản lý vợt</span>
          </>
        )}
      </div>

      {/* Tab buttons */}
      {view === 'list' && (
        <div style={{ display: 'flex', gap: 2, padding: '8px 20px', background: '#fff', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <button
            onClick={() => setView('list')}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              background: '#D4840A',
              color: '#fff',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Kho hàng
          </button>
          <button
            onClick={() => setView('racket')}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              background: 'transparent',
              color: '#999',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Quản lý vợt 🎾
          </button>
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {view === 'list' ? (
          <StockListView
            items={products ?? []}
            categories={categories ?? []}
            onImport={() => setView('import')}
            onShowHistory={() => setShowHistory(true)}
            onAddItem={() => setItemModal({ mode: 'add', item: null })}
            onEditItem={item => setItemModal({ mode: 'edit', item })}
            onAdjustQty={item => setAdjustTarget(item)}
            onManageCategories={() => setShowCategoryManager(true)}
          />
        ) : view === 'import' ? (
          <ImportView items={products ?? []} onBack={() => setView('list')} onImport={handleImport} />
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', paddingTop: 20 }}>
            <RacketStatusTab rentals={racketRentals} onBack={() => setView('list')} />
          </div>
        )}
      </div>
    </div>
  );
}