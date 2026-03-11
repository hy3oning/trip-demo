// TODO(back-end): 레저/티켓 상품 목록/지역/카테고리 API가 준비되면 이 mock 데이터를 서버 응답으로 교체한다.
export const LEISURE_ITEMS = [
  {
    leisureId: 9601,
    title: '도쿄 팀랩 플래닛 입장권',
    region: '도쿄',
    category: '전시',
    priceFrom: 32000,
    instantUse: true,
    imageUrl: 'https://picsum.photos/seed/tripzone-leisure-teamlab/640/420',
  },
  {
    leisureId: 9602,
    title: '다낭 바나힐 왕복 셔틀+입장권',
    region: '다낭',
    category: '투어',
    priceFrom: 58000,
    instantUse: false,
    imageUrl: 'https://picsum.photos/seed/tripzone-leisure-banahill/640/420',
  },
  {
    leisureId: 9603,
    title: '오사카 유니버설 1일권',
    region: '오사카',
    category: '테마파크',
    priceFrom: 89000,
    instantUse: true,
    imageUrl: 'https://picsum.photos/seed/tripzone-leisure-usj/640/420',
  },
  {
    leisureId: 9604,
    title: '싱가포르 리버 크루즈',
    region: '싱가포르',
    category: '액티비티',
    priceFrom: 27000,
    instantUse: true,
    imageUrl: 'https://picsum.photos/seed/tripzone-leisure-cruise/640/420',
  },
];
