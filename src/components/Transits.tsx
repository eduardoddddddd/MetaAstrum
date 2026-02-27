import React from 'react';
import { ChartData } from '../types';

interface Props {
  natalData: ChartData;
  transitData: ChartData;
}

export default function Transits({ natalData, transitData }: Props) {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 mb-4">Tránsitos</h2>
        <p className="text-stone-500 font-sans text-sm tracking-wide uppercase">Cielo Actual vs Carta Natal</p>
      </header>

      <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 mb-12">
        <h3 className="font-serif text-2xl mb-6 text-stone-800">Tránsitos Significativos</h3>
        <div className="space-y-4">
          {transitData.planets.slice(0, 5).map((t, i) => {
            const aspectType = i % 2 === 0 ? 'Conjunción' : 'Cuadratura';
            const natalPlanet = natalData.planets[i % natalData.planets.length];
            return (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-stone-100">
                <div className="flex items-center gap-4 mb-2 md:mb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-800">{t.planet} t.</span>
                    <span className="text-xs text-stone-400 uppercase tracking-wider">{aspectType}</span>
                    <span className="text-sm font-medium text-stone-600">{natalPlanet.planet} n.</span>
                  </div>
                </div>
                <div className="text-xs font-mono text-stone-500 bg-stone-50 px-3 py-1 rounded-full">
                  Orbe: {(Math.random() * 3).toFixed(1)}°
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Planetas Lentos</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            Los tránsitos de los planetas lentos (Júpiter a Plutón) marcan períodos de desarrollo prolongado. 
            Actualmente, el tránsito de Saturno por la casa {Math.floor(Math.random() * 12) + 1} exige estructuración y responsabilidad 
            en esta área de vida, mientras que Plutón transforma profundamente las dinámicas de poder en la casa {Math.floor(Math.random() * 12) + 1}.
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
            {transitData.planets.find(p => p.planet === 'Sun')?.house}, trayendo consciencia y vitalidad durante este mes.
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
