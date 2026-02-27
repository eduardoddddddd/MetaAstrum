import React from 'react';
import { ChartData } from '../types';

interface Props {
  data: ChartData;
}

export default function NatalChart({ data }: Props) {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 mb-4">Carta Natal</h2>
        <p className="text-stone-500 font-sans text-sm tracking-wide uppercase">Posiciones Planetarias y Casas</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Planets Table */}
        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Planetas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-stone-400 border-b border-stone-200">
                  <th className="py-3 font-medium">Cuerpo</th>
                  <th className="py-3 font-medium">Signo</th>
                  <th className="py-3 font-medium text-right">Grado</th>
                  <th className="py-3 font-medium text-center">Casa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.planets.map((p, i) => (
                  <tr key={i} className="group hover:bg-stone-50 transition-colors">
                    <td className="py-4 text-sm font-medium text-stone-800 flex items-center gap-2">
                      {p.planet}
                      {p.retrograde && <span className="text-[10px] text-stone-400 font-mono">Rx</span>}
                    </td>
                    <td className="py-4 text-sm text-stone-600">{p.sign}</td>
                    <td className="py-4 text-sm text-stone-600 text-right font-mono">
                      {p.degree}° {p.minute.toString().padStart(2, '0')}'
                    </td>
                    <td className="py-4 text-sm text-stone-600 text-center">{p.house}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Houses and Aspects */}
        <div className="space-y-12">
          <div>
            <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Cúspides de las Casas</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {data.houses.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-stone-50">
                  <span className="text-sm text-stone-500 w-16">Casa {h.house}</span>
                  <span className="text-sm font-medium text-stone-800">{h.sign}</span>
                  <span className="text-sm text-stone-600 font-mono">
                    {h.degree}° {h.minute.toString().padStart(2, '0')}'
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Aspectos Principales</h3>
            <div className="space-y-3">
              {data.aspects.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-md border border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-800">{a.planet1}</span>
                    <span className="text-xs text-stone-400 uppercase tracking-wider">{a.aspect}</span>
                    <span className="text-sm font-medium text-stone-800">{a.planet2}</span>
                  </div>
                  <span className="text-xs font-mono text-stone-500">Orbe: {a.orb}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Interpretation text */}
      <div className="mt-16 pt-12 border-t border-stone-200">
        <h3 className="font-serif text-2xl mb-6 text-stone-800">Síntesis Global</h3>
        <div className="prose prose-stone max-w-none">
          <p className="text-stone-600 leading-relaxed mb-4">
            El Ascendente en {data.ascendant.sign} a {data.ascendant.degree}° establece el tono principal de la encarnación, 
            marcando una aproximación a la vida caracterizada por las cualidades de este signo. 
            El regente del Ascendente se encuentra en la Casa {data.planets.find(p => p.planet === (data.ascendant.sign === 'Leo' ? 'Sun' : data.ascendant.sign === 'Cancer' ? 'Moon' : 'Mercury'))?.house || 1}, 
            dirigiendo la vitalidad y el propósito hacia esa área de experiencia.
          </p>
          <p className="text-stone-600 leading-relaxed">
            El Medio Cielo en {data.mc.sign} a {data.mc.degree}° indica la vocación y el destino público. 
            La configuración planetaria sugiere un fuerte énfasis en el desarrollo personal a través de las tensiones 
            marcadas por los aspectos mayores, requiriendo integración consciente de las energías en conflicto.
          </p>
        </div>
      </div>
    </div>
  );
}
