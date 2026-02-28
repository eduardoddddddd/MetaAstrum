import React from 'react';
import { FirdariaPeriod, ChartData } from '../types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  periods: FirdariaPeriod[];
  natalData: ChartData;
}

export default function Firdaria({ periods, natalData }: Props) {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 mb-4">Firdaria Persa</h2>
        <p className="text-stone-500 font-sans text-sm tracking-wide uppercase">Técnica de Señores del Tiempo</p>
      </header>

      <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 mb-12">
        <h3 className="font-serif text-2xl mb-6 text-stone-800">Período Actual</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-2">Planeta Regente Mayor</div>
            <div className="font-serif text-4xl text-stone-900 mb-4">{periods[1].planet}</div>
            <div className="text-sm text-stone-500 font-mono">
              {format(parseISO(periods[1].startDate), "d 'de' MMMM, yyyy", { locale: es })} —
              {format(parseISO(periods[1].endDate), "d 'de' MMMM, yyyy", { locale: es })}
            </div>
          </div>
          <div className="flex-1 border-t md:border-t-0 md:border-l border-stone-200 pt-6 md:pt-0 md:pl-8">
            <p className="text-stone-600 text-sm leading-relaxed">
              Durante este período mayor de {periods[1].planet}, los temas de la casa que rige en la carta natal
              y la casa donde se encuentra situado tomarán precedencia. Este es un tiempo de desarrollo
              relacionado con la naturaleza esencial de este planeta.
            </p>
          </div>
        </div>
      </div>

      <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Cronología de Firdaria</h3>
      <div className="relative border-l border-stone-200 ml-4 md:ml-8 space-y-12 py-8">
        {periods.map((p, i) => {
          const natalPlanet = natalData.planets.find(np => np.planet === p.planet);
          const houseText = natalPlanet ? `la casa ${natalPlanet.house}` : 'su posición natal';
          return (
            <div key={i} className="relative pl-8 md:pl-12">
              <div className={`
                absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 border-2 border-white
                ${i === 1 ? 'bg-stone-800' : 'bg-stone-300'}
              `} />
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-2">
                <span className={`font-serif text-2xl ${i === 1 ? 'text-stone-900' : 'text-stone-600'}`}>
                  {p.planet}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  {format(parseISO(p.startDate), 'yyyy')} — {format(parseISO(p.endDate), 'yyyy')}
                </span>
              </div>
              <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
                Fase regida por {p.planet}, activando los temas de {houseText} natal.
                Las promesas natales de este planeta se manifiestan principalmente durante estos años.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
