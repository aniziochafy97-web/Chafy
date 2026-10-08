import React, { useState } from 'react';
import { Star, MapPin, ShieldCheck, Phone, MessageSquare, Briefcase, Plus, Filter } from 'lucide-react';
import { Professional } from '../types';

interface MarketplaceSectionProps {
  professionals: Professional[];
  onOpenProRegister: () => void;
  onRequestLead: (prof: Professional) => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  professionals,
  onOpenProRegister,
  onRequestLead
}) => {
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = [
    'Todos',
    'Contabilidade & Fiscalidade',
    'Direito & Contratos',
    'Eletricista Certificado',
    'Despachante Aduaneiro',
    'Canalizador & Bombas',
    'Recrutamento & CV'
  ];

  const cities = ['Todas', 'Maputo', 'Matola', 'Nampula', 'Beira'];

  const filtered = professionals.filter(p => {
    const matchCity = selectedCity === 'Todas' || p.city.toLowerCase().includes(selectedCity.toLowerCase());
    const matchCategory = selectedCategory === 'Todos' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchCity && matchCategory;
  });

  return (
    <section id="profissionais" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
              Marketplace Verificado • Moçambique
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Encontre quem pode ajudar.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Contacte especialistas certificados com avaliações comprovadas em Maputo, Matola e outras províncias.
            </p>
          </div>

          {/* Callout button: "É profissional?" */}
          <div className="shrink-0">
            <button
              onClick={onOpenProRegister}
              className="px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Registar como Profissional</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>Filtros:</span>
          </div>

          {/* City filter */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <span className="text-xs text-slate-500 mr-1">Cidade:</span>
            {cities.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCity === c
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 w-full sm:w-auto">
            <span className="text-xs text-slate-500 mr-1">Área:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg p-1.5 focus:border-emerald-600 focus:outline-hidden"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prof) => (
            <div
              key={prof.id}
              className="p-6 rounded-3xl border border-slate-200/90 bg-white hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {prof.name}
                      </h3>
                      {prof.verified && (
                        <span title="Verificado pelo Assistente Chafy mz">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 block mt-0.5">
                      {prof.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold text-amber-900">{prof.rating}</span>
                    <span className="text-[10px] text-amber-700">({prof.reviewsCount})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prof.city}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {prof.shortBio}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Serviços a partir de:</span>
                  <span className="font-extrabold text-slate-900">{prof.priceStartingMT} MT</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onRequestLead(prof)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Pedir Orçamento</span>
                  </button>
                  <a
                    href={`https://wa.me/258${prof.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Olá ${prof.name}, encontrei o seu perfil através da plataforma Assistente Chafy mz.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Contactar</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* B2B Callout: "É profissional?" */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
              Oportunidade para Profissionais
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              É profissional em Moçambique? Receba novos clientes diariamente.
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Advogados, contabilistas, técnicos, eletricistas e consultores. Ganhe visibilidade para pessoas e empresas que procuram os seus serviços.
            </p>
          </div>

          <button
            onClick={onOpenProRegister}
            className="px-6 py-3.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-xl shrink-0 cursor-pointer"
          >
            Registar como Profissional
          </button>
        </div>

      </div>
    </section>
  );
};
