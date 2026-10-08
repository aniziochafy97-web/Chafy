import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Building, 
  ArrowRight, 
  ArrowLeft, 
  Home, 
  Loader2, 
  Copy, 
  Check,
  Layers
} from 'lucide-react';
import { Ticket } from '../types';

interface OrderHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  category: string;
  city: string;
  planType: 'ajuda_remota' | 'fazer_por_mim';
  amountMT: number;
  onTicketCreated: (ticket: Ticket) => void;
  onReturnHome?: () => void;
  onViewDashboard?: () => void;
}

export const OrderHelpModal: React.FC<OrderHelpModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  category,
  city,
  planType,
  amountMT,
  onTicketCreated,
  onReturnHome,
  onViewDashboard
}) => {
  const [name, setName] = useState('Anizio Chafy');
  const [email, setEmail] = useState('aniziochafy97@gmail.com');
  const [phone, setPhone] = useState('843610372');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'mkesh' | 'cartao' | 'banco'>('mpesa');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<Ticket | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBack = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      onClose();
    }
  };

  const copyToClipboard = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceTitle,
          category,
          city,
          planType,
          amountMT,
          paymentMethod,
          paymentPhone: phone,
          userName: name,
          userEmail: email,
          details: details || `Solicitação de ${planType === 'ajuda_remota' ? 'Ajuda Remota' : 'Resolução Completa'} para ${serviceTitle}.`
        })
      });

      const data = await res.json();
      if (data.ticket) {
        setSuccessTicket(data.ticket);
        onTicketCreated(data.ticket);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao registar o pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleBack();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 cursor-pointer animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden cursor-default"
      >
        
        {/* Header with clear navigation */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 gap-2">
          <div className="flex items-center gap-3">
            {/* Primary Back / Return button */}
            <button
              type="button"
              onClick={handleBack}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:border-slate-300"
              title="Voltar à página inicial ou ecrã anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Voltar</span>
            </button>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {successTicket ? 'Subscrição / Pedido Confirmado' : 'Subscrição & Pagamento'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {planType === 'ajuda_remota' ? 'Assistência Remota / Subscrição' : 'Serviço Resolva Por Mim'} • Moçambique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleBack}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-200/50"
              title="Voltar à Página Inicial"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Página Inicial</span>
            </button>
            <button
              onClick={handleBack}
              title="Fechar (Esc)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {successTicket ? (
            <div className="text-center py-4 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-800">
                  Solicitação Registada
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-1">
                  Pedido #{successTicket.id}
                </h4>
                <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  🟡 Status: {successTicket.status}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Serviço:</span>
                  <span className="font-semibold text-slate-800">{successTicket.serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cidade:</span>
                  <span className="font-semibold text-slate-800">{successTicket.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valor a pagar:</span>
                  <span className="font-bold text-emerald-800">{successTicket.amountMT} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Método selecionado:</span>
                  <span className="font-semibold uppercase text-slate-800">{successTicket.paymentMethod}</span>
                </div>
              </div>

              {/* Payment Details Box for manual transfer */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left text-xs space-y-2">
                <span className="font-extrabold text-emerald-950 block">
                  Contas de Pagamento em Moçambique:
                </span>
                
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-600 block">M-Pesa (Vodacom)</span>
                    <strong className="text-sm font-black text-slate-900">843610372</strong>
                    <span className="text-[11px] text-slate-500 block">Anizio Francio Chafy</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('843610372')}
                    className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedNumber === '843610372' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber === '843610372' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-600 block">e-Mola (Movitel)</span>
                    <strong className="text-sm font-black text-slate-900">877610372</strong>
                    <span className="text-[11px] text-slate-500 block">Anizio Francio Chafy</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('877610372')}
                    className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedNumber === '877610372' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber === '877610372' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-emerald-800 leading-snug pt-1">
                  💡 <em>Envie o comprovativo por WhatsApp para <strong>843610372</strong> indicando o número <strong>#{successTicket.id}</strong> para ativação imediata.</em>
                </p>
              </div>

              {/* Action buttons on success */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Voltar à Página Inicial</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onViewDashboard) {
                      onViewDashboard();
                    } else {
                      onClose();
                    }
                  }}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-4 h-4" />
                  <span>Ver no Dashboard</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Service details banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-emerald-950 truncate max-w-[260px]">{serviceTitle}</span>
                  <span className="font-black text-emerald-900 text-base">{amountMT} MT</span>
                </div>
                <span className="text-slate-500 text-[11px] block mt-1">
                  Cidade: {city} • Sem surpresas nem taxas escondidas
                </span>
              </div>

              {/* Personal information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">O seu Nome</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contacto WhatsApp / Telefone</label>
                  <input
                    type="tel"
                    required
                    placeholder="84 / 85 / 86 / 87..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Payment methods in Mozambique */}
              <div className="text-xs space-y-2">
                <label className="font-bold text-slate-700 block">
                  Escolha o Método de Pagamento / Subscrição:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'mpesa'
                        ? 'bg-red-50 border-red-600 text-red-900 font-bold ring-2 ring-red-600/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-red-600" />
                    <span>M-Pesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('emola')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'emola'
                        ? 'bg-orange-50 border-orange-600 text-orange-900 font-bold ring-2 ring-orange-600/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                    <span>e-Mola</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mkesh')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'mkesh'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold ring-2 ring-emerald-600/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span>mKesh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('banco')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'banco'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-600/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Building className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span>Transferência</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Payment Account Box with 843610372 and 877610372 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Dados de Pagamento para Subscrição ({amountMT} MT):
                </span>

                {paymentMethod === 'mpesa' && (
                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-red-700 text-xs uppercase">Conta M-Pesa:</span>
                        <strong className="text-sm font-black text-slate-900">843610372</strong>
                      </div>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        Titular: <strong>Anizio Francio Chafy</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('843610372')}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-red-50 cursor-pointer"
                    >
                      {copiedNumber === '843610372' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber === '843610372' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}

                {paymentMethod === 'emola' && (
                  <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-orange-700 text-xs uppercase">Conta e-Mola:</span>
                        <strong className="text-sm font-black text-slate-900">877610372</strong>
                      </div>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        Titular: <strong>Anizio Francio Chafy</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('877610372')}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-orange-200 text-orange-700 font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-orange-50 cursor-pointer"
                    >
                      {copiedNumber === '877610372' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber === '877610372' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}

                {paymentMethod !== 'mpesa' && paymentMethod !== 'emola' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-red-600 block">M-Pesa:</span>
                        <span className="font-black text-xs text-slate-900">843610372</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('843610372')}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-orange-600 block">e-Mola:</span>
                        <span className="font-black text-xs text-slate-900">877610372</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('877610372')}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Extra notes */}
              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">
                  Alguma nota ou instrução sobre a sua subscrição? (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ex: Pagamento da subscrição Resolve+ para apoio na formalização de empresa..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Form Actions with clear Back / Cancel button */}
              <div className="pt-2 space-y-2.5">
                <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-500" />
                    <span>Recuar / Voltar</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>A validar subscrição...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirmar Subscrição ({amountMT} MT)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pagamento seguro via M-Pesa (843610372) e e-Mola (877610372).</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="underline text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar e voltar ao início
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

