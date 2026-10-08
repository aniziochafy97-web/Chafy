import React from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  Briefcase, 
  FileText, 
  Mail, 
  Home, 
  LandPlot, 
  Ship, 
  Car, 
  Calculator, 
  Scale, 
  UserCheck, 
  FileSignature, 
  Zap, 
  Wrench, 
  Cog, 
  CreditCard, 
  GraduationCap, 
  FolderArchive, 
  IdCard,
  ArrowRight,
  Flame
} from 'lucide-react';
import { INITIAL_PROBLEMS_20 } from '../data/mockData';

interface PopularProblemsSectionProps {
  onSelectProblem: (query: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Building2,
  FileSpreadsheet,
  Briefcase,
  FileText,
  Mail,
  Home,
  LandPlot,
  Ship,
  Car,
  Calculator,
  Scale,
  UserCheck,
  FileSignature,
  Zap,
  Wrench,
  Cog,
  CreditCard,
  GraduationCap,
  FolderArchive,
  IdCard
};

export const PopularProblemsSection: React.FC<PopularProblemsSectionProps> = ({ onSelectProblem }) => {
  return (
    <section id="como-funciona" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-extrabold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-red-600" />
            <span>Resolva Agora • Mais Procurados em Moçambique</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            De uma dúvida a um plano de acção prático.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Selecione uma das soluções mais requisitadas para abrir de imediato o passo a passo com instituições, taxas e documentação.
          </p>
        </div>

        {/* 20 Problems Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {INITIAL_PROBLEMS_20.map((item) => {
            const Icon = iconMap[item.icon] || FileText;
            return (
              <button
                key={item.id}
                onClick={() => onSelectProblem(item.query)}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-900/5 transition-all text-left group cursor-pointer flex flex-col justify-between h-36"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-emerald-700 group-hover:bg-emerald-50 transition-colors shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Resolver</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Slogan Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold">
              Não encontrou o que procura na lista?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Escreva o seu problema específico com as suas próprias palavras. O nosso assistente inteligente analisa qualquer questão.
            </p>
          </div>
          <button
            onClick={() => onSelectProblem('')}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-md cursor-pointer"
          >
            Fazer Pergunta Personalizada
          </button>
        </div>

      </div>
    </section>
  );
};
