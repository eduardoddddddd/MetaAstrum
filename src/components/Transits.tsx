import React, { useMemo } from 'react';
import { ChartData } from '../types';
import { getPlanetLongitude, getAspect } from '../utils/astroUtils';
import { Calendar, Clock, RotateCcw } from 'lucide-react';

interface Props {
  natalData: ChartData;
  transitData: ChartData;
  transitDate: string;
  transitTime: string;
  setTransitDate: (d: string) => void;
  setTransitTime: (t: string) => void;
}

export default function Transits({ natalData, transitData, transitDate, transitTime, setTransitDate, setTransitTime }: Props) {
  const significantTransits = useMemo(() => {
    const results: Array<{ transitPlanet: string; natalPlanet: string; aspectType: string; orb: number }> = [];
    for (const tp of transitData.planets) {
      for (const np of natalData.planets) {
        const asp = getAspect(getPlanetLongitude(tp), getPlanetLongitude(np));
        if (asp) {
          results.push({ transitPlanet: tp.planet, natalPlanet: np.planet, aspectType: asp.type, orb: asp.orb });
        }
      }
    }
    return results.sort((a, b) => a.orb - b.orb).slice(0, 5);
  }, [transitData, natalData]);

  const saturnHouse = transitData.planets.find(p => p.planet === 'Saturn')?.house ?? '?';
  const plutoHouse = transitData.planets.find(p => p.planet === 'Pluto')?.house ?? '?';

  const resetToNow = () => {
    const now = new Date();
    setTransitDate(now.toISOString().slice(0, 10));
    setTransitTime(now.toTimeString().slice(0, 5));
  };

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-8 border-b border-stone-200 pb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 mb-4">Tránsitos</h2>
        <p className="text-stone-500 font-sans text-sm tracking-wide uppercase mb-6">Cielo de la Fecha Seleccionada vs Carta Natal</p>

        {/* Selector de fecha de tránsito */}
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Calendar size={12} /> Fecha de Tránsito
            </label>
            <input
              type="date"
              value={transitDate}
              onChange={(e) => setTransitDate(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded bg-stone-50 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Clock size={12} /> Hora
            </label>
            <input
              type="time"
              value={transitTime}
              onChange={(e) => setTransitTime(e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded bg-stone-50 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
          <button
            onClick={resetToNow}
            className="px-3 py-2 text-xs text-stone-500 border border-stone-200 rounded bg-stone-50 hover:bg-stone-100 transition-colors flex items-center gap-2"
            title="Volver al momento actual"
          >
            <RotateCcw size={12} />
            Ahora
          </button>
        </div>
      </header>

      <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 mb-12">
        <h3 className="font-serif text-2xl mb-6 text-stone-800">Tránsitos Significativos</h3>
        <div className="space-y-4">
          {significantTransits.length > 0 ? significantTransits.map((t, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-stone-100">
              <div className="flex items-center gap-4 mb-2 md:mb-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-stone-800">{t.transitPlanet} t.</span>
                  <span className="text-xs text-stone-400 uppercase tracking-wider">{t.aspectType}</span>
                  <span className="text-sm font-medium text-stone-600">{t.natalPlanet} n.</span>
                </div>
              </div>
              <div className="text-xs font-mono text-stone-500 bg-stone-50 px-3 py-1 rounded-full">
                Orbe: {t.orb}°
              </div>
            </div>
          )) : (
            <p className="text-stone-500 text-sm italic">No se encontraron tránsitos exactos en esta fecha.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Planetas Lentos</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            Los tránsitos de los planetas lentos (Júpiter a Plutón) marcan períodos de desarrollo prolongado.
            En la fecha seleccionada, Saturno transita por la casa {saturnHouse} y Plutón por la casa {plutoHouse}.
          </p>
          <ul className="space-y-3">
            {transitData.planets.filter(p => ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(p.planet)).map((p, i) => (
              <li key={i} className="flex justify-between items-center py-2 border-b border-stone-50">
                <span className="text-sm font-medium text-stone-800">{p.planet}</span>
                <span className="text-sm text-stone-600">{p.sign} {p.degree}°</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Planetas Rápidos</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            Los planetas rápidos actúan como detonadores de las configuraciones mayores.
            El Sol transitando por {transitData.planets.find(p => p.planet === 'Sun')?.sign} ilumina los temas de la casa
            {transitData.planets.find(p => p.planet === 'Sun')?.house} en esta fecha.
          </p>
          <ul className="space-y-3">
            {transitData.planets.filter(p => ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(p.planet)).map((p, i) => (
              <li key={i} className="flex justify-between items-center py-2 border-b border-stone-50">
                <span className="text-sm font-medium text-stone-800">{p.planet}</span>
                <span className="text-sm text-stone-600">{p.sign} {p.degree}°</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
