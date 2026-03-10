import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import EmptyState from '../../components/common/EmptyState';
import { getLodgings, deleteLodging } from '../../api/lodging';
import { C, MAX_WIDTH, R, S } from '../../styles/tokens';

export default function SellerLodgingListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lodgings, setLodgings] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    getLodgings({ sellerId: user?.userId || 1 }).then(res => setLodgings(res.data)).catch(() => {});
  }, [user]);

  const handleDelete = async (lodgingId) => {
    await deleteLodging(lodgingId).catch(() => {});
    setLodgings(prev => prev.filter(l => l.lodgingId !== lodgingId));
    setDeleteTargetId(null);
  };

  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        {/* 헤더 */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>내 숙소 관리</h1>
            <p style={s.sub}>{lodgings.length}개 숙소 등록됨</p>
          </div>
          <Link to="/seller/lodgings/create" style={s.addBtn}>+ 숙소 등록</Link>
        </div>

        {/* 목록 */}
        {lodgings.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="등록된 숙소가 없습니다"
            desc="첫 번째 숙소를 등록하고 예약을 받아보세요."
            action={{ label: '+ 숙소 등록하기', onClick: () => navigate('/seller/lodgings/create') }}
          />
        ) : (
          <div style={s.list}>
            {lodgings.map(l => (
              <div key={l.lodgingId} style={s.card}>
                <img src={l.thumbnailUrl} alt={l.name} style={s.img} />
                <div style={s.cardBody}>
                  <div style={s.cardTop}>
                    <div>
                      <span style={s.regionBadge}>{l.region}</span>
                      <p style={s.lodgingName}>{l.name}</p>
                      <p style={s.lodgingMeta}>{l.address}</p>
                    </div>
                    <div style={s.cardRight}>
                      <p style={s.price}>{l.pricePerNight.toLocaleString()}원<span style={s.perNight}> / 1박</span></p>
                      <p style={s.rating}>★ {l.rating}</p>
                    </div>
                  </div>
                  <div style={s.cardActions}>
                    <Link to={`/lodgings/${l.lodgingId}`} style={s.previewBtn}>미리보기</Link>
                    <Link to={`/seller/lodgings/${l.lodgingId}/edit`} style={s.editBtn}>수정</Link>
                    <button onClick={() => setDeleteTargetId(l.lodgingId)} style={s.deleteBtn}>삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {deleteTargetId && (
          <div style={s.modalOverlay}>
            <div style={s.modal}>
              <h3 style={s.modalTitle}>숙소를 삭제하시겠습니까?</h3>
              <p style={s.modalDesc}>삭제 후에는 복구할 수 없습니다.</p>
              <div style={s.modalBtns}>
                <button onClick={() => handleDelete(deleteTargetId)} style={s.modalDelete}>삭제</button>
                <button onClick={() => setDeleteTargetId(null)} style={s.modalCancel}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  wrap: { background: C.bgGray, minHeight: 'calc(100vh - 160px)', padding: '48px 24px' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '700', color: C.text, margin: '0 0 4px' },
  sub: { fontSize: '14px', color: C.textSub, margin: 0 },
  addBtn: {
    padding: '12px 20px',
    background: C.primary,
    color: '#fff',
    borderRadius: R.md,
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    background: C.bg,
    borderRadius: '16px',
    boxShadow: S.card,
    display: 'flex',
    gap: '0',
    overflow: 'hidden',
  },
  img: { width: '200px', height: '160px', objectFit: 'cover', flexShrink: 0 },
  cardBody: { flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  regionBadge: { fontSize: '12px', fontWeight: '600', color: C.textSub, marginBottom: '4px', display: 'block' },
  lodgingName: { fontSize: '18px', fontWeight: '700', color: C.text, margin: '0 0 4px' },
  lodgingMeta: { fontSize: '13px', color: C.textSub, margin: 0 },
  cardRight: { textAlign: 'right' },
  price: { fontSize: '18px', fontWeight: '700', color: C.text, margin: '0 0 4px' },
  perNight: { fontSize: '13px', fontWeight: '400', color: C.textSub },
  rating: { fontSize: '13px', color: C.text, margin: 0 },
  cardActions: { display: 'flex', gap: '8px' },
  previewBtn: {
    padding: '8px 16px',
    background: C.bgGray,
    color: C.text,
    borderRadius: R.md,
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    border: `1px solid ${C.border}`,
  },
  editBtn: {
    padding: '8px 16px',
    background: C.bg,
    color: C.text,
    borderRadius: R.md,
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    border: `1px solid ${C.border}`,
  },
  deleteBtn: {
    padding: '8px 16px',
    background: 'none',
    color: '#EF4444',
    border: `1px solid #FECACA`,
    borderRadius: R.md,
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
  },
  modal: {
    background: C.bg, borderRadius: '16px', padding: '32px',
    maxWidth: '400px', width: '90%', textAlign: 'center',
  },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: C.text, margin: '0 0 8px' },
  modalDesc: { fontSize: '14px', color: C.textSub, margin: '0 0 24px' },
  modalBtns: { display: 'flex', gap: '10px' },
  modalDelete: {
    flex: 1, padding: '12px', background: '#EF4444', color: '#fff',
    border: 'none', borderRadius: R.md, fontWeight: '700', cursor: 'pointer',
  },
  modalCancel: {
    flex: 1, padding: '12px', background: C.bgGray, color: C.text,
    border: 'none', borderRadius: R.md, fontWeight: '600', cursor: 'pointer',
  },
};
