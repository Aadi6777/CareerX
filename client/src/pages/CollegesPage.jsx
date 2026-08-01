import React, { useEffect, useState } from 'react';
import { MapPin, DollarSign, Award, Building, ExternalLink, Filter, Navigation, Compass } from 'lucide-react';
import API from '../services/api';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Center default over South India (Bangalore & Tamil Nadu)
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946, label: 'Bengaluru / Tamil Nadu' });
  const [radiusKm, setRadiusKm] = useState(600);
  const [maxBudget, setMaxBudget] = useState(600000);
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

  useEffect(() => {
    async function fetchColleges() {
      setLoading(true);
      try {
        const res = await API.get(`/colleges/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radiusKm=${radiusKm}&budget=${maxBudget}&type=${typeFilter}`);
        let fetched = res.data.colleges || [];
        if (selectedRegion === 'Bangalore') {
          fetched = fetched.filter(c => c.state === 'Karnataka' || c.city === 'Bengaluru');
        } else if (selectedRegion === 'Tamil Nadu') {
          fetched = fetched.filter(c => c.state === 'Tamil Nadu');
        }
        setColleges(fetched);
      } catch (err) {
        console.error('Failed to fetch colleges:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchColleges();
  }, [userLocation, radiusKm, maxBudget, typeFilter, selectedRegion]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Interactive Leaflet Map — Bangalore & Tamil Nadu Institutes</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">College Geo-Discovery & Matching</h1>
          <p className="text-xs text-slate-400">
            Locate top matched colleges across Bengaluru, Chennai, Coimbatore, Vellore & Trichy by tuition budget & accreditation.
          </p>
        </div>

        {/* Region Filter Pills */}
        <div className="flex items-center gap-2">
          {['All', 'Bangalore', 'Tamil Nadu'].map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                selectedRegion === region
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Sliders */}
      <div className="glass-card p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Distance Radius:</span>
            <span className="text-blue-400">{radiusKm} km</span>
          </div>
          <input
            type="range"
            min="50"
            max="1500"
            step="50"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Max Tuition / Year:</span>
            <span className="text-emerald-400">₹{maxBudget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="800000"
            step="20000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">Institution Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer font-semibold"
          >
            <option value="All">All College Types</option>
            <option value="Government">Government Institutes</option>
            <option value="Private">Private Universities</option>
          </select>
        </div>

      </div>

      {/* Leaflet Map & List View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 glass-card p-2 h-[500px] rounded-2xl overflow-hidden relative">
          <MapContainer
            center={[12.5000, 78.5000]}
            zoom={7}
            scrollWheelZoom={false}
            className="w-full h-full rounded-xl z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {colleges.map((c) => (
              <Marker key={c.id} position={[c.latitude, c.longitude]}>
                <Popup>
                  <div className="p-1 space-y-1 text-slate-900">
                    <strong className="block text-xs font-bold text-slate-900">{c.name}</strong>
                    <span className="text-[11px] block text-slate-600">📍 {c.city}, {c.state}</span>
                    <span className="text-[11px] block font-semibold text-blue-700">₹{c.tuition_min.toLocaleString()} - ₹{c.tuition_max.toLocaleString()} / year</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            TN & Blr Colleges ({colleges.length})
          </h3>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Updating map pins...</div>
          ) : colleges.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 glass-card">
              No colleges match your filter. Try adjusting budget or radius.
            </div>
          ) : (
            colleges.map((c) => (
              <div key={c.id} className="glass-card p-4 space-y-2 hover:border-blue-500/40">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.name}</h4>
                    <span className="text-[10px] text-slate-400">📍 {c.city}, {c.state}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                    {c.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                  <span className="text-emerald-400 font-semibold">
                    ₹{c.tuition_min.toLocaleString()} - ₹{c.tuition_max.toLocaleString()} / yr
                  </span>
                  <span className="text-purple-300 font-semibold">{c.accreditation}</span>
                </div>

                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 font-semibold hover:underline pt-1"
                  >
                    College Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
