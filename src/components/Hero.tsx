import React, { useState } from 'react';
import { Search, ArrowRight, Check, Building2, FileText, Car, Home, Briefcase, Users, CreditCard, Wrench } from 'lucide-react';

interface HeroProps {
  onStartSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onStartSearch(searchInput.trim());
    }
  };

  const exampleCards = [
    {
      category: 'Negócios',
      icon: Building2,
      badge: '🏢 Negócios',
      text: 'Quero abrir uma empresa',
      query: 'Quero abrir uma empresa em Maputo',
      accent: 'border-emerald-200 hover:border-emerald-500 bg-white'
    },
    {
      category: 'Documentos',
      icon: FileText,
      badge: '📄 Documentos',
      text: 'Preciso tratar o meu BI',
      query: 'Preciso tratar o meu Bilhete de Identidade (BI)',
      accent: 'border-blue-200 hover:border-blue-500 bg-white'
    },
    {
      category: 'Importação',
      icon: Car,
      badge: '🚗 Importação',
      text: 'Quero importar um carro',
      query: 'Quero importar um carro do Japão para Moçambique',
      accent: 'border-amber-200 hover:border-amber-500 bg-white'
    },
    {
      category: 'Habitação',
      icon: Home,
      badge: '🏠 Habitação',
      text: 'Procuro casa para arrendar',
      query: 'Procuro uma casa para arrendar em Maputo',
      accent: 'border-indigo-200 hover:border-indigo-500 bg-white'
    },
    {
      category: 'Emprego',
      icon: Briefcase,
      badge: '💼 Emprego',
      text: 'Preciso de um currículo',
      query: 'Preciso de um currículo profissional e carta de apresentação',
      accent: 'border-teal-200 hover:border-teal-500 bg-white'
    },
    {
      category: 'Serviços',
      icon: Users,
      badge: '👨‍👩‍👧 Serviços',
      text: 'Contratar empregada doméstica',
      query: 'Preciso contratar uma empregada doméstica com contrato e INSS',
      accent: 'border-purple-200 hover:border-purple-500 bg-white'
    },
    {
      category: 'Finanças',
      icon: CreditCard,
      badge: '💰 Finanças',
      text: 'Quero abrir conta bancária',
      query: 'Quero abrir uma conta bancária em Moçambique',
      accent: 'border-emerald-200 hover:border-emerald-500 bg-white'
    },
    {
      category: 'Serviços',
      icon: Wrench,
      badge: '🔧 Serviços',
      text: 'Preciso de um canalizador',
      query: 'Preciso de um canalizador de emergência em Maputo',
      accent: 'border-orange-200 hover:border-orange-500 bg-white'
    }
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 border-b border-slate-200/60">
      
      {/* Decorative background grid subtle */}
      <div className="absolute inset-0 bg-[radial-gradient(#005936_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top subtle location badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Assistente remoto para Moçambique 🇲🇿 • Maputo, Matola e todo o país</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Tem um problema? <br className="hidden sm:inline" />
            <span className="text-emerald-700 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
              Nós mostramos como resolver.
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Explique o que precisa em linguagem simples. O Assistente Chafy mz encontra os passos, documentos, locais e opções que podem ajudá-lo.
          </p>
        </div>

        {/* Central Search Box */}
        <div className="mt-10 max-w-3xl mx-auto">
          <form 
            onSubmit={handleSearchSubmit}
            className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-xl shadow-slate-900/5 border-2 border-emerald-600/30 hover:border-emerald-600 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-3 px-3 py-2 flex-1">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ex.: Quero abrir uma empresa em Maputo..."
                  className="w-full text-slate-900 text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-hidden bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 sm:py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer shrink-0"
              >
                <span>RESOLVER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Credibility Checkmarks */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>Orientação simples</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>Adaptado a Moçambique</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>Passo a passo personalizado</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>Profissionais credenciados</span>
            </div>
          </div>
        </div>

        {/* Clickable Example Cards */}
        <div className="mt-14">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
              Exemplos frequentes • Clique para resolver
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {exampleCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onStartSearch(card.query)}
                  className={`p-4 rounded-xl border text-left shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group ${card.accent}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">
                      {card.badge}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-800 transition-colors leading-snug">
                      “{card.text}”
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
