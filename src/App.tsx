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
import { MapPin, Calendar, Clock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('natal');
  const [birthDate, setBirthDate] = useState('1990-05-15');
  const [birthTime, setBirthTime] = useState('12:00');
  const [lat, setLat] = useState(40.4168); // Madrid
  const [lon, setLon] = useState(-3.7038);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      <div className="mb-12 p-6 bg-white border border-stone-200 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
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

      {renderContent()}
    </Layout>
  );
}
