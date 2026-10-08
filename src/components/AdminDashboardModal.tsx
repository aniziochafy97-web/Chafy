import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, DollarSign, Users, FileText, CheckCircle, Clock, Plus, Building2, AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Ticket } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  onUpdateTicketStatus: (id: string, newStatus: 'Aguardando assistência' | 'Em análise' | 'Resolvido') => void;
  institutions: Array<{ name: string; role: string; location: string; contact: string; schedule: string }>;
  onAddInstitution: (inst: { name: string; role: string; location: string; contact: string; schedule: string }) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  tickets,
  onUpdateTicketStatus,
  institutions,
  onAddInstitution,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'institutions'>('overview');
  
  // New institution form
  const [instName, setInstName] = useState('');
  const [instRole, setInstRole] = useState('');
  const [instLoc, setInstLoc] = useState('');
  const [instContact, setInstContact] = useState('');

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

  const totalRevenueMT = tickets.reduce((acc, t) => acc + (t.amountMT || 0), 0) + 4500;
  const waitingTickets = tickets.filter(t => t.status === 'Aguardando assistência').length;
  const inProgressTickets = tickets.filter(t => t.status === 'Em análise').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolvido').length;

  const handleCreateInst = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName.trim()) return;
    onAddInstitution({
      name: instName,
      role: instRole || 'Atendimento e formalização',
      location: instLoc || 'Maputo',
      contact: instContact || '+258 21 000 000',
      schedule: 'Seg - Sex: 07:30 às 15:30'
    });
    setInstName('');
    setInstRole('');
    setInstLoc('');
    setInstContact('');
    alert('Instituição adicionada com sucesso à base de dados!');
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] cursor-default"
      >
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50 shrink-0 gap-3">
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

            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Painel de Administração
                </h2>
                <span className="text-[10px] uppercase font-black bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                  Assistente Chafy mz Core
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Gestão operacional de pedidos, utilizadores, receita e base de instituições em Moçambique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-amber-800 transition-colors cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-amber-100/60"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Página Inicial</span>
            </button>
            <button
              onClick={onClose}
              title="Fechar (Esc)"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-4 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Métricas Gerais
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tickets'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Gestão de Pedidos</span>
            <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
              {waitingTickets}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'institutions'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Instituições Oficiais ({institutions.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Receita Total</span>
                  <span className="text-2xl font-black text-emerald-700 mt-1 block">
                    {totalRevenueMT.toLocaleString()} MT
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">M-Pesa, e-Mola & Subscrições</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Utilizadores Registados</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    384
                  </span>
                  <span className="text-[10px] text-slate-500">Maputo, Matola, Beira</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Pedidos de Assistência</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    {tickets.length}
                  </span>
                  <span className="text-[10px] text-amber-600 font-semibold">{waitingTickets} pendente(s)</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Profissionais Activos</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    6
                  </span>
                  <span className="text-[10px] text-slate-500">Taxa de satisfação: 4.9 ⭐</span>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Estado Operacional das Solicitações
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-950 block">🟡 Aguardando Assistência</span>
                      <span className="text-amber-800 text-[11px]">Requer contacto por WhatsApp</span>
                    </div>
                    <span className="text-xl font-black text-amber-950">{waitingTickets}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-950 block">🔵 Em Análise</span>
                      <span className="text-blue-800 text-[11px]">Equipa a preparar documentos</span>
                    </div>
                    <span className="text-xl font-black text-blue-950">{inProgressTickets}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-950 block">🟢 Resolvido</span>
                      <span className="text-emerald-800 text-[11px]">Processo entregue com sucesso</span>
                    </div>
                    <span className="text-xl font-black text-emerald-950">{resolvedTickets}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Tickets Management */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lista de Solicitações de Apoio Humano
                </h3>
                <span className="text-xs text-slate-400">
                  Pode alterar o estado do pedido directamente abaixo:
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white divide-y divide-slate-100">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">#{t.id}</span>
                        <span className="text-xs font-bold text-slate-700">• {t.userName} ({t.paymentPhone || 'Sem telefone'})</span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {t.amountMT} MT
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {t.serviceTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {t.city} • Método: {t.paymentMethod.toUpperCase()} • {t.createdAt}
                      </p>
                      <p className="text-xs text-slate-600 italic">
                        "{t.details}"
                      </p>
                    </div>

                    {/* Status Changer Select */}
                    <div className="shrink-0 flex items-center gap-2">
                      <label className="text-[11px] font-bold text-slate-400">Estado:</label>
                      <select
                        value={t.status}
                        onChange={(e) => onUpdateTicketStatus(t.id, e.target.value as any)}
                        className={`text-xs font-bold p-2 rounded-xl border focus:outline-hidden cursor-pointer ${
                          t.status === 'Resolvido'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : t.status === 'Em análise'
                            ? 'bg-blue-50 border-blue-300 text-blue-900'
                            : 'bg-amber-50 border-amber-300 text-amber-900'
                        }`}
                      >
                        <option value="Aguardando assistência">🟡 Aguardando assistência</option>
                        <option value="Em análise">🔵 Em análise</option>
                        <option value="Resolvido">🟢 Resolvido</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Institutions & Content Management */}
          {activeTab === 'institutions' && (
            <div className="space-y-6">
              
              {/* Form to add institution */}
              <form onSubmit={handleCreateInst} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>Adicionar Nova Instituição Governamental ou Posto de Atendimento</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nome da Instituição</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cartório Notarial da Matola"
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Competência / Serviços</label>
                    <input
                      type="text"
                      placeholder="Ex: Reconhecimento de firmas, autenticações"
                      value={instRole}
                      onChange={(e) => setInstRole(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Endereço / Localização</label>
                    <input
                      type="text"
                      placeholder="Ex: Av. Eduardo Mondlane, Matola"
                      value={instLoc}
                      onChange={(e) => setInstLoc(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contacto Oficial</label>
                    <input
                      type="text"
                      placeholder="Ex: +258 21 720 000"
                      value={instContact}
                      onChange={(e) => setInstContact(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Registar Instituição
                </button>
              </form>

              {/* List of current institutions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Instituições Activas na Base de Conhecimento
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {institutions.map((it, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <h5 className="font-bold text-slate-900">{it.name}</h5>
                      </div>
                      <p className="text-slate-600 text-[11px] mb-2">{it.role}</p>
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <p>📍 {it.location}</p>
                        <p>📞 {it.contact} • ⏱️ {it.schedule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
