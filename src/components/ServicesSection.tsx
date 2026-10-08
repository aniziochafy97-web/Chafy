import React from 'react';
import { FileText, Building2, Home, Car, Briefcase, Wrench, ArrowRight, Check } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string, category: string, amountMT: number) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const serviceCategories = [
    {
      id: 'docs',
      title: 'Documentos & Requerimentos',
      icon: FileText,
      badge: '📄 Documentos',
      description: 'Elaboração e preparação de documentos formais aceites em repartições públicas e empresas.',
      items: [
        'Requerimentos formais para instituições públicas',
        'Minutas de contratos de trabalho e arrendamento',
        'Declarações formais e termos de responsabilidade',
        'Formulários e cartas de apresentação'
      ],
      priceFromMT: 100
    },
    {
      id: 'biz',
      title: 'Empresas & Negócios',
      icon: Building2,
      badge: '🏢 Empresas',
      description: 'Acompanhamento do processo de formalização empresarial no BAU e Autoridade Tributária.',
      items: [
        'Orientação completa para abertura no BAU',
        'Checklist e preparação de estatutos societários',
        'Enquadramento fiscal e registo de NUIT',
        'Licenciamento simplificado e Alvará'
      ],
      priceFromMT: 350
    },
    {
      id: 'hab',
      title: 'Habitação & Imobiliário',
      icon: Home,
      badge: '🏠 Habitação',
      description: 'Apoio em processos de arrendamento, compra, verificação de DUAT e contratos no cartório.',
      items: [
        'Pesquisa orientada de casas e dependências',
        'Contratos blindados contra litígios de caução',
        'Verificação de titularidade e DUAT',
        'Acompanhamento ao cartório notarial'
      ],
      priceFromMT: 250
    },
    {
      id: 'auto',
      title: 'Automóveis & Importação',
      icon: Car,
      badge: '🚗 Automóveis',
      description: 'Orientação de importação alfandegária, desembaraço na JUE e procedimentos do INATRO.',
      items: [
        'Simulação e cálculo prévio de direitos na JUE',
        'Checklist de documentação marítima (B/L e Invoice)',
        'Ligação a despachantes aduaneiros credenciados',
        'Mudança de propriedade e matrícula no INATRO'
      ],
      priceFromMT: 450
    },
    {
      id: 'work',
      title: 'Emprego & Carreira',
      icon: Briefcase,
      badge: '💼 Emprego',
      description: 'Posicionamento profissional nos padrões valorizados pelos empregadores em Moçambique.',
      items: [
        'Currículo profissional moderno em formato PDF',
        'Carta de motivação personalizada à vaga',
        'Preparação para entrevistas de selecção',
        'Guia de submissão nas maiores empresas locais'
      ],
      priceFromMT: 150
    },
    {
      id: 'pros',
      title: 'Rede de Técnicos & Peritos',
      icon: Wrench,
      badge: '🔧 Profissionais',
      description: 'Prestadores de serviços verificados e com avaliações reais de clientes em Moçambique.',
      items: [
        'Contabilistas certificados pela OCAM',
        'Advogados credenciados pela OAM',
        'Eletricistas certificados (padrão EDM)',
        'Canalizadores e técnicos de frio'
      ],
      priceFromMT: 200
    }
  ];

  return (
    <section id="servicos" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700">
            Podemos Ajudar • Serviços Especializados
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Menos filas. Mais solução.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Prefere que o Assistente Chafy mz trate das minutas, acompanhe a burocracia ou ligue o seu pedido ao técnico certo? Escolha a categoria abaixo:
          </p>
        </div>

        {/* 6 Core Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((serv) => {
            const Icon = serv.icon;
            return (
              <div
                key={serv.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-600/60 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {serv.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {serv.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {serv.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    {serv.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">A partir de</span>
                    <span className="text-base font-black text-slate-900">{serv.priceFromMT} MT</span>
                  </div>

                  <button
                    onClick={() => onSelectService(serv.title, serv.badge, serv.priceFromMT)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Pedir Serviço</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
