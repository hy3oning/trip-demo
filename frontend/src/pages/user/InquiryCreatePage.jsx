import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { INQUIRY_TYPES, INQUIRY_TYPE_LABELS } from '../../constants/inquiryTypes';
import { ROLES } from '../../constants/roles';
import { createInquiry } from '../../api/inquiry';

export default function InquiryCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const defaultType = params.get('type') || INQUIRY_TYPES.COMMON_TO_ADMIN;
  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const availableTypes = user?.role === ROLES.SELLER
    ? [INQUIRY_TYPES.SELLER_TO_ADMIN, INQUIRY_TYPES.COMMON_TO_ADMIN]
    : [INQUIRY_TYPES.USER_TO_SELLER, INQUIRY_TYPES.COMMON_TO_ADMIN];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInquiry({
        inquiryType: type,
        title,
        content,
        inquiryStatus: 'PENDING',
        userId: user?.userId || 1,
        senderUserId: user?.userId || 1,
        createdAt: new Date().toISOString().slice(0, 10),
      });
      setError('');
      setDone(true);
    } catch {
      setError('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  if (done) return (
    <div style={styles.wrap}>
      <div style={styles.box}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📩</div>
        <h2>문의가 접수되었습니다</h2>
        <p style={{ color: '#6b7280' }}>답변은 마이페이지 → 내 문의에서 확인할 수 있습니다.</p>
        <button onClick={() => navigate('/my/inquiries')} style={styles.btn}>내 문의 보기</button>
      </div>
    </div>
  );

  return (
    <div style={styles.wrap}>
      <div style={styles.box}>
        <h2 style={styles.title}>문의하기</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>문의 유형</label>
          <div style={styles.typeRow}>
            {availableTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                style={{ ...styles.typeBtn, ...(type === t ? styles.typeBtnActive : null) }}
              >
                {INQUIRY_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          <label style={styles.label}>제목</label>
          <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} required placeholder="문의 제목을 입력하세요" />
          <label style={styles.label}>내용</label>
          <textarea style={{ ...styles.input, height: '140px', resize: 'vertical' }} value={content} onChange={e => setContent(e.target.value)} required placeholder="문의 내용을 자세히 입력하세요" />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.btn}>문의 접수</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: 'flex', justifyContent: 'center', padding: '40px 24px' },
  box: { width: '100%', maxWidth: '500px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', textAlign: 'center' },
  title: { fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'left' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', marginTop: '12px', textAlign: 'left' },
  typeRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' },
  typeBtn: {
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    background: '#fff',
    color: '#505050',
    padding: '11px 10px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  typeBtnActive: {
    borderColor: '#E8484A',
    background: '#FFF3F3',
    color: '#C13A3D',
    boxShadow: 'inset 0 0 0 1px #E8484A',
  },
  input: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  error: { margin: '10px 0 0', fontSize: '13px', color: '#DC2626', textAlign: 'left', fontWeight: 600 },
  btn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '15px',
  },
};
