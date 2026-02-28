import React from 'react';
import { ChartData } from '../types';
import { getPlanetLongitude, getNearestAspect } from '../utils/astroUtils';

interface Props {
  natalData: ChartData;
  progressionData: ChartData;
}

export default function Progressions({ natalData, progressionData }: Props) {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 mb-4">Progresiones Secundarias</h2>
        <p className="text-stone-500 font-sans text-sm tracking-wide uppercase">Un Día por un Año</p>
      </header>

      <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 mb-12">
        <h3 className="font-serif text-2xl mb-6 text-stone-800">Evolución Interna</h3>
        <p className="text-stone-600 text-sm leading-relaxed mb-6">
          Las progresiones secundarias reflejan el desarrollo psicológico y la maduración interna del individuo. 
          A diferencia de los tránsitos, que representan eventos externos, las progresiones muestran cómo 
          nuestra consciencia evoluciona con el tiempo.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm">
            <h4 className="font-serif text-xl mb-4 text-stone-800 border-b border-stone-50 pb-2">Sol Progresado</h4>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-serif text-stone-900">{progressionData.planets.find(p => p.planet === 'Sun')?.sign}</span>
              <span className="text-sm font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded">
                {progressionData.planets.find(p => p.planet === 'Sun')?.degree}°
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              El Sol progresado indica el enfoque principal de la vitalidad y la identidad en esta etapa de la vida.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm">
            <h4 className="font-serif text-xl mb-4 text-stone-800 border-b border-stone-50 pb-2">Luna Progresada</h4>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-serif text-stone-900">{progressionData.planets.find(p => p.planet === 'Moon')?.sign}</span>
              <span className="text-sm font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded">
                {progressionData.planets.find(p => p.planet === 'Moon')?.degree}°
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              La Luna progresada marca ciclos emocionales de 2.5 años, indicando las necesidades emocionales actuales.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Aspectos Progresados a Natales</h3>
          <div className="space-y-4">
            {progressionData.planets.slice(0, 4).map((p, i) => {
              const natalPlanet = natalData.planets[(i + 2) % natalData.planets.length];
              const asp = getNearestAspect(getPlanetLongitude(p), getPlanetLongitude(natalPlanet));
              return (
                <div key={i} className="flex justify-between items-center p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-800">{p.planet} p.</span>
                    <span className="text-xs text-stone-400 uppercase tracking-wider">{asp.type}</span>
                    <span className="text-sm font-medium text-stone-600">{natalPlanet.planet} n.</span>
                  </div>
                  <span className="text-xs font-mono text-stone-500">Orbe: {asp.orb}°</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Cambios de Signo y Dirección</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 py-3 border-b border-stone-50">
              <div className="w-2 h-2 mt-2 rounded-full bg-stone-300 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-stone-800 mb-1">Mercurio Progresado entra en {progressionData.planets.find(p => p.planet === 'Mercury')?.sign}</h4>
                <p className="text-sm text-stone-600">
                  Un cambio en la forma de pensar, comunicar y procesar la información. 
                  Nuevos intereses intelectuales.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 py-3 border-b border-stone-50">
              <div className="w-2 h-2 mt-2 rounded-full bg-stone-800 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-stone-800 mb-1">Venus Progresada se vuelve Directa</h4>
                <p className="text-sm text-stone-600">
                  Resolución de temas relacionales o de valores que habían estado en revisión interna.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
