import React from 'react';
import { ChartData } from '../types';
import { getPlanetLongitude, getNearestAspect } from '../utils/astroUtils';

interface Props {
  natalData: ChartData;
  directedData: ChartData;
}

export default function Directions({ natalData, directedData }: Props) {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 mb-4">Direcciones Primarias</h2>
        <p className="text-stone-500 font-sans text-sm tracking-wide uppercase">Movimiento Ecuatorial</p>
      </header>

      <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 mb-12">
        <h3 className="font-serif text-2xl mb-6 text-stone-800">Técnica Predictiva Clásica</h3>
        <p className="text-stone-600 text-sm leading-relaxed mb-6">
          Las direcciones primarias son la técnica predictiva más antigua y respetada de la astrología clásica. 
          Se basan en el movimiento aparente de la esfera celeste (rotación de la Tierra) en las horas posteriores al nacimiento, 
          donde 1 grado de ascensión recta equivale a 1 año de vida.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm">
            <h4 className="font-serif text-xl mb-4 text-stone-800 border-b border-stone-50 pb-2">Arco de Dirección</h4>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-serif text-stone-900">34.5°</span>
              <span className="text-sm font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded">
                Naibod
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              El arco dirigido actual, calculado con la clave de Ptolomeo/Naibod.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm">
            <h4 className="font-serif text-xl mb-4 text-stone-800 border-b border-stone-50 pb-2">Ascendente Dirigido</h4>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-serif text-stone-900">{directedData.ascendant.sign}</span>
              <span className="text-sm font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded">
                {directedData.ascendant.degree}°
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              El Ascendente dirigido indica cambios en la vitalidad, el cuerpo físico y la dirección general de la vida.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Contactos Actuales</h3>
          <div className="space-y-4">
            {directedData.planets.slice(0, 3).map((p, i) => {
              const natalPlanet = natalData.planets[(i + 4) % natalData.planets.length];
              const asp = getNearestAspect(getPlanetLongitude(p), getPlanetLongitude(natalPlanet));
              return (
                <div key={i} className="flex justify-between items-center p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-800">{p.planet} dir.</span>
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
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Interpretación</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 py-3 border-b border-stone-50">
              <div className="w-2 h-2 mt-2 rounded-full bg-stone-800 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-stone-800 mb-1">Eventos Mayores</h4>
                <p className="text-sm text-stone-600">
                  Las direcciones primarias marcan los eventos más significativos e inevitables del destino. 
                  Los contactos actuales sugieren un período de culminación en los temas de la casa donde ocurre el contacto.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 py-3 border-b border-stone-50">
              <div className="w-2 h-2 mt-2 rounded-full bg-stone-300 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-stone-800 mb-1">Activación por Tránsitos</h4>
                <p className="text-sm text-stone-600">
                  Estos contactos dirigidos establecen el potencial, pero requieren de tránsitos o progresiones 
                  concordantes para manifestarse como eventos concretos en el tiempo.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
