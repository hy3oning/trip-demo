import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { C, MAX_WIDTH } from '../../styles/tokens';

const STORAGE_KEY = 'tripzone-attendance-v1';
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const REWARD_STEPS = [
  { day: 1, point: 100, label: '첫 출석 보상' },
  { day: 3, point: 300, label: '3일 연속 보상' },
  { day: 7, point: 700, label: '7일 연속 보상' },
  { day: 14, point: 1500, label: '14일 연속 보상' },
  { day: 30, point: 4000, label: '30일 연속 보상' },
];

// TODO(back-end):
// - GET /api/v1/events/attendance
//   expected shape:
//   {
//     dates: ['2026-03-11', '2026-03-12'],
//     streakCount: 2,
//     monthAttendance: 2,
//     rewardSteps: [{ day: 1, point: 100, label: '첫 출석 보상' }]
//   }
// - POST /api/v1/events/attendance/check
//   expected shape:
//   {
//     attendedDate: '2026-03-13',
//     earnedPoint: 100,
//     streakCount: 3,
//     totalPointBalance: 5400
//   }
// 프론트는 위 shape만 맞으면 localStorage 부분을 API 호출로 바로 교체할 수 있다.

function toISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseStoredAttendance() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.dates) ? parsed.dates : [];
  } catch {
    return [];
  }
}

function saveAttendance(dates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ dates }));
}

function buildMonthMatrix(baseDate) {
  const firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }).map((_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return current;
  });
}

function getStreakCount(dates) {
  if (!dates.length) return 0;

  const sorted = [...dates].sort();
  let streak = 1;

  for (let i = sorted.length - 1; i > 0; i -= 1) {
    const current = new Date(sorted[i]);
    const prev = new Date(sorted[i - 1]);
    const diff = Math.round((current.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) streak += 1;
    else if (diff > 1) break;
  }

  return streak;
}

export default function AttendancePage() {
  const today = useMemo(() => new Date(), []);
  const todayKey = toISO(today);
  const [attendedDates, setAttendedDates] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // TODO(back-end): 출석 목록 조회 API가 준비되면 localStorage 대신 서버 응답으로 교체한다.
    // 응답의 dates 배열만 연결해도 현재 달력/연속 출석/월 출석 수 계산 UI는 그대로 유지된다.
    setAttendedDates(parseStoredAttendance());
  }, []);

  const hasAttendedToday = attendedDates.includes(todayKey);
  const streakCount = useMemo(() => getStreakCount(attendedDates), [attendedDates]);
  const monthDates = useMemo(() => buildMonthMatrix(today), [today]);
  const monthAttendance = attendedDates.filter((date) => date.startsWith(`${todayKey.slice(0, 7)}-`)).length;
  const nextReward = REWARD_STEPS.find((item) => item.day > streakCount) || REWARD_STEPS[REWARD_STEPS.length - 1];

  const handleAttendToday = () => {
    if (hasAttendedToday) {
      setMessage('오늘은 이미 출석했습니다.');
      return;
    }

    const nextDates = [...attendedDates, todayKey].sort();
    // TODO(back-end): 출석 저장 API가 준비되면 서버 저장 성공 후 local state를 갱신한다.
    // earnedPoint, streakCount, totalPointBalance를 응답으로 받으면 성공 메시지와 요약 카드도 바로 서버 기준으로 치환 가능하다.
    saveAttendance(nextDates);
    setAttendedDates(nextDates);
    setMessage('오늘 출석이 완료되었습니다. 포인트 적립은 백엔드 연동 시 실제 반영됩니다.');
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <section style={s.hero}>
          <div>
            <p style={s.eyebrow}>ATTENDANCE EVENT</p>
            <h1 style={s.title}>출석체크</h1>
            <p style={s.desc}>매일 한 번 출석하고 누적 출석 보상을 받는 프론트 mock 기능입니다. 백엔드가 붙으면 서버 저장만 연결하면 됩니다.</p>
          </div>
          <button type="button" style={{ ...s.primaryBtn, opacity: hasAttendedToday ? 0.7 : 1 }} onClick={handleAttendToday}>
            {hasAttendedToday ? '오늘 출석 완료' : '오늘 출석하기'}
          </button>
        </section>

        <section style={s.summaryGrid}>
          <article style={s.summaryCard}>
            <p style={s.summaryLabel}>연속 출석</p>
            <p style={s.summaryValue}>{streakCount}일</p>
            <p style={s.summaryDesc}>연속 출석이 끊기면 다시 1일부터 시작합니다.</p>
          </article>
          <article style={s.summaryCard}>
            <p style={s.summaryLabel}>이번 달 출석</p>
            <p style={s.summaryValue}>{monthAttendance}일</p>
            <p style={s.summaryDesc}>{today.getFullYear()}년 {today.getMonth() + 1}월 기준 출석 횟수입니다.</p>
          </article>
          <article style={s.summaryCard}>
            <p style={s.summaryLabel}>다음 보상</p>
            <p style={s.summaryValue}>{nextReward.day}일차</p>
            <p style={s.summaryDesc}>{nextReward.point.toLocaleString()}P · {nextReward.label}</p>
          </article>
        </section>

        {message ? <p style={s.message}>{message}</p> : null}

        <section style={s.contentGrid}>
          <article style={s.calendarCard}>
            <div style={s.cardHead}>
              <div>
                <p style={s.cardEyebrow}>MONTHLY CALENDAR</p>
                <h2 style={s.cardTitle}>{today.getFullYear()}년 {today.getMonth() + 1}월 출석 현황</h2>
              </div>
              <Link to="/events/attendance-point-festa" style={s.secondaryBtn}>이벤트 상세</Link>
            </div>

            <div style={s.calendarWeek}>
              {WEEK_DAYS.map((day) => (
                <span key={day} style={s.weekCell}>{day}</span>
              ))}
            </div>

            <div style={s.calendarGrid}>
              {monthDates.map((date) => {
                const iso = toISO(date);
                const isCurrentMonth = date.getMonth() === today.getMonth();
                const isToday = iso === todayKey;
                const isChecked = attendedDates.includes(iso);

                return (
                  <div
                    key={iso}
                    style={{
                      ...s.dateCell,
                      opacity: isCurrentMonth ? 1 : 0.35,
                      borderColor: isToday ? '#F1B3B3' : C.borderLight,
                      background: isChecked ? '#FFF1F1' : '#fff',
                    }}
                  >
                    <span style={{ ...s.dateNumber, color: isChecked ? C.primary : C.text }}>{date.getDate()}</span>
                    {isChecked ? <span style={s.checkedBadge}>출석</span> : null}
                    {isToday && !isChecked ? <span style={s.todayBadge}>오늘</span> : null}
                  </div>
                );
              })}
            </div>
          </article>

          <article style={s.rewardCard}>
            <div style={s.cardHead}>
              <div>
                <p style={s.cardEyebrow}>REWARD STEPS</p>
                <h2 style={s.cardTitle}>누적 보상 안내</h2>
              </div>
            </div>

            <div style={s.rewardList}>
              {REWARD_STEPS.map((item) => (
                <div
                  key={item.day}
                  style={{
                    ...s.rewardRow,
                    borderColor: streakCount >= item.day ? '#F1B3B3' : C.borderLight,
                    background: streakCount >= item.day ? '#FFF7F7' : '#fff',
                  }}
                >
                  <div>
                    <p style={s.rewardDay}>{item.day}일차</p>
                    <p style={s.rewardLabel}>{item.label}</p>
                  </div>
                  <strong style={s.rewardPoint}>{item.point.toLocaleString()}P</strong>
                </div>
              ))}
            </div>

            <div style={s.helperBox}>
              <p style={s.helperTitle}>백엔드 연결 가이드</p>
              <p style={s.helperDesc}>출석 목록 조회, 오늘 출석 저장, 누적 보상 지급 여부만 API로 바꾸면 현재 UI는 그대로 유지할 수 있습니다. localStorage는 임시 저장소이고, 날짜 배열과 적립 포인트 응답만 내려주면 됩니다.</p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)', padding: '48px 24px 72px' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' },
  eyebrow: { margin: '0 0 10px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.14em', color: C.primary },
  title: { margin: '0 0 10px', fontSize: '36px', fontWeight: '800', color: C.text },
  desc: { margin: 0, maxWidth: '760px', fontSize: '15px', lineHeight: 1.8, color: C.textSub },
  primaryBtn: { border: 'none', borderRadius: '999px', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff', padding: '13px 22px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  summaryCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '20px 22px', boxShadow: '0 10px 24px rgba(15,23,42,0.04)' },
  summaryLabel: { margin: 0, fontSize: '13px', color: C.textSub, fontWeight: '700' },
  summaryValue: { margin: '10px 0 8px', fontSize: '28px', color: C.text, fontWeight: '800' },
  summaryDesc: { margin: 0, fontSize: '13px', lineHeight: 1.7, color: C.textSub },
  message: { margin: 0, padding: '14px 16px', borderRadius: '16px', background: '#FFF7F7', color: C.primary, fontSize: '14px', fontWeight: '800' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px', alignItems: 'start' },
  calendarCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', padding: '22px', boxShadow: '0 12px 28px rgba(15,23,42,0.05)' },
  rewardCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', padding: '22px', boxShadow: '0 12px 28px rgba(15,23,42,0.05)' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' },
  cardEyebrow: { margin: '0 0 8px', fontSize: '12px', fontWeight: '800', color: C.primary, letterSpacing: '0.08em' },
  cardTitle: { margin: 0, fontSize: '24px', fontWeight: '800', color: C.text },
  secondaryBtn: { display: 'inline-flex', padding: '10px 14px', borderRadius: '999px', border: `1px solid ${C.border}`, background: '#fff', color: C.text, textDecoration: 'none', fontSize: '13px', fontWeight: '700' },
  calendarWeek: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '10px' },
  weekCell: { textAlign: 'center', fontSize: '12px', fontWeight: '800', color: C.textLight },
  calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' },
  dateCell: { minHeight: '74px', border: `1px solid ${C.borderLight}`, borderRadius: '16px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#fff' },
  dateNumber: { fontSize: '14px', fontWeight: '800' },
  checkedBadge: { display: 'inline-flex', alignSelf: 'flex-start', padding: '4px 7px', borderRadius: '999px', background: '#FDE2E2', color: C.primary, fontSize: '10px', fontWeight: '800' },
  todayBadge: { display: 'inline-flex', alignSelf: 'flex-start', padding: '4px 7px', borderRadius: '999px', background: '#EEF2FF', color: '#4F46E5', fontSize: '10px', fontWeight: '800' },
  rewardList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  rewardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', border: `1px solid ${C.borderLight}`, borderRadius: '16px', padding: '14px 16px' },
  rewardDay: { margin: '0 0 5px', fontSize: '15px', fontWeight: '800', color: C.text },
  rewardLabel: { margin: 0, fontSize: '13px', color: C.textSub },
  rewardPoint: { fontSize: '16px', color: C.primary, fontWeight: '800' },
  helperBox: { marginTop: '18px', borderRadius: '18px', background: '#F8F8F8', border: `1px solid ${C.borderLight}`, padding: '16px' },
  helperTitle: { margin: '0 0 8px', fontSize: '14px', fontWeight: '800', color: C.text },
  helperDesc: { margin: 0, fontSize: '13px', lineHeight: 1.7, color: C.textSub },
};
