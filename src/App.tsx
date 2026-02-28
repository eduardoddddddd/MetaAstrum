import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import NatalChart from './components/NatalChart';
import Transits from './components/Transits';
import Firdaria from './components/Firdaria';
import Profections from './components/Profections';
import Progressions from './components/Progressions';
import Directions from './components/Directions';
import Horary from './components/Horary';
import { getRealNatalChart, getFirdaria, getProfections, getProgressions } from './mockData';
import { getGlobalInterpretation } from './services/geminiService';
import { MapPin, Calendar, Clock, BookmarkPlus, Trash2 } from 'lucide-react';

interface SavedChart {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  lat: number;
  lon: number;
  savedAt: string;
}

const STORAGE_KEY = 'metaastrum_saved_charts';

export default function App() {
  const [activeTab, setActiveTab] = useState('natal');
  const [birthDate, setBirthDate] = useState('1990-05-15');
  const [birthTime, setBirthTime] = useState('12:00');
  const [lat, setLat] = useState(40.4168); // Madrid
  const [lon, setLon] = useState(-3.7038);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartName, setChartName] = useState('');
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  const fullBirthDate = useMemo(() => new Date(`${birthDate}T${birthTime}:00`), [birthDate, birthTime]);
  const now = useMemo(() => new Date(), []);

  const natalData = useMemo(() => getRealNatalChart(fullBirthDate, lat, lon), [fullBirthDate, lat, lon]);
  const transitData = useMemo(() => getRealNatalChart(now, lat, lon), [now, lat, lon]);
  const progressionData = useMemo(() => getProgressions(fullBirthDate, now, lat, lon), [fullBirthDate, now, lat, lon]);
  const directedData = useMemo(() => getRealNatalChart(new Date(fullBirthDate.getTime() + (now.getFullYear() - fullBirthDate.getFullYear()) * 24 * 60 * 60 * 1000), lat, lon), [fullBirthDate, now, lat, lon]);
  const horaryData = useMemo(() => getRealNatalChart(now, lat, lon), [now, lat, lon]);

  const firdariaPeriods = useMemo(() => getFirdaria(fullBirthDate, fullBirthDate.getHours() >= 6 && fullBirthDate.getHours() < 18), [fullBirthDate]);
  const profectionData = useMemo(() => getProfections(fullBirthDate, now, natalData.ascendant.sign), [fullBirthDate, now, natalData]);

  useEffect(() => {
    const fetchInterpretation = async () => {
      setLoading(true);
      const text = await getGlobalInterpretation(natalData, "Carta Natal");
      setInterpretation(text);
      setLoading(false);
    };
    fetchInterpretation();
  }, [natalData]);

  const saveChart = () => {
    const name = chartName.trim() || `Carta ${new Date(birthDate).toLocaleDateString('es-ES')}`;
    const newChart: SavedChart = {
      id: Date.now().toString(),
      name,
      birthDate,
      birthTime,
      lat,
      lon,
      savedAt: new Date().toISOString(),
    };
    const updated = [...savedCharts, newChart];
    setSavedCharts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setChartName('');
  };

  const loadChart = (chart: SavedChart) => {
    setBirthDate(chart.birthDate);
    setBirthTime(chart.birthTime);
    setLat(chart.lat);
    setLon(chart.lon);
  };

  const deleteChart = (id: string) => {
    const updated = savedCharts.filter(c => c.id !== id);
    setSavedCharts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'natal':
        return (
          <>
            <NatalChart data={natalData} />
            <div className="mt-12 p-8 bg-stone-50 rounded-xl border border-stone-200">
              <h3 className="font-serif text-2xl mb-4 text-stone-800">Interpretación de la Inteligencia Artificial</h3>
              {loading ? <div className="animate-pulse text-stone-400">Generando síntesis...</div> : <p className="text-stone-600 leading-relaxed italic">{interpretation}</p>}
            </div>
          </>
        );
      case 'transits':
        return <Transits natalData={natalData} transitData={transitData} />;
      case 'firdaria':
        return <Firdaria periods={firdariaPeriods} natalData={natalData} />;
      case 'profections':
        return <Profections data={profectionData} />;
      case 'progressions':
        return <Progressions natalData={natalData} progressionData={progressionData} />;
      case 'directions':
        return <Directions natalData={natalData} directedData={directedData} />;
      case 'horary':
        return <Horary horaryData={horaryData} />;
      default:
        return <NatalChart data={natalData} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="mb-12 p-6 bg-white border border-stone-200 rounded-xl shadow-sm">
        {/* Inputs de datos natales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Calendar size={12} /> Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 border border-stone-100 rounded bg-stone-50 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Clock size={12} /> Hora
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-3 py-2 border border-stone-100 rounded bg-stone-50 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <MapPin size={12} /> Latitud
            </label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-stone-100 rounded bg-stone-50 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <MapPin size={12} /> Longitud
            </label>
            <input
              type="number"
              value={lon}
              onChange={(e) => setLon(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-stone-100 rounded bg-stone-50 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
        </div>

        {/* Guardar carta */}
        <div className="mt-5 pt-5 border-t border-stone-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="Nombre de la carta (opcional)..."
            value={chartName}
            onChange={(e) => setChartName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveChart()}
            className="flex-1 px-3 py-2 border border-stone-100 rounded bg-stone-50 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
          />
          <button
            onClick={saveChart}
            className="px-4 py-2 bg-stone-900 text-white text-sm rounded hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 flex-shrink-0"
          >
            <BookmarkPlus size={14} />
            Guardar Carta
          </button>
        </div>

        {/* Cartas guardadas */}
        {savedCharts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Cartas Guardadas</p>
            <div className="flex flex-wrap gap-2">
              {savedCharts.map(chart => (
                <div
                  key={chart.id}
                  className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm group"
                >
                  <button
                    onClick={() => loadChart(chart)}
                    className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
                    title={`${chart.birthDate} ${chart.birthTime} · Lat ${chart.lat} Lon ${chart.lon}`}
                  >
                    {chart.name}
                  </button>
                  <span className="text-stone-300 text-xs">{chart.birthDate}</span>
                  <button
                    onClick={() => deleteChart(chart.id)}
                    className="text-stone-300 hover:text-red-400 transition-colors ml-1"
                    title="Eliminar carta"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {renderContent()}
    </Layout>
  );
}
