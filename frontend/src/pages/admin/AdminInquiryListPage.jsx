import { useState } from 'react';
import { INQUIRY_TYPE_LABELS } from '../../constants/inquiryTypes';
import DataTable from '../../components/common/DataTable';
import FilterChips from '../../components/common/FilterChips';
import ListPageHeader from '../../components/common/ListPageHeader';
import StatusBadge from '../../components/common/StatusBadge';

const MOCK_INQUIRIES = [
  { inquiryId: 1, senderName: '홍길동', inquiryType: 'USER_TO_SELLER', title: '주차 가능한가요?', inquiryStatus: 'PENDING', createdAt: '2026-03-01' },
  { inquiryId: 2, senderName: '김판매', inquiryType: 'SELLER_TO_ADMIN', title: '숙소 등록 오류 문의', inquiryStatus: 'ANSWERED', createdAt: '2026-03-02' },
  { inquiryId: 3, senderName: '이영희', inquiryType: 'COMMON_TO_ADMIN', title: '로그인이 안 됩니다', inquiryStatus: 'PENDING', createdAt: '2026-03-04' },
  { inquiryId: 4, senderName: '박사장', inquiryType: 'SELLER_TO_ADMIN', title: '정산 관련 문의', inquiryStatus: 'PENDING', createdAt: '2026-03-05' },
];

const STATUS_COLOR = { ANSWERED: '#dcfce7', PENDING: '#fef9c3' };
const STATUS_LABEL = { ANSWERED: '답변 완료', PENDING: '대기 중' };

export default function AdminInquiryListPage() {
  const [filter, setFilter] = useState('ALL');
  const [loading] = useState(false);
  const [error] = useState('');

  const filtered = filter === 'ALL' ? MOCK_INQUIRIES : MOCK_INQUIRIES.filter(i => i.inquiryType === filter);
  const filterItems = [
    { value: 'ALL', label: '전체' },
    { value: 'USER_TO_SELLER', label: INQUIRY_TYPE_LABELS.USER_TO_SELLER },
    { value: 'SELLER_TO_ADMIN', label: INQUIRY_TYPE_LABELS.SELLER_TO_ADMIN },
    { value: 'COMMON_TO_ADMIN', label: INQUIRY_TYPE_LABELS.COMMON_TO_ADMIN },
  ];

  const columns = [
    { key: 'senderName', label: '문의자', width: '120px' },
    { key: 'inquiryType', label: '유형', render: (row) => INQUIRY_TYPE_LABELS[row.inquiryType] },
    { key: 'title', label: '제목' },
    {
      key: 'inquiryStatus',
      label: '상태',
      width: '110px',
      render: (row) => (
        <StatusBadge
          label={STATUS_LABEL[row.inquiryStatus]}
          background={STATUS_COLOR[row.inquiryStatus]}
          color={row.inquiryStatus === 'ANSWERED' ? '#166534' : '#854D0E'}
        />
      ),
    },
    { key: 'createdAt', label: '접수일', width: '120px' },
  ];

  return (
    <div style={styles.wrap}>
      <ListPageHeader
        title="문의 관리"
        description={`현재 필터 기준 ${filtered.length}건의 문의가 보입니다.`}
        actions={<FilterChips items={filterItems} value={filter} onChange={setFilter} />}
      />
      <DataTable columns={columns} rows={filtered} loading={loading} error={error} emptyText="조건에 맞는 문의가 없습니다." emptyDescription="필터를 바꾸거나 새 문의가 들어오면 이 목록에서 바로 확인할 수 있습니다." />
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
};
