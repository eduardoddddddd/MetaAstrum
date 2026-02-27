import React from 'react';
import { ProfectionData } from '../types';

interface Props {
  data: ProfectionData;
}

export default function Profections({ data }: Props) {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 mb-4">Profecciones Anuales</h2>
        <p className="text-stone-500 font-sans text-sm tracking-wide uppercase">Técnica Helenística de Señores del Año</p>
      </header>

      <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-stone-200 pb-6 md:pb-0 md:pr-8">
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-2">Edad Actual</div>
            <div className="font-serif text-5xl text-stone-900">{data.age}</div>
            <div className="text-sm text-stone-500 mt-2 font-mono">Años</div>
          </div>
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-stone-200 pb-6 md:pb-0 md:pr-8">
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-2">Signo del Año</div>
            <div className="font-serif text-4xl text-stone-900">{data.yearSign}</div>
            <div className="text-sm text-stone-500 mt-2 font-mono">Casa {(data.age % 12) + 1}</div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-2">Señor del Año</div>
            <div className="font-serif text-4xl text-stone-900">{data.lordOfTheYear}</div>
            <div className="text-sm text-stone-500 mt-2 font-mono">Regente de {data.yearSign}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Interpretación del Año</h3>
          <div className="prose prose-stone max-w-none">
            <p className="text-stone-600 leading-relaxed mb-4">
              A la edad de {data.age} años, la profección anual llega al signo de {data.yearSign}, 
              activando los temas de la Casa {(data.age % 12) + 1} natal. 
              El Señor del Año es {data.lordOfTheYear}, quien gobernará los eventos principales de este período.
            </p>
            <p className="text-stone-600 leading-relaxed">
              La condición de {data.lordOfTheYear} en la carta natal, su dignidad esencial y accidental, 
              así como los aspectos que recibe, determinarán la calidad de los eventos de este año. 
              Los tránsitos de {data.lordOfTheYear} a lo largo del año serán especialmente significativos, 
              actuando como detonadores de las promesas natales.
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Temas Activados</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 text-stone-600 font-serif">1</div>
              <div>
                <h4 className="font-medium text-stone-800 mb-1">Asuntos de la Casa {(data.age % 12) + 1}</h4>
                <p className="text-sm text-stone-600">
                  {data.theme}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 text-stone-600 font-serif">2</div>
              <div>
                <h4 className="font-medium text-stone-800 mb-1">El Regente Natal</h4>
                <p className="text-sm text-stone-600">
                  La posición natal de {data.lordOfTheYear} indicará desde dónde y cómo se manifestarán 
                  los temas del año.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 text-stone-600 font-serif">3</div>
              <div>
                <h4 className="font-medium text-stone-800 mb-1">Tránsitos al Señor del Año</h4>
                <p className="text-sm text-stone-600">
                  Cualquier planeta que transite sobre {data.lordOfTheYear} natal activará eventos 
                  importantes durante este año profectado.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
