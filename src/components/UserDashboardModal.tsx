import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Plus, 
  FileText, 
  Layers, 
  Sparkles, 
  Bell, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Radio, 
  ExternalLink,
  Check,
  ArrowLeft,
  Home
} from 'lucide-react';
import { UserProcess, Ticket } from '../types';
import { TicketToastNotification, ToastItem, playResolutionChime } from './TicketToastNotification';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  processes: UserProcess[];
  tickets: Ticket[];
  onToggleStep: (processId: string, stepId: string) => void;
  onStartNewProblem: () => void;
  onUpdateTicketStatus?: (id: string, newStatus: 'Aguardando assistência' | 'Em análise' | 'Resolvido') => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  processes,
  tickets,
  onToggleStep,
  onStartNewProblem,
  onUpdateTicketStatus,
}) => {
  // Toasts state
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [highlightedTicketId, setHighlightedTicketId] = useState<string | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<ToastItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Store previous ticket statuses to detect status transitions
  const prevStatusesRef = useRef<Map<string, string>>(new Map());
  const isInitializedRef = useRef<boolean>(false);
  const ticketRowRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // Track status transitions to 'Resolvido'
  useEffect(() => {
    if (!isOpen) return;

    if (!isInitializedRef.current) {
      // First time modal opens with tickets: populate baseline map so existing tickets don't trigger
      tickets.forEach((t) => {
        prevStatusesRef.current.set(t.id, t.status);
      });
      isInitializedRef.current = true;
      return;
    }

    // Inspect each ticket for transition to 'Resolvido'
    tickets.forEach((t) => {
      const prevStatus = prevStatusesRef.current.get(t.id);
      
      // Real-time status change detected!
      if (prevStatus && prevStatus !== 'Resolvido' && t.status === 'Resolvido') {
        const newToast: ToastItem = {
          id: `toast-${t.id}-${Date.now()}`,
          ticket: t,
          resolvedAt: new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          previousStatus: prevStatus,
        };

        // Add to active toast list
        setToasts((prev) => [newToast, ...prev]);
        setNotificationHistory((prev) => [newToast, ...prev]);

        // Play auditory chime if enabled
        if (soundEnabled) {
          playResolutionChime();
        }

        // Highlight ticket visually
        setHighlightedTicketId(t.id);
        setTimeout(() => {
          setHighlightedTicketId((curr) => (curr === t.id ? null : curr));
        }, 5000);
      }

      // Always update known status
      prevStatusesRef.current.set(t.id, t.status);
    });
  }, [tickets, isOpen, soundEnabled]);

  const handleDismissToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  const handleViewTicket = (ticketId: string) => {
    setHighlightedTicketId(ticketId);
    const rowEl = ticketRowRefs.current.get(ticketId);
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedTicketId((curr) => (curr === ticketId ? null : curr));
    }, 4500);
  };

  const handleSimulateResolution = (ticketToResolve: Ticket) => {
    if (onUpdateTicketStatus) {
      onUpdateTicketStatus(ticketToResolve.id, 'Resolvido');
    }
  };

  const handleResetForTesting = (ticketToReset: Ticket) => {
    if (onUpdateTicketStatus) {
      onUpdateTicketStatus(ticketToReset.id, 'Em análise');
    }
  };

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

  const pendingTickets = tickets.filter((t) => t.status !== 'Resolvido');
  const resolvedTickets = tickets.filter((t) => t.status === 'Resolvido');

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
        className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] cursor-default"
      >
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            {/* Direct Return to Home button */}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:border-slate-300"
              title="Voltar à Página Inicial"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Voltar</span>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center shadow-sm">
              MZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Olá, Anizio 👋
                </h2>
                {/* Real-time pulse indicator */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  Tempo Real Activo
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Acompanhamento em tempo real dos seus processos e pedidos em Moçambique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              title={soundEnabled ? 'Silenciar notificações sonoras' : 'Activar som das notificações'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden md:inline text-[11px]">{soundEnabled ? 'Som activo' : 'Mudo'}</span>
            </button>

            {/* Notification History Toggle */}
            {notificationHistory.length > 0 && (
              <button
                onClick={() => setShowHistory((prev) => !prev)}
                title="Histórico de alertas"
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showHistory 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] font-bold">{notificationHistory.length}</span>
              </button>
            )}

            <button
              onClick={() => { onClose(); onStartNewProblem(); }}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Problema</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Notification History Panel Dropdown */}
        {showHistory && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-6 py-3 shrink-0 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-700" />
                Histórico de Alertas de Resolução nesta Sessão ({notificationHistory.length})
              </span>
              <button
                onClick={() => setNotificationHistory([])}
                className="text-[11px] text-amber-700 underline hover:text-amber-900 cursor-pointer"
              >
                Limpar histórico
              </button>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {notificationHistory.map((item, idx) => (
                <div key={idx} className="bg-white/80 rounded-lg p-2 border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-800">#{item.ticket.id}</span>
                    <span className="text-slate-600 truncate max-w-xs">{item.ticket.serviceTitle}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.resolvedAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 relative">
          
          {/* Active Processes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Os Seus Processos Activos</span>
              </h3>
              <span className="text-xs text-slate-400">
                {processes.length} processo(s) registados
              </span>
            </div>

            <div className="space-y-4">
              {processes.map((proc) => {
                const completedCount = proc.steps.filter((s) => s.completed).length;
                const totalCount = proc.steps.length;
                const calculatedPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : proc.progressPercent;

                return (
                  <div
                    key={proc.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {proc.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            calculatedPercent === 100
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {calculatedPercent === 100 ? '✅ Concluído' : '🟡 Em andamento'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {proc.category} • {proc.city} • Iniciado em {proc.date}
                        </span>
                      </div>

                      {/* Progress meter */}
                      <div className="text-right sm:w-48">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500">Progresso</span>
                          <span className="text-emerald-700">{calculatedPercent}% concluído</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-300"
                            style={{ width: `${calculatedPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step checklist toggles */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Passos do Processo (clique para marcar e actualizar):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {proc.steps.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => onToggleStep(proc.id, st.id)}
                            className={`p-2.5 rounded-lg border text-xs font-medium text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                              st.completed
                                ? 'bg-white border-emerald-300 text-slate-800 font-semibold'
                                : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {st.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <span className={st.completed ? 'line-through text-slate-400' : ''}>
                              {st.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Requests & Tickets Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Solicitações de Assistência Remota & Fazer Por Mim</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Alertas em tempo real ativam automaticamente sempre que o estado é alterado para "Resolvido".
                </p>
              </div>
              <span className="text-xs text-slate-400">
                {tickets.length} solicitação(ões) ({resolvedTickets.length} resolvidas)
              </span>
            </div>

            {/* Quick Interactive Testing Banner */}
            <div className="p-3.5 rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-950 block">
                    Sistema de Notificações em Tempo Real
                  </span>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    {pendingTickets.length > 0 
                      ? `${pendingTickets.length} pedido(s) em processamento aguardando resolução.` 
                      : 'Todos os pedidos estão actualmente resolvidos.'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {pendingTickets.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => handleSimulateResolution(pendingTickets[0])}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Simular Resolução (#{pendingTickets[0].id})</span>
                  </button>
                ) : (
                  resolvedTickets.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleResetForTesting(resolvedTickets[0])}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Repor (#{resolvedTickets[0].id}) p/ Testar</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {tickets.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Ainda não tem pedidos de assistência activos.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {tickets.map((t) => {
                  const isHighlighted = highlightedTicketId === t.id;

                  return (
                    <div
                      key={t.id}
                      ref={(el) => { ticketRowRefs.current.set(t.id, el); }}
                      className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-500 ${
                        isHighlighted
                          ? 'bg-emerald-50/90 ring-2 ring-emerald-500 shadow-md'
                          : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-extrabold text-sm text-slate-900 font-mono">
                            #{t.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                            t.status === 'Resolvido'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs'
                              : t.status === 'Em análise'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {t.status === 'Resolvido' && '🟢 '}
                            {t.status === 'Em análise' && '🔵 '}
                            {t.status === 'Aguardando assistência' && '🟡 '}
                            {t.status}
                          </span>

                          {isHighlighted && (
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wide bg-emerald-100/80 px-2 py-0.5 rounded-md animate-pulse">
                              ✨ Actualizado Agora
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          {t.serviceTitle}
                        </p>
                        <span className="text-[11px] text-slate-400">
                          {t.city} • {t.amountMT} MT ({t.paymentMethod.toUpperCase()}) • {t.createdAt}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="text-xs text-slate-500 max-w-xs md:text-right">
                          <p className="italic text-[11px] text-slate-600 line-clamp-2">
                            “{t.details}”
                          </p>
                        </div>

                        {/* Interactive testing actions */}
                        <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-auto">
                          {t.status !== 'Resolvido' ? (
                            <button
                              type="button"
                              onClick={() => handleSimulateResolution(t)}
                              title="Marcar como Resolvido para testar o alerta toast em tempo real"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Simular Resolução</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleResetForTesting(t)}
                              title="Repor para 'Em análise' a fim de permitir re-testar o alerta toast"
                              className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Reabrir p/ Teste</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Real-time Toast Notification overlay rendered inside the UserDashboardModal */}
        <TicketToastNotification
          toasts={toasts}
          onDismiss={handleDismissToast}
          onViewTicket={handleViewTicket}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />

      </div>
    </div>
  );
};

