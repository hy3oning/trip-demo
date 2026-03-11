const ATTENDANCE_STORAGE_KEY = 'tripzone-attendance-v1';
const ATTENDANCE_REWARD_STEPS = [
  { day: 1, point: 100 },
  { day: 3, point: 300 },
  { day: 7, point: 700 },
  { day: 14, point: 1500 },
  { day: 30, point: 4000 },
];

function getDayDiff(currentDate, previousDate) {
  const current = new Date(currentDate);
  const previous = new Date(previousDate);
  return Math.round((current.getTime() - previous.getTime()) / 86400000);
}

export function parseAttendanceDates() {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.dates) ? parsed.dates : [];
  } catch {
    return [];
  }
}

export function buildAttendanceMileageItems() {
  const dates = [...parseAttendanceDates()].sort();
  let streak = 0;

  return dates.flatMap((date, index) => {
    if (index === 0) {
      streak = 1;
    } else {
      const diff = getDayDiff(date, dates[index - 1]);
      streak = diff === 1 ? streak + 1 : 1;
    }

    const day = streak;
    const matchedReward = ATTENDANCE_REWARD_STEPS.find((item) => item.day === day);
    if (!matchedReward) return [];

    return [
      {
        mileageHistoryNo: `attendance-${date}-${day}`,
        changeType: 'EARN',
        reason: `출석체크 ${day}일차 적립`,
        changeAmount: matchedReward.point,
        balanceAfter: null,
        regDate: date,
        status: 'MOCK_PENDING',
      },
    ];
  });
}

export function getPendingAttendancePoint() {
  return buildAttendanceMileageItems().reduce((sum, item) => sum + item.changeAmount, 0);
}
