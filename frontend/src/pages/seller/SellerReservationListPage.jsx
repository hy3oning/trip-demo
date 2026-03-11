import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import ListPageHeader from '../../components/common/ListPageHeader';
import StatusBadge from '../../components/common/StatusBadge';

const MOCK_RESERVATIONS = [
  { bookingId: 1, lodgingName: '한라산 뷰 펜션', guestName: '홍길동', checkIn: '2026-04-10', checkOut: '2026-04-12', guests: 2, totalPrice: 240000, bookingStatus: 'CONFIRMED' },
  { bookingId: 2, lodgingName: '남해 바다 리조트', guestName: '김철수', checkIn: '2026-04-20', checkOut: '2026-04-22', guests: 4, totalPrice: 380000, bookingStatus: 'CONFIRMED' },
  { bookingId: 3, lodgingName: '강릉 해변 호텔', guestName: '이영희', checkIn: '2026-03-15', checkOut: '2026-03-17', guests: 2, totalPrice: 300000, bookingStatus: 'CANCELLED' },
];

const STATUS_LABEL = { CONFIRMED: '예약 확정', CANCELLED: '취소', PENDING: '대기' };
const STATUS_COLOR = { CONFIRMED: '#dcfce7', CANCELLED: '#fee2e2', PENDING: '#fef9c3' };

export default function SellerReservationListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    // TODO(back-end): 판매자 예약 현황 API 응답으로 교체
    setRows(MOCK_RESERVATIONS);
    setLoading(false);
  }, []);

  const columns = [
    { key: 'lodgingName', label: '숙소' },
    { key: 'guestName', label: '예약자', width: '120px' },
    { key: 'checkIn', label: '체크인', width: '120px' },
    { key: 'checkOut', label: '체크아웃', width: '120px' },
    { key: 'guests', label: '인원', width: '90px', render: (row) => `${row.guests}명` },
    { key: 'totalPrice', label: '금액', width: '120px', render: (row) => `${row.totalPrice.toLocaleString()}원` },
    {
      key: 'bookingStatus',
      label: '상태',
      width: '110px',
      render: (row) => (
        <StatusBadge
          label={STATUS_LABEL[row.bookingStatus]}
          background={STATUS_COLOR[row.bookingStatus]}
          color={row.bookingStatus === 'CONFIRMED' ? '#166534' : row.bookingStatus === 'PENDING' ? '#854D0E' : '#B91C1C'}
        />
      ),
    },
  ];

  return (
    <div style={styles.wrap}>
      <ListPageHeader title="예약 현황" description={`총 ${rows.length}건의 예약 상태를 관리 중입니다.`} />
      <DataTable columns={columns} rows={rows} loading={loading} error={error} emptyText="표시할 예약이 없습니다." emptyDescription="새 예약이 들어오면 체크인 일정과 결제 금액을 이 목록에서 바로 볼 수 있습니다." />
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
};
