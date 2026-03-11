import { useState } from 'react';
import { C, MAX_WIDTH } from '../../styles/tokens';

const DEFAULT_SETTINGS = {
  marketingEmail: true,
  marketingSms: false,
  priceAlert: true,
  reservationReminder: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [message, setMessage] = useState('');
  // TODO(back-end): 사용자 설정 조회/저장 API가 준비되면 현재 local state를 서버 응답과 PATCH 요청으로 교체한다.

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.header}>
          <p style={s.eyebrow}>ACCOUNT SETTINGS</p>
          <h1 style={s.title}>설정</h1>
          <p style={s.desc}>알림, 혜택, 예약 관련 기본 동작을 미리 조정할 수 있는 프론트 화면입니다.</p>
        </div>

        <div style={s.panel}>
          <SettingRow label="이메일 이벤트 알림" desc="프로모션과 쿠폰 소식을 이메일로 받습니다." checked={settings.marketingEmail} onClick={() => toggle('marketingEmail')} />
          <SettingRow label="SMS 혜택 알림" desc="할인 오픈과 긴급 혜택을 문자로 받습니다." checked={settings.marketingSms} onClick={() => toggle('marketingSms')} />
          <SettingRow label="찜 숙소 가격 변동 알림" desc="저장한 숙소의 가격이 변경되면 알려드립니다." checked={settings.priceAlert} onClick={() => toggle('priceAlert')} />
          <SettingRow label="예약 일정 리마인드" desc="체크인 하루 전과 당일 아침에 일정을 알려드립니다." checked={settings.reservationReminder} onClick={() => toggle('reservationReminder')} />
        </div>

        {message ? <p style={s.message}>{message}</p> : null}

        <div style={s.actions}>
          <button type="button" style={s.primaryBtn} onClick={() => setMessage('설정이 저장되었습니다.')}>변경 사항 저장</button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, desc, checked, onClick }) {
  return (
    <div style={s.row}>
      <div>
        <h2 style={s.rowTitle}>{label}</h2>
        <p style={s.rowDesc}>{desc}</p>
      </div>
      <button type="button" style={{ ...s.toggle, background: checked ? C.primary : '#D9D9D9' }} onClick={onClick}>
        <span style={{ ...s.knob, transform: checked ? 'translateX(22px)' : 'translateX(0)' }} />
      </button>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)', padding: '48px 24px 64px' },
  inner: { maxWidth: '880px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  eyebrow: { margin: '0 0 10px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.14em', color: C.primary },
  title: { margin: '0 0 10px', fontSize: '34px', fontWeight: '800', color: C.text },
  desc: { margin: 0, fontSize: '15px', lineHeight: 1.7, color: C.textSub, maxWidth: '700px' },
  panel: { display: 'flex', flexDirection: 'column', gap: '14px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '20px 22px' },
  rowTitle: { margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: C.text },
  rowDesc: { margin: 0, fontSize: '14px', lineHeight: 1.6, color: C.textSub },
  toggle: { width: '50px', height: '28px', border: 'none', borderRadius: '999px', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' },
  knob: { position: 'absolute', top: '3px', left: '3px', width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'transform 0.2s' },
  actions: { display: 'flex', justifyContent: 'flex-end', marginTop: '20px' },
  primaryBtn: { padding: '13px 22px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer' },
  message: { margin: '18px 0 0', fontSize: '13px', color: '#15803D', fontWeight: '700' },
};
