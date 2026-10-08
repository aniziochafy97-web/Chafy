import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, X, Volume2, VolumeX, Sparkles, ArrowRight, Bell, ShieldCheck } from 'lucide-react';
import { Ticket } from '../types';

export interface ToastItem {
  id: string;
  ticket: Ticket;
  resolvedAt: string;
  previousStatus?: string;
}

interface TicketToastNotificationProps {
  toasts: ToastItem[];
  onDismiss: (toastId: string) => void;
  onViewTicket: (ticketId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// Gentle Web Audio API chime - zero latency, completely offline and self-contained
export function playResolutionChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // First harmonized note (F#5: 739.99 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second celebratory note (A5: 880 Hz -> D6: 1174 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3);
    gain2.gain.setValueAtTime(0.25, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.65);
  } catch {
    // Non-blocking fallback if browser audio context is blocked
  }
}

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (toastId: string) => void;
  onViewTicket: (ticketId: string) => void;
  duration?: number;
}

const SingleToastCard: React.FC<ToastCardProps> = ({
  toast,
  onDismiss,
  onViewTicket,
  duration = 7000
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);

  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now();
    const totalRemaining = remainingTimeRef.current;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const timeLeft = Math.max(0, totalRemaining - elapsed);
      const pct = (timeLeft / duration) * 100;
      setProgress(pct);

      if (timeLeft <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      remainingTimeRef.current = Math.max(0, totalRemaining - (Date.now() - startTimeRef.current));
    };
  }, [isPaused, duration, toast.id, onDismiss]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="assertive"
      className="relative w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl border-2 border-emerald-500 shadow-2xl shadow-emerald-700/20 overflow-hidden transform transition-all duration-300 animate-in slide-in-from-right-5 fade-in hover:shadow-emerald-600/30"
    >
      {/* Top ambient color glow accent */}
      <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600" />

      <div className="p-4 sm:p-5">
        {/* Top Header Row with status badge and dismiss button */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              PEDIDO RESOLVIDO
            </span>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Tempo Real • {toast.resolvedAt}
            </span>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            title="Fechar notificação"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core content body */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-950 font-mono tracking-tight bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                #{toast.ticket.id}
              </span>
              <span className="text-xs font-bold text-slate-500 truncate">
                • {toast.ticket.city}
              </span>
            </div>

            <h4 className="text-sm font-black text-slate-900 mt-1 leading-snug line-clamp-1">
              {toast.ticket.serviceTitle}
            </h4>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              O seu pedido foi concluído com sucesso pela equipa de assistência em Moçambique! Todos os documentos e etapas foram validados.
            </p>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-[11px] font-bold text-slate-500">
            Valor: <span className="text-emerald-700 font-extrabold">{toast.ticket.amountMT} MT</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onViewTicket(toast.ticket.id);
                onDismiss(toast.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Ver Pedido</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto dismiss countdown progress bar at bottom */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-emerald-600 transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const TicketToastNotification: React.FC<TicketToastNotificationProps> = ({
  toasts,
  onDismiss,
  onViewTicket,
  soundEnabled,
  onToggleSound,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none max-w-full">
      {/* Sound indicator helper badge */}
      <div className="pointer-events-auto flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold shadow-md">
        <span className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-emerald-400" />
          <span>Alertas em tempo real ({toasts.length})</span>
        </span>
        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Silenciar alertas sonoros' : 'Activar som dos alertas'}
          className="ml-1 p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Render each active toast notification */}
      <div className="space-y-3 pointer-events-auto flex flex-col items-end w-full">
        {toasts.map((toast) => (
          <SingleToastCard
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            onViewTicket={onViewTicket}
          />
        ))}
      </div>
    </div>
  );
};
