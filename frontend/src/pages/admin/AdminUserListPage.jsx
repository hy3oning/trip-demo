import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import ListPageHeader from '../../components/common/ListPageHeader';
import StatusBadge from '../../components/common/StatusBadge';

const MOCK_USERS = [
  { userId: 1, name: '홍길동', email: 'user1@test.com', role: 'USER', createdAt: '2026-01-10' },
  { userId: 2, name: '김철수', email: 'user2@test.com', role: 'USER', createdAt: '2026-01-15' },
  { userId: 3, name: '이영희', email: 'user3@test.com', role: 'USER', createdAt: '2026-02-01' },
];

export default function AdminUserListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    // TODO(back-end): 관리자 사용자 목록 API 응답으로 교체
    setRows(MOCK_USERS);
    setLoading(false);
  }, []);

  const columns = [
    { key: 'userId', label: 'ID', width: '90px' },
    { key: 'name', label: '이름' },
    { key: 'email', label: '이메일' },
    {
      key: 'role',
      label: '역할',
      width: '120px',
      render: (row) => <StatusBadge label={row.role} background="#EFF6FF" color="#2563EB" />,
    },
    { key: 'createdAt', label: '가입일', width: '120px' },
  ];

  return (
    <div style={styles.wrap}>
      <ListPageHeader title="사용자 목록" description={`총 ${rows.length}명의 사용자를 확인할 수 있습니다.`} />
      <DataTable columns={columns} rows={rows} loading={loading} error={error} emptyText="등록된 사용자가 없습니다." emptyDescription="회원 가입이 발생하면 이곳에서 역할과 가입일을 함께 확인할 수 있습니다." />
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
};
