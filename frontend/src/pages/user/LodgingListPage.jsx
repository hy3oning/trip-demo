import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import LodgingCard from '../../components/lodging/LodgingCard';
import SearchBar from '../../components/lodging/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import { getLodgings } from '../../api/lodging';
import { C, MAX_WIDTH } from '../../styles/tokens';

const SORT_OPTIONS = [
  { value: 'default', label: '추천순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'rating', label: '평점 높은순' },
];

const REGION_ALIASES = {
  서울: ['서울', '서울특별시'],
  경기: ['경기', '경기도'],
  인천: ['인천', '인천광역시'],
  부산: ['부산', '부산광역시'],
  대구: ['대구', '대구광역시'],
  대전: ['대전', '대전광역시'],
  광주: ['광주', '광주광역시'],
  울산: ['울산', '울산광역시'],
  제주: ['제주', '제주도', '제주특별자치도'],
};

function normalizeRegionText(value) {
  return String(value || '').replace(/\s+/g, '').toLowerCase();
}

function isRegionMatch(lodgingRegion, selectedRegion) {
  if (!selectedRegion) return true;
  const lodging = normalizeRegionText(lodgingRegion);
  const aliasTargets = REGION_ALIASES[selectedRegion] || [selectedRegion];
  const aliasNormalized = aliasTargets.map(normalizeRegionText);
  return aliasNormalized.some((alias) => lodging === alias || lodging.includes(alias) || alias.includes(lodging));
}

function isKeywordMatch(lodging, keyword) {
  const term = normalizeRegionText(keyword);
  if (!term) return true;
  const haystack = [lodging.name, lodging.region, lodging.address, lodging.description]
    .map(normalizeRegionText)
    .join(' ');
  return haystack.includes(term);
}

function sortLodgings(list, sort) {
  const copy = [...list];
  if (sort === 'price_asc') return copy.sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (sort === 'price_desc') return copy.sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (sort === 'rating') return copy.sort((a, b) => b.rating - a.rating);
  return copy;
}

function hasValidCoordinate(lodging) {
  return Number.isFinite(Number(lodging.latitude)) && Number.isFinite(Number(lodging.longitude));
}

function buildPriceMarkerIcon(pricePerNight, active) {
  const amount = Number(pricePerNight || 0).toLocaleString();
  return L.divIcon({
    className: 'tz-price-marker-shell',
    html: `<div class="tz-price-marker${active ? ' is-active' : ''}">₩${amount}</div>`,
    iconSize: [96, 34],
    iconAnchor: [48, 17],
  });
}

function MapBoundsWatcher({ onBoundsChange }) {
  const map = useMapEvents({
    moveend() {
      onBoundsChange(map.getBounds());
    },
    zoomend() {
      onBoundsChange(map.getBounds());
    },
  });

  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}

export default function LodgingListPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const keyword = params.get('keyword') || '';
  const region = params.get('region') || '';
  const checkIn = params.get('checkIn') || '';
  const checkOut = params.get('checkOut') || '';
  const guests = params.get('guests') || 2;

  const [sort, setSort] = useState('default');
  const [lodgings, setLodgings] = useState([]);
  const [mapBoundsDraft, setMapBoundsDraft] = useState(null);
  const [appliedBounds, setAppliedBounds] = useState(null);
  const [draftBoundsKey, setDraftBoundsKey] = useState('');
  const [appliedBoundsKey, setAppliedBoundsKey] = useState('');
  const [mapInstance, setMapInstance] = useState(null);
  const [activeLodgingId, setActiveLodgingId] = useState(null);

  useEffect(() => {
    getLodgings()
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        setLodgings(all.filter((lodging) => isRegionMatch(lodging.region, region) && isKeywordMatch(lodging, keyword)));
      })
      .catch(() => setLodgings([]));
  }, [keyword, region]);

  const sorted = useMemo(() => sortLodgings(lodgings, sort), [lodgings, sort]);

  const mapPoints = useMemo(
    () => sorted.filter(hasValidCoordinate).map((lodging) => [Number(lodging.latitude), Number(lodging.longitude)]),
    [sorted]
  );

  const visibleLodgings = useMemo(() => {
    if (!appliedBounds) return sorted;
    return sorted.filter((lodging) => {
      if (!hasValidCoordinate(lodging)) return false;
      return appliedBounds.contains([Number(lodging.latitude), Number(lodging.longitude)]);
    });
  }, [sorted, appliedBounds]);

  const isBoundsDirty = Boolean(appliedBoundsKey && draftBoundsKey && appliedBoundsKey !== draftBoundsKey);

  const onBoundsChange = useCallback((bounds) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const key = `${sw.lat.toFixed(4)},${sw.lng.toFixed(4)},${ne.lat.toFixed(4)},${ne.lng.toFixed(4)}`;
    setMapBoundsDraft(bounds);
    setDraftBoundsKey(key);
    if (!appliedBounds) {
      setAppliedBounds(bounds);
      setAppliedBoundsKey(key);
    }
  }, [appliedBounds]);

  useEffect(() => {
    if (!mapInstance) return;
    if (mapPoints.length > 1) {
      mapInstance.fitBounds(mapPoints, { padding: [40, 40] });
    } else if (mapPoints.length === 1) {
      mapInstance.setView(mapPoints[0], 12);
    }
  }, [mapInstance, mapPoints, region]);

  useEffect(() => {
    if (!mapInstance || !activeLodgingId) return;
    const target = sorted.find((lodging) => lodging.lodgingId === activeLodgingId && hasValidCoordinate(lodging));
    if (target) {
      mapInstance.panTo([Number(target.latitude), Number(target.longitude)], { animate: true, duration: 0.35 });
    }
  }, [activeLodgingId, mapInstance, sorted]);

  const initialCenter = [36.4, 127.8];

  const handleRecenter = () => {
    if (!mapInstance || !mapPoints.length) return;
    if (mapPoints.length > 1) {
      mapInstance.fitBounds(mapPoints, { padding: [40, 40] });
    } else {
      mapInstance.setView(mapPoints[0], 12);
    }
  };

  const handleSearchInMap = () => {
    if (!mapBoundsDraft || !draftBoundsKey) return;
    setAppliedBounds(mapBoundsDraft);
    setAppliedBoundsKey(draftBoundsKey);
  };

  return (
    <div>
      <style>{`
        .tz-price-marker-shell {
          background: transparent;
          border: none;
        }
        .tz-price-marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 70px;
          height: 30px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid #D8D8D8;
          background: #ffffff;
          color: #272727;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 3px 10px rgba(0,0,0,0.14);
          white-space: nowrap;
        }
        .tz-price-marker.is-active {
          background: #1f1f1f;
          color: #fff;
          border-color: #1f1f1f;
        }
        @media (max-width: 1180px) {
          .tz-lodging-split {
            display: block !important;
          }
          .tz-lodging-map-pane {
            position: static !important;
            height: 420px !important;
            margin-top: 18px;
          }
        }
      `}</style>
      <div style={s.searchSticky}>
        <div style={s.searchInner}>
          <SearchBar
            key={[keyword, region, checkIn, checkOut, Number(guests)].join('|')}
            defaultKeyword={keyword}
            defaultRegion={region}
            defaultCheckIn={checkIn}
            defaultCheckOut={checkOut}
            defaultGuests={Number(guests)}
          />
        </div>
      </div>

      <div style={s.splitWrap} className="tz-lodging-split">
        <section style={s.listPane}>
          <div style={s.filterBar}>
            <p style={s.resultCount}>
              {keyword ? `'${keyword}' 검색 결과` : region ? `'${region}' 검색 결과` : '지도에 표시된 숙소'}
              <span style={s.count}> {visibleLodgings.length}개</span>
            </p>
            <div style={s.sortGroup}>
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSort(option.value)}
                  style={{
                    ...s.sortBtn,
                    background: sort === option.value ? '#1F2530' : '#FFFFFF',
                    color: sort === option.value ? '#fff' : '#5D6778',
                    borderColor: sort === option.value ? '#1F2530' : '#E3E6EC',
                    boxShadow: sort === option.value ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {visibleLodgings.length === 0 ? (
            <EmptyState icon="🗺️" title="지도 영역에 숙소가 없습니다" desc="지도를 이동하거나 축소해서 다른 지역을 찾아보세요." />
          ) : (
            <div style={s.grid}>
              {visibleLodgings.map((lodging) => (
                <div
                  key={lodging.lodgingId}
                  style={{
                    ...s.cardWrap,
                    borderColor: activeLodgingId === lodging.lodgingId ? '#E8484A' : 'transparent',
                    boxShadow: activeLodgingId === lodging.lodgingId
                      ? '0 0 0 2px rgba(232,72,74,0.12)'
                      : 'none',
                  }}
                  onMouseEnter={() => setActiveLodgingId(lodging.lodgingId)}
                >
                  <LodgingCard lodging={lodging} />
                </div>
              ))}
            </div>
          )}
        </section>

        <aside style={s.mapPane} className="tz-lodging-map-pane">
          <div style={s.mapFrame}>
            <MapContainer
              center={initialCenter}
              zoom={7}
              scrollWheelZoom
              zoomControl={false}
              style={s.map}
              whenReady={(event) => setMapInstance(event.target)}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
              />
              <TileLayer
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
              />

              <MapBoundsWatcher onBoundsChange={onBoundsChange} />

              {sorted.filter(hasValidCoordinate).map((lodging) => (
                <Marker
                  key={`marker-${lodging.lodgingId}`}
                  position={[Number(lodging.latitude), Number(lodging.longitude)]}
                  icon={buildPriceMarkerIcon(lodging.pricePerNight, activeLodgingId === lodging.lodgingId)}
                  zIndexOffset={activeLodgingId === lodging.lodgingId ? 200 : 0}
                  eventHandlers={{
                    click: () => setActiveLodgingId(lodging.lodgingId),
                    mouseover: () => setActiveLodgingId(lodging.lodgingId),
                  }}
                >
                  <Popup>
                    <div style={s.popupWrap}>
                      <strong>{lodging.name}</strong>
                      <div style={s.popupMeta}>{lodging.region} · ₩{Number(lodging.pricePerNight).toLocaleString()}</div>
                      <button style={s.popupBtn} onClick={() => navigate(`/lodgings/${lodging.lodgingId}`)}>상세 보기</button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <div style={s.mapOverlayTop}>지도로 표시된 지역의 숙소</div>
            {isBoundsDirty && (
              <button style={s.mapSearchBtn} onClick={handleSearchInMap}>현재 지도에서 검색</button>
            )}
            <div style={s.mapControls}>
              <button style={s.mapCtrlBtn} onClick={() => mapInstance?.zoomIn()} aria-label="지도 확대">+</button>
              <button style={s.mapCtrlBtn} onClick={() => mapInstance?.zoomOut()} aria-label="지도 축소">−</button>
              <button style={s.mapCtrlBtn} onClick={handleRecenter} aria-label="지도 재중앙">⌖</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const s = {
  searchSticky: {
    position: 'sticky',
    top: '74px',
    zIndex: 50,
    background: C.bg,
    borderBottom: `1px solid ${C.borderLight}`,
    padding: '12px 24px',
  },
  searchInner: { maxWidth: MAX_WIDTH, margin: '0 auto', display: 'flex', justifyContent: 'center' },
  splitWrap: {
    maxWidth: 'min(1720px, calc(100vw - 36px))',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 42%',
    gap: '18px',
    padding: '24px 18px 40px',
  },
  listPane: {
    minWidth: 0,
  },
  mapPane: {
    position: 'sticky',
    top: '148px',
    alignSelf: 'start',
    height: 'calc(100vh - 164px)',
  },
  mapFrame: {
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    border: `1px solid ${C.borderLight}`,
    boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
    height: '100%',
  },
  mapOverlayTop: {
    position: 'absolute',
    left: '16px',
    top: '16px',
    zIndex: 500,
    borderRadius: '999px',
    border: '1px solid #E5E7EB',
    background: '#FFFFFFE8',
    backdropFilter: 'blur(2px)',
    fontSize: '12px',
    color: '#374151',
    fontWeight: 700,
    padding: '8px 12px',
  },
  mapSearchBtn: {
    position: 'absolute',
    left: '50%',
    top: '16px',
    transform: 'translateX(-50%)',
    zIndex: 520,
    border: 'none',
    borderRadius: '999px',
    background: '#111827',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    padding: '9px 14px',
    boxShadow: '0 8px 18px rgba(0,0,0,0.24)',
    cursor: 'pointer',
  },
  mapControls: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mapCtrlBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    background: '#FFFFFFEE',
    color: '#111827',
    fontSize: '20px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
  },
  map: { width: '100%', height: '100%' },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  resultCount: { fontSize: '22px', fontWeight: '700', color: C.text, margin: 0 },
  count: { fontSize: '16px', fontWeight: '400', color: C.textSub },
  sortGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  sortBtn: {
    padding: '8px 18px',
    border: '1px solid',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(248px, 1fr))',
    gap: '18px',
  },
  cardWrap: {
    borderRadius: '14px',
    border: '2px solid transparent',
    transition: 'border-color .18s ease, box-shadow .18s ease',
  },
  popupWrap: { minWidth: '160px' },
  popupMeta: { marginTop: '4px', color: '#6b7280', fontSize: '12px' },
  popupBtn: {
    marginTop: '8px',
    border: 'none',
    borderRadius: '8px',
    background: '#111827',
    color: '#fff',
    padding: '6px 10px',
    fontSize: '12px',
    cursor: 'pointer',
  },
};
