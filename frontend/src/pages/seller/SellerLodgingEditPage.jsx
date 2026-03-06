import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MOCK_LODGINGS = {
  1: { lodgingId: 1, name: '한라산 뷰 펜션', region: '제주', address: '제주시 한경면', pricePerNight: 120000, description: '한라산이 보이는 펜션', latitude: '33.35', longitude: '126.25' },
};

export default function SellerLodgingEditPage() {
  const { lodgingId } = useParams();
  const navigate = useNavigate();
  const src = MOCK_LODGINGS[lodgingId] || {};
  const [form, setForm] = useState({ name: src.name || '', region: src.region || '', address: src.address || '', pricePerNight: src.pricePerNight || '', description: src.description || '', latitude: src.latitude || '', longitude: src.longitude || '' });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('숙소가 수정되었습니다. (mock)');
    navigate('/seller/lodgings');
  };

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>숙소 수정</h2>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>숙소명</label>
        <input style={styles.input} value={form.name} onChange={set('name')} required />
        <label style={styles.label}>주소</label>
        <input style={styles.input} value={form.address} onChange={set('address')} required />
        <label style={styles.label}>1박 요금 (원)</label>
        <input style={styles.input} type="number" value={form.pricePerNight} onChange={set('pricePerNight')} required />
        <label style={styles.label}>숙소 설명</label>
        <textarea style={{ ...styles.input, height: '100px', resize: 'vertical' }} value={form.description} onChange={set('description')} />
        <div style={styles.btns}>
          <button type="submit" style={styles.submitBtn}>저장</button>
          <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>취소</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '600px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', marginTop: '16px' },
  input: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btns: { display: 'flex', gap: '8px', marginTop: '24px' },
  submitBtn: { flex: 1, padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' },
  cancelBtn: { padding: '12px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};
