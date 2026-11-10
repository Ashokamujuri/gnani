// ============================================
// Regional Hotspot Map – /officer/hotspot-map
// Interactive Leaflet map with report markers,
// hotspot detection, filters, and trend panel.
// ============================================
import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, X, Filter, TrendingUp, TrendingDown, Minus,
  AlertTriangle, Leaf, Bug, Calendar, User, Shield, Eye,
  Layers, Satellite,
} from 'lucide-react';
import { RiskBadge, Button } from '../../components/ui';
import {
  getGeoReports, getGeoReportCrops, getGeoReportDiseases,
  detectHotspots, countNearby, getMapTrendSummary,
} from '../../data/geoService';
import type { GeoReport, Hotspot, MapFilters } from '../../data/geoService';
import type { RiskLevel, VerificationStatus } from '../../types';
import './HotspotMapPage.css';

// ---------- Constants ----------
const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#16a34a',
  moderate: '#eab308',
  high: '#f97316',
  critical: '#dc2626',
};

const RISK_RADIUS: Record<RiskLevel, number> = {
  low: 5,
  moderate: 7,
  high: 9,
  critical: 11,
};

const CENTER: [number, number] = [30.35, 75.85]; // Punjab center

// ---------- Auto-fit map to markers ----------
function FitBounds({ reports }: { reports: GeoReport[] }) {
  const map = useMap();
  useEffect(() => {
    if (reports.length > 0) {
      const bounds = reports.map(r => [r.latitude, r.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [reports, map]);
  return null;
}

// =============================================
// MAIN COMPONENT
// =============================================
export function HotspotMapPage() {
  const [reports, setReports] = useState<GeoReport[]>([]);
  const [allReports, setAllReports] = useState<GeoReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [fCrop, setFCrop] = useState('');
  const [fDisease, setFDisease] = useState('');
  const [fRisk, setFRisk] = useState<RiskLevel | ''>('');
  const [fVerification, setFVerification] = useState<VerificationStatus | ''>('');

  // Expanded hotspot
  const [expandedHotspot, setExpandedHotspot] = useState<Hotspot | null>(null);
  // Map layer mode: satellite vs standard
  const [mapMode, setMapMode] = useState<'satellite' | 'standard'>('satellite');

  const crops = getGeoReportCrops();
  const diseases = getGeoReportDiseases();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const r = await getGeoReports();
    setAllReports(r);
    setReports(r);
    setLoading(false);
  };

  const applyFilters = async () => {
    const filters: MapFilters = {};
    if (fCrop) filters.crop = fCrop;
    if (fDisease) filters.disease = fDisease;
    if (fRisk) filters.risk = fRisk;
    if (fVerification) filters.verification = fVerification;
    const filtered = await getGeoReports(filters);
    setReports(filtered);
  };

  const clearFilters = () => {
    setFCrop(''); setFDisease(''); setFRisk(''); setFVerification('');
    getGeoReports().then(setReports);
  };

  useEffect(() => {
    if (!loading) applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fCrop, fDisease, fRisk, fVerification]);

  // Hotspot detection
  const hotspots = useMemo(() => detectHotspots(reports), [reports]);
  const trendSummary = useMemo(() => getMapTrendSummary(reports), [reports]);
  const hasActiveFilters = fCrop || fDisease || fRisk || fVerification;

  return (
    <div className="hotspot-page">
      {/* Header */}
      <div className="hotspot-page__header">
        <div>
          <h1><MapPin size={22} /> Regional Hotspot Map</h1>
          <p className="hotspot-page__subtitle">Interactive disease surveillance map · {reports.length} reports plotted</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setMapMode('satellite')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: mapMode === 'satellite' ? '2px solid var(--color-primary-600)' : '1px solid var(--color-gray-300)',
              backgroundColor: mapMode === 'satellite' ? 'var(--color-primary-50)' : 'var(--color-white)',
              color: mapMode === 'satellite' ? 'var(--color-primary-800)' : 'var(--color-gray-700)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Satellite size={14} />
            <span>Satellite View</span>
          </button>
          <button
            onClick={() => setMapMode('standard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: mapMode === 'standard' ? '2px solid var(--color-primary-600)' : '1px solid var(--color-gray-300)',
              backgroundColor: mapMode === 'standard' ? 'var(--color-primary-50)' : 'var(--color-white)',
              color: mapMode === 'standard' ? 'var(--color-primary-800)' : 'var(--color-gray-700)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Layers size={14} />
            <span>Standard View</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="hotspot-filters">
        <Filter size={14} style={{ color: 'var(--color-gray-400)' }} />
        <select value={fCrop} onChange={e => setFCrop(e.target.value)}>
          <option value="">All Crops</option>
          {crops.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={fDisease} onChange={e => setFDisease(e.target.value)}>
          <option value="">All Diseases</option>
          {diseases.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={fRisk} onChange={e => setFRisk(e.target.value as RiskLevel | '')}>
          <option value="">All Risk</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select value={fVerification} onChange={e => setFVerification(e.target.value as VerificationStatus | '')}>
          <option value="">All Verification</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="corrected">Corrected</option>
        </select>
        {hasActiveFilters && (
          <button className="hotspot-filters__clear" onClick={clearFilters}>Clear All</button>
        )}
      </div>

      {/* Map + Sidebar */}
      <div className="hotspot-map-container">
        {/* Map */}
        <div className="hotspot-map-wrap">
          {!loading && (
            <MapContainer
              center={CENTER}
              zoom={8}
              scrollWheelZoom={true}
              style={{ height: '520px', width: '100%' }}
            >
              {mapMode === 'satellite' ? (
                <>
                  {/* High-Resolution Satellite Imagery from Esri World Imagery */}
                  <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                  {/* Administrative boundaries & road overlay for satellite clarity */}
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                    maxZoom={19}
                  />
                </>
              ) : (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              )}
              <FitBounds reports={reports} />

              {/* Hotspot circles */}
              {hotspots.map(hs => (
                <Circle
                  key={hs.id}
                  center={[hs.centerLat, hs.centerLng]}
                  radius={hs.radiusKm * 1000}
                  pathOptions={{
                    color: RISK_COLORS[hs.riskLevel],
                    fillColor: RISK_COLORS[hs.riskLevel],
                    fillOpacity: 0.1,
                    weight: 2,
                    dashArray: '6 4',
                  }}
                />
              ))}

              {/* Report markers */}
              {reports.map(r => (
                <CircleMarker
                  key={r.id}
                  center={[r.latitude, r.longitude]}
                  radius={RISK_RADIUS[r.riskLevel]}
                  pathOptions={{
                    color: '#fff',
                    weight: 2,
                    fillColor: RISK_COLORS[r.riskLevel],
                    fillOpacity: 0.85,
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <div className="map-popup__title">{r.village}</div>
                      <div className="map-popup__row"><Leaf size={11} /> <strong>{r.crop}</strong></div>
                      <div className="map-popup__row"><Bug size={11} /> {r.disease}</div>
                      <div className="map-popup__row">
                        <Shield size={11} />
                        <span className={`map-popup__badge map-popup__badge--${r.riskLevel}`}>{r.riskLevel}</span>
                      </div>
                      <div className="map-popup__row"><Calendar size={11} /> {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      <div className="map-popup__row"><Eye size={11} /> Verification: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{r.verification}</span></div>
                      <div className="map-popup__row"><User size={11} /> {r.farmerName}</div>
                      <div className="map-popup__row" style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--color-gray-200)' }}>
                        <MapPin size={11} /> <strong>{countNearby(r, allReports)} nearby reports</strong> within 10 km
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}

          {/* Legend */}
          <div className="map-legend">
            <div className="map-legend__title">Map Legend</div>
            <div className="map-legend__items">
              <div className="map-legend__item"><span className="map-legend__dot map-legend__dot--low" /> Low Risk</div>
              <div className="map-legend__item"><span className="map-legend__dot map-legend__dot--moderate" /> Moderate Risk</div>
              <div className="map-legend__item"><span className="map-legend__dot map-legend__dot--high" /> High Risk</div>
              <div className="map-legend__item"><span className="map-legend__dot map-legend__dot--critical" /> Critical Risk</div>
              <div className="map-legend__item"><span className="map-legend__dot map-legend__dot--hotspot" /> Hotspot Zone</div>
            </div>
          </div>

          {/* Report count */}
          <div className="map-report-count">
            📍 {reports.length} reports · {hotspots.length} hotspot{hotspots.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hotspot-sidebar">
          {/* Trend Panel */}
          <div className="trend-panel">
            <div className="trend-panel__title">Report Trend</div>
            <div className="trend-panel__items">
              <div className="trend-panel__item trend-panel__item--increasing">
                <div className="trend-panel__val">{trendSummary.increasing}</div>
                <div className="trend-panel__label">📈 Recent</div>
              </div>
              <div className="trend-panel__item trend-panel__item--stable">
                <div className="trend-panel__val">{trendSummary.stable}</div>
                <div className="trend-panel__label">➡️ Mid-term</div>
              </div>
              <div className="trend-panel__item trend-panel__item--decreasing">
                <div className="trend-panel__val">{trendSummary.decreasing}</div>
                <div className="trend-panel__label">📉 Older</div>
              </div>
            </div>
          </div>

          {/* Hotspot Cards */}
          {hotspots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-gray-400)', fontSize: 'var(--text-sm)' }}>
              No hotspots detected with current filters.
            </div>
          ) : (
            hotspots.map(hs => (
              <div
                key={hs.id}
                className={`hotspot-card hotspot-card--${hs.riskLevel}`}
                onClick={() => setExpandedHotspot(hs)}
              >
                {(hs.riskLevel === 'critical' || hs.riskLevel === 'high') && (
                  <div className="hotspot-card__alert">
                    <AlertTriangle size={12} />
                    🚨 Emerging Crop-Disease Hotspot
                  </div>
                )}
                <div className="hotspot-card__body">
                  <div className="hotspot-card__location">
                    <RiskBadge level={hs.riskLevel} />
                    {hs.location}
                  </div>
                  <div className="hotspot-card__meta">
                    <div>Crop: <strong>{hs.dominantCrop}</strong></div>
                    <div>Disease: <strong>{hs.dominantDisease}</strong></div>
                    <div>Reports: <strong>{hs.reportCount}</strong></div>
                  </div>
                </div>
                <div className="hotspot-card__footer">
                  <span className={`hotspot-card__trend hotspot-card__trend--${hs.trend}`}>
                    {hs.trend === 'increasing' ? <><TrendingUp size={10} /> Increasing</> :
                     hs.trend === 'decreasing' ? <><TrendingDown size={10} /> Decreasing</> :
                     <><Minus size={10} /> Stable</>}
                  </span>
                  <Button variant="ghost" size="sm" style={{ fontSize: '11px' }}>
                    Inspect Reports →
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hotspot Reports Modal */}
      {expandedHotspot && (
        <HotspotReportsModal
          hotspot={expandedHotspot}
          onClose={() => setExpandedHotspot(null)}
        />
      )}
    </div>
  );
}

// =============================================
// HOTSPOT REPORTS MODAL
// =============================================
function HotspotReportsModal({ hotspot, onClose }: { hotspot: Hotspot; onClose: () => void }) {
  return (
    <div className="hotspot-reports-overlay" onClick={onClose}>
      <div className="hotspot-reports-modal" onClick={e => e.stopPropagation()}>
        <div className="hotspot-reports-modal__header">
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <RiskBadge level={hotspot.riskLevel} />
              {hotspot.location} — {hotspot.dominantDisease}
            </h3>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: 4 }}>
              {hotspot.reportCount} contributing reports · {hotspot.dominantCrop} dominant crop
            </div>
          </div>
          <button className="hotspot-reports-modal__close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="hotspot-reports-list">
          {hotspot.reports.map(r => (
            <div key={r.id} className="hotspot-report-item">
              <div className={`hotspot-report-item__dot hotspot-report-item__dot--${r.riskLevel}`} />
              <div className="hotspot-report-item__content">
                <div className="hotspot-report-item__title">
                  {r.village} — {r.disease}
                </div>
                <div className="hotspot-report-item__meta">
                  {r.crop} · {r.farmerName} · {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ·
                  <span style={{ textTransform: 'capitalize', fontWeight: 600, marginLeft: 4 }}>{r.verification}</span> ·
                  Confidence: {(r.confidence * 100).toFixed(0)}%
                </div>
              </div>
              <RiskBadge level={r.riskLevel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
