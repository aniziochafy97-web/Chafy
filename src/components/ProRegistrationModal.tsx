import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, Home, Loader2, Award } from 'lucide-react';
import { Professional } from '../types';

interface ProRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (newProf: Professional) => void;
}

export const ProRegistrationModal: React.FC<ProRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistered
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Contabilidade & Fiscalidade');
  const [city, setCity] = useState('Maputo');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'Gratuito' | 'Profissional' | 'Empresa'>('Profissional');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/professionals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          city,
          phone,
          whatsapp: whatsapp || phone,
          shortBio,
          plan: selectedPlan
        })
      });

      const data = await res.json();
      if (data.professional) {
        onRegistered(data.professional);
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao registar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 cursor-pointer animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden cursor-default"
      >
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:border-slate-300"
              title="Voltar à Página Inicial"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Voltar</span>
            </button>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Registar como Profissional
              </h3>
              <p className="text-[11px] text-slate-500">
                Receba clientes qualificados em Maputo, Matola e outras províncias
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-200/50"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Página Inicial</span>
            </button>
            <button
              onClick={onClose}
              title="Fechar (Esc)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {success ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">
                Perfil Registado com Sucesso!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                O seu perfil já foi integrado no Marketplace. A nossa equipa entrará em contacto via WhatsApp para validar credenciais e atribuir o selo de verificação.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Voltar à Página Inicial</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Choose Plan */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Escolha o seu plano de adesão:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('Gratuito')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPlan === 'Gratuito'
                        ? 'bg-slate-100 border-slate-800 text-slate-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="block font-bold">Gratuito</span>
                    <span className="text-[11px] text-slate-400">0 MT/mês</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Perfil básico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('Profissional')}
                    className={`p-3 rounded-xl border text-center relative transition-all cursor-pointer ${
                      selectedPlan === 'Profissional'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="block font-bold text-emerald-900">Profissional</span>
                    <span className="text-[11px] font-black text-emerald-700">300 MT/mês</span>
                    <span className="text-[10px] text-emerald-800 block mt-1">Destaque + Leads</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('Empresa')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPlan === 'Empresa'
                        ? 'bg-purple-50 border-purple-600 text-purple-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="block font-bold">Empresa</span>
                    <span className="text-[11px] text-slate-400">Personalizado</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Equipas</span>
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nome Completo / Firma</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Salvador Sitoe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Área / Especialidade</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden font-medium"
                  >
                    <option value="Contabilidade & Fiscalidade">Contabilidade & Fiscalidade (OCAM)</option>
                    <option value="Direito & Contratos">Direito & Contratos (OAM)</option>
                    <option value="Eletricista Certificado">Eletricista Certificado</option>
                    <option value="Despachante Aduaneiro">Despachante Aduaneiro (JUE/AT)</option>
                    <option value="Canalizador & Bombas">Canalizador & Redes Prediais</option>
                    <option value="Mecânico & Oficinas">Mecânico & Oficinas Automóveis</option>
                    <option value="Recrutamento & CV">Recrutamento & Recursos Humanos</option>
                    <option value="Outro Serviço Técnico">Outro Serviço Técnico</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cidade Principal</label>
                  <input
                    type="text"
                    required
                    placeholder="Maputo, Matola, etc."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefone Directo</label>
                  <input
                    type="tel"
                    required
                    placeholder="+258 84..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="Mesmo do telefone"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">
                  Breve Apresentação & Experiência
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Contabilista com 10 anos de experiência em PMEs, fecho de contas e regularização na AT..."
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>Cancelar / Voltar</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>A submeter perfil...</span>
                    </>
                  ) : (
                    <>
                      <span>Submeter Registo Profissional</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
