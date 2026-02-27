import React from 'react';
import { 
  Moon, Sun, Compass, Clock, Map, Star, 
  Menu, X, Calendar, Activity
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'natal', label: 'Carta Natal', icon: Sun },
  { id: 'transits', label: 'Tránsitos', icon: Activity },
  { id: 'firdaria', label: 'Firdaria Persa', icon: Calendar },
  { id: 'profections', label: 'Profecciones', icon: Clock },
  { id: 'progressions', label: 'Progresiones Secundarias', icon: Moon },
  { id: 'directions', label: 'Direcciones Primarias', icon: Compass },
  { id: 'horary', label: 'Horaria', icon: Map },
];

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col md:flex-row font-sans text-stone-900">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-stone-200">
        <h1 className="font-serif text-2xl tracking-wide">Astraea</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:block w-full md:w-72 bg-white border-r border-stone-200 flex-shrink-0
        flex flex-col h-screen sticky top-0
      `}>
        <div className="p-8 hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-stone-400" strokeWidth={1.5} />
            <h1 className="font-serif text-3xl tracking-wide font-medium">Astraea</h1>
          </div>
          <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">Astrología Clásica</p>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300
                      ${isActive 
                        ? 'bg-stone-100 text-stone-900 font-medium' 
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}
                    `}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-stone-800' : 'text-stone-400'} />
                    <span className="tracking-wide">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-stone-100">
          <div className="text-xs text-stone-400 text-center">
            Calculado con Swiss Ephemeris
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto p-6 md:p-12 lg:p-16">
          {children}
        </div>
      </main>
    </div>
  );
}
