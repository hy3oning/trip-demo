import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { INQUIRY_TYPES, INQUIRY_TYPE_LABELS } from '../../constants/inquiryTypes';
import { ROLES } from '../../constants/roles';
import { createInquiry } from '../../api/inquiry';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function InquiryCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const defaultType = params.get('type') || INQUIRY_TYPES.COMMON_TO_ADMIN;
  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const MAX_TITLE = 60;
  const MAX_CONTENT = 2000;

  const availableTypes = user?.role === ROLES.SELLER
    ? [INQUIRY_TYPES.SELLER_TO_ADMIN, INQUIRY_TYPES.COMMON_TO_ADMIN]
    : [INQUIRY_TYPES.USER_TO_SELLER, INQUIRY_TYPES.COMMON_TO_ADMIN];

  const safeType = availableTypes.includes(type) ? type : availableTypes[0];
  const roleLabel = user?.role === ROLES.SELLER ? '숙소 등록자 문의' : '여행객 문의';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInquiry({
        inquiryType: safeType,
        title,
        content,
        attachments,
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

  const handleAttach = async (e) => {
    const files = Array.from(e.target.files || []);
    const selected = files.slice(0, 3);
    try {
      const mapped = await Promise.all(
        selected.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: await fileToDataUrl(file),
        }))
      );
      setAttachments(mapped);
    } catch {
      setError('첨부파일을 읽는 중 오류가 발생했습니다. 다시 시도해주세요.');
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
      <style>{`
        @media (max-width: 920px) {
          .tz-inquiry-layout { grid-template-columns: 1fr !important; }
          .tz-inquiry-side { order: 2; }
        }
      `}</style>
      <div style={styles.box} className="tz-inquiry-layout">
        <aside style={styles.side} className="tz-inquiry-side">
          <div style={styles.sideCardMain}>
            <p style={styles.sideBadge}>{roleLabel}</p>
            <h3 style={styles.sideTitle}>문의 접수 안내</h3>
            <ul style={styles.sideList}>
              <li>문의 유형을 먼저 선택해 주세요.</li>
              <li>제목은 핵심 내용을 20자 내외로 작성하면 빠르게 확인됩니다.</li>
              <li>답변은 마이페이지 또는 문의 내역에서 확인할 수 있습니다.</li>
            </ul>
          </div>
          <div style={styles.sideCardSub}>
            <p style={styles.sideSubTitle}>빠른 처리 팁</p>
            <ul style={styles.sideListCompact}>
              <li>예약번호/숙소명/일정을 함께 입력</li>
              <li>오류 화면은 캡처 이미지 첨부</li>
              <li>긴급 이슈는 제목 앞에 [긴급]</li>
            </ul>
          </div>
        </aside>

        <section>
          <h2 style={styles.title}>문의하기</h2>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>문의 유형</label>
            <div style={styles.typeRow}>
              {availableTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  style={{ ...styles.typeBtn, ...(safeType === t ? styles.typeBtnActive : null) }}
                >
                  {INQUIRY_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
            <label style={styles.label}>제목</label>
            <input
              style={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value.slice(0, MAX_TITLE))}
              required
              placeholder="문의 제목을 입력하세요"
            />
            <p style={styles.counter}>{title.length} / {MAX_TITLE}</p>
            <label style={styles.label}>내용</label>
            <textarea
              style={{ ...styles.input, minHeight: '230px', resize: 'vertical' }}
              value={content}
              onChange={e => setContent(e.target.value.slice(0, MAX_CONTENT))}
              required
              placeholder="문의 내용을 자세히 입력하세요"
            />
            <p style={styles.counter}>{content.length} / {MAX_CONTENT}</p>

            <label style={styles.label}>첨부파일 (선택)</label>
            <div style={styles.attachWrap}>
              <label htmlFor="inquiry-attachments" style={styles.attachBtn}>파일 선택</label>
              <input
                id="inquiry-attachments"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAttach}
                style={styles.attachInput}
              />
              <p style={styles.attachHint}>이미지 최대 3개까지 첨부 가능 (문의 payload에 함께 저장됩니다)</p>
              {attachments.length > 0 && (
                <ul style={styles.attachList}>
                  {attachments.map((file) => (
                    <li key={`${file.name}-${file.size}`} style={styles.attachItem}>{file.name} ({Math.round(file.size / 1024)}KB)</li>
                  ))}
                </ul>
              )}
            </div>

            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.btn}>문의 접수</button>
          </form>
        </section>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: 'flex', justifyContent: 'center', padding: '42px 24px' },
  box: {
    width: '100%',
    maxWidth: '1040px',
    background: '#fff',
    border: '1px solid #ece6e6',
    borderRadius: '18px',
    padding: '28px',
    display: 'grid',
    gridTemplateColumns: '320px minmax(0, 1fr)',
    gap: '24px',
    boxShadow: '0 14px 28px rgba(0,0,0,0.06)',
  },
  side: {
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gap: '12px',
    minHeight: '100%',
  },
  sideCardMain: {
    borderRadius: '14px',
    border: '1px solid #F0E7E7',
    background: '#FFF9F8',
    padding: '18px',
  },
  sideCardSub: {
    borderRadius: '14px',
    border: '1px solid #ECEFF4',
    background: '#F9FBFE',
    padding: '14px 16px',
  },
  sideBadge: {
    margin: 0,
    display: 'inline-flex',
    borderRadius: '999px',
    background: '#FFEEEE',
    color: '#B93E40',
    fontSize: '12px',
    fontWeight: 700,
    padding: '6px 10px',
  },
  sideTitle: {
    margin: '12px 0 10px',
    fontSize: '18px',
    color: '#242424',
  },
  sideList: {
    margin: 0,
    paddingLeft: '18px',
    color: '#636363',
    fontSize: '13px',
    lineHeight: 1.8,
  },
  sideSubTitle: {
    margin: '0 0 8px',
    color: '#374151',
    fontSize: '13px',
    fontWeight: 800,
  },
  sideListCompact: {
    margin: 0,
    paddingLeft: '18px',
    color: '#657084',
    fontSize: '12px',
    lineHeight: 1.7,
  },
  title: { fontSize: '26px', fontWeight: '800', margin: '2px 0 16px', textAlign: 'left' },
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
  input: {
    width: '100%',
    padding: '12px 12px',
    border: '1px solid #dcdfe5',
    borderRadius: '10px',
    fontSize: '15px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  counter: {
    margin: '6px 0 0',
    fontSize: '12px',
    color: '#9097A3',
    textAlign: 'right',
    fontWeight: 600,
  },
  attachWrap: {
    marginTop: '4px',
    border: '1px dashed #D7DCE4',
    borderRadius: '10px',
    padding: '12px',
    background: '#FAFBFD',
  },
  attachBtn: {
    display: 'inline-flex',
    borderRadius: '8px',
    border: '1px solid #E3E7EE',
    background: '#fff',
    color: '#4A5363',
    fontSize: '13px',
    fontWeight: 700,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  attachInput: {
    display: 'none',
  },
  attachHint: {
    margin: '10px 0 0',
    color: '#7D8796',
    fontSize: '12px',
  },
  attachList: {
    margin: '10px 0 0',
    padding: '0 0 0 16px',
    color: '#4F5764',
    fontSize: '12px',
    lineHeight: 1.6,
  },
  attachItem: {
    marginBottom: '2px',
  },
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
