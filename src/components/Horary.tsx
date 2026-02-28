import React, { useState } from 'react';
import { ChartData } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search } from 'lucide-react';
import { getPlanetLongitude, getRemainingDegrees } from '../utils/astroUtils';

interface Props {
  horaryData: ChartData;
}

export default function Horary({ horaryData }: Props) {
  const [question, setQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      setSubmittedQuestion(question);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 mb-4">Astrología Horaria</h2>
        <p className="text-stone-500 font-sans text-sm tracking-wide uppercase">La Carta del Momento de la Pregunta</p>
      </header>

      <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 mb-12">
        <h3 className="font-serif text-2xl mb-6 text-stone-800">Formular Pregunta</h3>
        <p className="text-stone-600 text-sm leading-relaxed mb-6">
          La astrología horaria responde a preguntas concretas levantando una carta para el momento y lugar exacto 
          en que el astrólogo comprende la pregunta. La pregunta debe ser clara, específica y de profunda importancia 
          para el consultante.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ej: ¿Recuperaré el objeto perdido?" 
            className="flex-1 px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent bg-white text-stone-800"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Search size={18} />
            <span>Levantar Carta</span>
          </button>
        </form>
      </div>

      {submittedQuestion && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-12 text-center">
            <h3 className="font-serif text-3xl text-stone-900 mb-2">"{submittedQuestion}"</h3>
            <p className="text-stone-500 font-mono text-sm">
              {format(new Date(), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Significadores Principales</h3>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm">
                  <h4 className="font-serif text-xl mb-2 text-stone-800">El Consultante (Casa 1)</h4>
                  <p className="text-sm text-stone-600 mb-4">
                    Representado por el regente del Ascendente en {horaryData.ascendant.sign}.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-serif text-stone-900">
                      {horaryData.ascendant.sign === 'Aries' || horaryData.ascendant.sign === 'Scorpio' ? 'Mars' : 
                       horaryData.ascendant.sign === 'Taurus' || horaryData.ascendant.sign === 'Libra' ? 'Venus' : 
                       horaryData.ascendant.sign === 'Gemini' || horaryData.ascendant.sign === 'Virgo' ? 'Mercury' : 
                       horaryData.ascendant.sign === 'Cancer' ? 'Moon' : 
                       horaryData.ascendant.sign === 'Leo' ? 'Sun' : 
                       horaryData.ascendant.sign === 'Sagittarius' || horaryData.ascendant.sign === 'Pisces' ? 'Jupiter' : 'Saturn'}
                    </span>
                    <span className="text-sm font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded">
                      en {horaryData.planets[0].sign}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm">
                  <h4 className="font-serif text-xl mb-2 text-stone-800">Lo Preguntado (Casa Quesitada)</h4>
                  <p className="text-sm text-stone-600 mb-4">
                    Representado por el regente de la casa pertinente a la pregunta.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-serif text-stone-900">
                      {horaryData.planets[1].planet}
                    </span>
                    <span className="text-sm font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded">
                      en {horaryData.planets[1].sign}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-6 text-stone-800 border-b border-stone-100 pb-2">Análisis de la Luna</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                La Luna es el co-significador del consultante y muestra el desarrollo de los eventos. 
                Sus próximos aspectos aplicativos indicarán cómo se desenvolverá la situación.
              </p>
              
              <div className="bg-white p-6 rounded-lg border border-stone-100 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-xl text-stone-800">Luna en {horaryData.planets.find(p => p.planet === 'Moon')?.sign}</span>
                  <span className="text-sm font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded">
                    {horaryData.planets.find(p => p.planet === 'Moon')?.degree}°
                  </span>
                </div>
                
                <h5 className="text-xs text-stone-400 uppercase tracking-widest mb-3">Próximos Aspectos Aplicativos</h5>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center py-2 border-b border-stone-50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-stone-800">Luna</span>
                      <span className="text-xs text-stone-400 uppercase tracking-wider">Trígono</span>
                      <span className="text-sm font-medium text-stone-600">{horaryData.planets[3].planet}</span>
                    </div>
                    <span className="text-xs font-mono text-stone-500">
                      en {getRemainingDegrees(
                        getPlanetLongitude(horaryData.planets.find(p => p.planet === 'Moon')!),
                        getPlanetLongitude(horaryData.planets[3]),
                        120
                      )}°
                    </span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-stone-50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-stone-800">Luna</span>
                      <span className="text-xs text-stone-400 uppercase tracking-wider">Cuadratura</span>
                      <span className="text-sm font-medium text-stone-600">{horaryData.planets[5].planet}</span>
                    </div>
                    <span className="text-xs font-mono text-stone-500">
                      en {getRemainingDegrees(
                        getPlanetLongitude(horaryData.planets.find(p => p.planet === 'Moon')!),
                        getPlanetLongitude(horaryData.planets[5]),
                        90
                      )}°
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-stone-900 text-white rounded-lg">
                <h4 className="font-serif text-lg mb-2">Juicio Preliminar</h4>
                <p className="text-sm text-stone-300 leading-relaxed">
                  El aspecto aplicativo entre los significadores principales sugiere una resolución 
                  favorable, aunque la cuadratura posterior de la Luna indica posibles obstáculos o demoras 
                  antes de la conclusión final.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
