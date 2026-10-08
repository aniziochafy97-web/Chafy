import React from 'react';
import { Shield, Heart, MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenAssistant }) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-lg">
                C
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Assistente Chafy mz
                </span>
                <span className="text-xl">🇲🇿</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              O seu assistente remoto para Moçambique que transforma dúvidas e burocracia do dia a dia em planos de acção claros, checklists e ligação a profissionais.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Maputo e Matola, República de Moçambique</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>M-Pesa / WhatsApp: <strong>+258 84 361 0372</strong> • e-Mola: <strong>+258 87 761 0372</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>aniziochafy97@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Soluções Populares */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Soluções Rápidas
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={onOpenAssistant} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Abertura de Empresa no BAU
                </button>
              </li>
              <li>
                <button onClick={onOpenAssistant} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Renovação de BI na DIC
                </button>
              </li>
              <li>
                <button onClick={onOpenAssistant} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Importação de Carros no Porto
                </button>
              </li>
              <li>
                <button onClick={onOpenAssistant} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Contratos de Arrendamento em Maputo
                </button>
              </li>
              <li>
                <button onClick={onOpenAssistant} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Abertura de Conta Bancária
                </button>
              </li>
            </ul>
          </div>

          {/* Plataforma & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Plataforma
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#como-funciona" className="hover:text-emerald-400 transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-emerald-400 transition-colors">
                  Serviços Remotos
                </a>
              </li>
              <li>
                <a href="#profissionais" className="hover:text-emerald-400 transition-colors">
                  Marketplace de Especialistas
                </a>
              </li>
              <li>
                <a href="#precos" className="hover:text-emerald-400 transition-colors">
                  Preçário & Subscrição
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenAdmin} 
                  className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Painel de Administração
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Legal */}
        <div className="py-6 border-b border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong>Aviso Legal & Termos de Uso:</strong> O Assistente Chafy mz fornece orientação prática, organização administrativa e informação baseada em dados públicos e procedimentos vigentes na República de Moçambique. Não substitui pareceres jurídicos formais de advogados, diagnósticos médicos ou aconselhamento financeiro regulado. Todas as taxas e emolumentos apresentados baseiam-se em tabelas públicas e podem sofrer alterações pelas instituições oficiais.
          </p>
        </div>

        {/* Bottom Credits with Anizio Francio Chafy */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Assistente Chafy mz. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700/60 text-slate-200">
            <span>Criado e Desenvolvido por</span>
            <strong className="text-emerald-400 font-bold">Anizio Francio Chafy</strong>
            <span>🇲🇿</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
