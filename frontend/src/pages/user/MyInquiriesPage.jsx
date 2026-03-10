import { INQUIRY_TYPE_LABELS } from '../../constants/inquiryTypes';
import { useCallback, useEffect, useState } from 'react';
import { deleteInquiry, getMyInquiries, updateInquiry } from '../../api/inquiry';
import { useAuth } from '../../hooks/useAuth';

const STATUS_LABEL = { ANSWERED: '답변 완료', PENDING: '대기 중' };
const STATUS_COLOR = { ANSWERED: '#dcfce7', PENDING: '#fef9c3' };

export default function MyInquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const loadInquiries = useCallback(() => {
    getMyInquiries(user?.userId || 1)
      .then((res) => {
        setInquiries(Array.isArray(res.data) ? res.data : []);
        setLoadError('');
      })
      .catch(() => {
        setLoadError('문의 목록을 새로고침하지 못했습니다. 잠시 후 다시 시도해주세요.');
      });
  }, [user?.userId]);

  const resolveInquiryId = (inquiry) => inquiry?.id ?? inquiry?.inquiryId;

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const startEdit = (inquiry) => {
    setEditingId(resolveInquiryId(inquiry));
    setEditTitle(inquiry.title || '');
    setEditContent(inquiry.content || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSave = async (inquiry) => {
    const id = resolveInquiryId(inquiry);
    if (!id || !editTitle.trim() || !editContent.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...inquiry,
        title: editTitle.trim(),
        content: editContent.trim(),
      };
      const res = await updateInquiry(id, payload);
      const updated = res?.data || payload;
      setInquiries((prev) => prev.map((item) => (resolveInquiryId(item) === id ? { ...item, ...updated } : item)));
      cancelEdit();
    } catch {
      window.alert('문의 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (inquiry) => {
    const id = resolveInquiryId(inquiry);
    if (!id) return;
    if (!window.confirm('이 문의를 삭제할까요?')) return;
    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((item) => resolveInquiryId(item) !== id));
      if (editingId === id) cancelEdit();
    } catch {
      window.alert('문의 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>내 문의 내역</h2>
      {loadError && <p style={styles.loadError}>{loadError}</p>}
      {inquiries.length === 0 ? (
        <p style={styles.empty}>문의 내역이 없습니다.</p>
      ) : (
        <div style={styles.list}>
          {inquiries.map(i => {
            const id = resolveInquiryId(i);
            const isEditing = editingId === id;
            return (
            <div key={id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>{i.title}</span>
                <span style={{ ...styles.status, background: STATUS_COLOR[i.inquiryStatus] || '#F3F4F6' }}>
                  {STATUS_LABEL[i.inquiryStatus] || i.inquiryStatus || '접수됨'}
                </span>
              </div>
              <div style={styles.meta}>
                <span>{INQUIRY_TYPE_LABELS[i.inquiryType] || i.inquiryType || '-'}</span>
                <span>{i.createdAt || '-'}</span>
              </div>
              {isEditing ? (
                <div style={styles.editWrap}>
                  <input
                    style={styles.editInput}
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    placeholder="제목"
                  />
                  <textarea
                    style={styles.editTextarea}
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                    placeholder="내용"
                  />
                  <div style={styles.actionRow}>
                    <button
                      type="button"
                      style={{ ...styles.actionBtn, ...styles.primaryBtn, opacity: saving ? 0.7 : 1 }}
                      onClick={() => handleSave(i)}
                      disabled={saving}
                    >
                      저장
                    </button>
                    <button type="button" style={styles.actionBtn} onClick={cancelEdit}>취소</button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={styles.content}>{i.content || '내용이 없습니다.'}</p>
                  <div style={styles.actionRow}>
                    <button type="button" style={{ ...styles.actionBtn, ...styles.primaryGhostBtn }} onClick={() => startEdit(i)}>수정</button>
                    <button type="button" style={{ ...styles.actionBtn, ...styles.dangerBtn }} onClick={() => handleDelete(i)}>삭제</button>
                  </div>
                </>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '700px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px 20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardTitle: { fontSize: '15px', fontWeight: 'bold' },
  status: { fontSize: '12px', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' },
  meta: { display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280' },
  content: { margin: '10px 0 12px', color: '#444', lineHeight: 1.55, fontSize: '14px' },
  editWrap: { marginTop: '12px' },
  editInput: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  editTextarea: { width: '100%', marginTop: '8px', minHeight: '110px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', lineHeight: 1.5, boxSizing: 'border-box', resize: 'vertical' },
  actionRow: { marginTop: '10px', display: 'flex', gap: '8px' },
  actionBtn: { border: '1px solid #D1D5DB', background: '#fff', color: '#374151', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' },
  primaryBtn: { borderColor: '#E8484A', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff' },
  primaryGhostBtn: { borderColor: '#F1B3B3', color: '#C13A3D', background: '#FFF6F6' },
  dangerBtn: { borderColor: '#FECACA', color: '#B91C1C', background: '#FEF2F2' },
  loadError: { margin: '0 0 10px', color: '#B91C1C', fontSize: '13px', fontWeight: 600 },
  empty: { textAlign: 'center', color: '#6b7280', padding: '60px 0' },
};
