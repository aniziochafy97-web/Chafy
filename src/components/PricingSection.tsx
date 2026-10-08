import React, { useState } from 'react';
import { Check, ArrowRight, Smartphone, Copy, ShieldCheck, CheckCheck } from 'lucide-react';

interface PricingSectionProps {
  onSelectFree: () => void;
  onSelectResolvePlus: () => void;
  onSelectAssistance: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectFree,
  onSelectResolvePlus,
  onSelectAssistance
}) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  return (
    <section id="precos" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
            Preços Transparentes em Meticais (MT)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Comece gratuitamente. Avance com apoio quando precisar.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A orientação pública é livre para todos os moçambicanos. Se precisar de acompanhamento individual ou minutas prontas, oferecemos planos acessíveis com subscrição rápida via M-Pesa e e-Mola.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Card 1: Gratuito */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold mb-4">
                GRATUITO
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-slate-900">0</span>
                <span className="text-base font-bold text-slate-500">MT</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Para quem quer apenas saber onde ir e quais documentos levar.
              </p>

              <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Perguntas e orientação geral</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Checklists simples com documentos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Localização de instituições oficiais</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Acesso ao directório de profissionais</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={onSelectFree}
                className="w-full py-3 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Começar Grátis
              </button>
            </div>
          </div>

          {/* Card 2: Resolve+ */}
          <div className="p-8 rounded-3xl bg-white border-2 border-emerald-600 shadow-xl relative flex flex-col justify-between hover:scale-[1.02] transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-sm">
              Mais Recomendado
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold mb-4">
                RESOLVE+
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-slate-900">150</span>
                <span className="text-base font-bold text-slate-500">MT / mês</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Orientação contínua, modelos de cartas e minutas sem burocracia.
              </p>

              <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Tudo do plano Gratuito</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Modelos de cartas, minutas e contratos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Checklists personalizadas para imprimir</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Histórico completo nos Meus Processos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Assistência prioritária via WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={onSelectResolvePlus}
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Subscrever Resolve+ (150 MT)
              </button>
            </div>
          </div>

          {/* Card 3: Assistência sob Medida */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-purple-100 text-purple-900 text-xs font-bold mb-4">
                ASSISTÊNCIA POR SERVIÇO
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-black text-slate-900">Por Serviço</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Um assistente Resolve MZ organiza e acompanha o processo por si.
              </p>

              <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Assistente dedicado ao seu processo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Preenchimento e revisão de formulários</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Agendamento de deslocações e cartórios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Acompanhamento até à resolução</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={onSelectAssistance}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Pedir Assistência
              </button>
            </div>
          </div>

        </div>

        {/* Dedicated Official M-Pesa & e-Mola Payment Information Callout */}
        <div className="mt-12 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-600/30 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Canais Oficiais de Pagamento & Subscrição em Moçambique</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Pague a sua subscrição diretamente por Carteira Móvel
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Titular registado: <strong>Anizio Francio Chafy</strong>. Confirmação rápida por WhatsApp após o envio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              
              {/* M-Pesa Card */}
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    M
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">M-Pesa (Vodacom)</span>
                    <strong className="text-base font-black text-slate-900">843610372</strong>
                    <span className="text-[10px] text-slate-500 block">Anizio Francio Chafy</span>
                  </div>
                </div>
                <button
                  onClick={() => copyNumber('843610372')}
                  className="p-2 rounded-lg bg-white border border-red-200 hover:bg-red-100/60 text-red-700 font-bold text-xs transition-colors cursor-pointer"
                  title="Copiar número M-Pesa"
                >
                  {copiedNumber === '843610372' ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* e-Mola Card */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    e
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">e-Mola (Movitel)</span>
                    <strong className="text-base font-black text-slate-900">877610372</strong>
                    <span className="text-[10px] text-slate-500 block">Anizio Francio Chafy</span>
                  </div>
                </div>
                <button
                  onClick={() => copyNumber('877610372')}
                  className="p-2 rounded-lg bg-white border border-orange-200 hover:bg-orange-100/60 text-orange-700 font-bold text-xs transition-colors cursor-pointer"
                  title="Copiar número e-Mola"
                >
                  {copiedNumber === '877610372' ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
