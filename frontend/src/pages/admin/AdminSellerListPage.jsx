import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import ListPageHeader from '../../components/common/ListPageHeader';
import StatusBadge from '../../components/common/StatusBadge';

const MOCK_SELLERS = [
  { sellerId: 1, name: '김판매', email: 'seller1@test.com', businessName: '제주 숙소 운영', approvalStatus: 'APPROVED', createdAt: '2026-01-05' },
  { sellerId: 2, name: '박사장', email: 'seller2@test.com', businessName: '경남 리조트', approvalStatus: 'APPROVED', createdAt: '2026-02-10' },
  { sellerId: 3, name: '최신규', email: 'seller3@test.com', businessName: '강원 펜션', approvalStatus: 'PENDING', createdAt: '2026-03-01' },
];

const STATUS_COLOR = { APPROVED: '#dcfce7', PENDING: '#fef9c3', REJECTED: '#fee2e2' };
const STATUS_LABEL = { APPROVED: '승인', PENDING: '대기', REJECTED: '거절' };

export default function AdminSellerListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    // TODO(back-end): 관리자 판매자 목록 API 응답으로 교체
    setRows(MOCK_SELLERS);
    setLoading(false);
  }, []);

  const columns = [
    { key: 'sellerId', label: 'ID', width: '90px' },
    { key: 'name', label: '이름' },
    { key: 'email', label: '이메일' },
    { key: 'businessName', label: '사업체명' },
    {
      key: 'approvalStatus',
      label: '상태',
      width: '110px',
      render: (row) => (
        <StatusBadge
          label={STATUS_LABEL[row.approvalStatus]}
          background={STATUS_COLOR[row.approvalStatus]}
          color={row.approvalStatus === 'APPROVED' ? '#166534' : row.approvalStatus === 'PENDING' ? '#854D0E' : '#B91C1C'}
        />
      ),
    },
    { key: 'createdAt', label: '가입일', width: '120px' },
  ];

  return (
    <div style={styles.wrap}>
      <ListPageHeader title="판매자 목록" description={`현재 ${rows.length}명의 판매자 신청/승인 상태를 관리 중입니다.`} />
      <DataTable columns={columns} rows={rows} loading={loading} error={error} emptyText="등록된 판매자가 없습니다." emptyDescription="판매자 신청이 들어오면 사업체명과 승인 상태를 여기서 검토할 수 있습니다." />
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
};
