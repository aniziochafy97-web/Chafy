import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin, 
  DollarSign, 
  AlertCircle, 
  FileText, 
  Download, 
  BookmarkPlus, 
  ArrowRight, 
  ArrowLeft, 
  Home, 
  Sparkles, 
  PhoneCall, 
  ShieldCheck, 
  Printer 
} from 'lucide-react';
import { Question, ActionPlan, PlanStep, UserProcess } from '../types';

interface AssistantFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery: string;
  onOrderAssistance: (planTitle: string, category: string, city: string, planType: 'ajuda_remota' | 'fazer_por_mim', amountMT: number) => void;
  onSaveToMyProcesses: (newProcess: UserProcess) => void;
}

export const AssistantFlowModal: React.FC<AssistantFlowModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  onOrderAssistance,
  onSaveToMyProcesses,
}) => {
  const [step, setStep] = useState<'input' | 'questions' | 'loading' | 'plan'>('input');
  const [query, setQuery] = useState(initialQuery);
  const [analyzingMessage, setAnalyzingMessage] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentKey, setCurrentKey] = useState<string>('');
  const [recognizedCategory, setRecognizedCategory] = useState<string>('Geral');
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (isOpen && initialQuery) {
      setQuery(initialQuery);
      handleAnalyzeQuery(initialQuery);
    } else if (isOpen && !initialQuery) {
      setStep('input');
      setPlan(null);
      setQuestions([]);
      setAnswers({});
    }
  }, [isOpen, initialQuery]);

  const handleAnalyzeQuery = async (userQuery: string) => {
    setIsLoading(true);
    setStep('loading');
    setAnalyzingMessage('A analisar o seu pedido e a identificar procedimentos em Moçambique...');
    
    try {
      const res = await fetch('/api/assistant/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      });
      const data = await res.json();
      
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentKey(data.key || '');
        setRecognizedCategory(data.recognizedCategory || 'Geral');
        setAnalyzingMessage(data.message || 'Claro. Vou ajudá-lo a organizar isso.');
        // Set default answers if needed
        const initialAnswers: Record<string, string> = {};
        data.questions.forEach((q: Question) => {
          if (q.options && q.options.length > 0) {
            initialAnswers[q.id] = q.options[0];
          }
        });
        setAnswers(initialAnswers);
        setStep('questions');
      } else {
        // Direct plan generation
        await handleGeneratePlan(data.key, userQuery, {});
      }
    } catch (e) {
      console.error(e);
      // Fallback questions
      setQuestions([
        {
          id: 'cidade',
          label: 'Em que cidade de Moçambique pretende resolver?',
          options: ['Maputo', 'Matola', 'Beira', 'Nampula', 'Tete', 'Outra']
        }
      ]);
      setAnswers({ cidade: 'Maputo' });
      setStep('questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async (key: string, originalQuery: string, userAnswers: Record<string, string>) => {
    setIsLoading(true);
    setStep('loading');
    setAnalyzingMessage('A estruturar o seu plano de acção oficial com passos, custos e checklist...');

    try {
      const res = await fetch('/api/assistant/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          query: originalQuery,
          answers: userAnswers
        })
      });
      const planData: ActionPlan = await res.json();
      setPlan(planData);
      
      // Initialize checklist state
      const initialChecked: Record<string, boolean> = {};
      planData.steps.forEach((s, sIdx) => {
        if (s.checklist) {
          s.checklist.forEach((item, cIdx) => {
            initialChecked[`${sIdx}-${cIdx}`] = false;
          });
        }
      });
      setCheckedItems(initialChecked);
      setStep('plan');
    } catch (err) {
      console.error(err);
      alert('Não foi possível gerar o plano completo. Por favor, tente novamente.');
      setStep('questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveToDashboard = () => {
    if (!plan) return;
    const allChecklistItems: string[] = [];
    plan.steps.forEach(s => {
      if (s.checklist) allChecklistItems.push(...s.checklist);
      else if (s.whatYouNeed) allChecklistItems.push(...s.whatYouNeed);
    });

    const newProc: UserProcess = {
      id: `proc-${Date.now()}`,
      title: plan.title,
      category: recognizedCategory,
      city: plan.summary?.cidade || answers?.cidade || 'Maputo',
      progressPercent: 15,
      status: 'Em andamento',
      date: 'Hoje',
      steps: allChecklistItems.slice(0, 5).map((item, idx) => ({
        id: `s-${idx}`,
        title: item,
        completed: idx === 0
      }))
    };

    onSaveToMyProcesses(newProc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

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
        
        {/* Modal Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0 gap-3">
          <div className="flex items-center gap-3">
            {/* Context-aware Back Button */}
            {step === 'questions' && (
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:border-slate-300"
                title="Recuar para a pesquisa"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>Recuar</span>
              </button>
            )}

            {step === 'plan' && (
              <button
                type="button"
                onClick={() => setStep('questions')}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:border-slate-300"
                title="Recuar às perguntas"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                <span>Recuar</span>
              </button>
            )}

            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-lg shadow-sm">
              C
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Assistente Chafy mz 🇲🇿
              </h2>
              <p className="text-xs text-slate-500">
                Orientação prática personalizada para Moçambique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-slate-200/60"
              title="Voltar à Página Inicial"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Página Inicial</span>
            </button>
            <button
              onClick={onClose}
              title="Fechar (Esc)"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: Initial Input (if opened empty) */}
          {step === 'input' && (
            <div className="space-y-6 py-4">
              <div className="text-center max-w-md mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  O que precisa de resolver hoje?
                </h3>
                <p className="text-sm text-slate-600">
                  Escreva em linguagem natural. Nós identificamos as instituições, requisitos e documentos necessários.
                </p>
              </div>

              <div className="max-w-xl mx-auto">
                <textarea
                  rows={4}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Exemplo: Quero abrir uma empresa em Maputo de prestação de serviços com 2 sócios..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 text-sm font-medium focus:outline-hidden"
                />
                <button
                  onClick={() => query.trim() && handleAnalyzeQuery(query.trim())}
                  disabled={!query.trim()}
                  className="w-full mt-3 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Continuar para o plano</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {step === 'loading' && (
            <div className="py-16 text-center space-y-4">
              <div className="inline-block p-4 rounded-2xl bg-emerald-50 text-emerald-700 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {analyzingMessage || 'A processar o pedido...'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                A consultar procedimentos no Balcão de Atendimento Único (BAU), Autoridade Tributária e legislação moçambicana.
              </p>
            </div>
          )}

          {/* STEP 2: Clarifying Questions */}
          {step === 'questions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-700 text-white mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {analyzingMessage || 'Claro. Vou ajudá-lo a organizar isso.'}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Responda a estas questões curtas para adaptarmos com precisão as instituições e taxas ao seu caso:
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3 p-4 rounded-xl border border-slate-200 bg-white">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{q.label}</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, opt)}
                            className={`p-3 text-left rounded-lg text-xs font-semibold border transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                                : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>Recuar / Alterar Pedido</span>
                </button>

                <button
                  onClick={() => handleGeneratePlan(currentKey, query, answers)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <span>Gerar Plano de Acção Personalizado</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Personalized Action Plan */}
          {step === 'plan' && plan && (
            <div className="space-y-8 animate-fade-in print:text-black">
              
              {/* Plan Title & Summary */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Plano Personalizado • Moçambique
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                      {plan.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={handlePrint}
                      className="p-2 sm:px-3 sm:py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                      title="Imprimir ou Salvar PDF"
                    >
                      <Printer className="w-4 h-4 text-slate-500" />
                      <span className="hidden sm:inline">Imprimir / PDF</span>
                    </button>
                    <button
                      onClick={handleSaveToDashboard}
                      className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span>{savedSuccess ? 'Guardado!' : 'Guardar nos Meus Processos'}</span>
                    </button>
                  </div>
                </div>

                {/* Summary Metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-800">Resumo:</span>
                  {Object.entries(plan.summary || {}).map(([k, v]) => (
                    <span key={k} className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                      <span className="text-slate-400 capitalize">{k}:</span>
                      <strong className="text-slate-800 font-semibold">{String(v)}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Numbered Steps */}
              <div className="space-y-6">
                {plan.steps.map((s, stepIdx) => (
                  <div key={s.number} className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                          {s.number}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {s.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {s.explanation}
                    </p>

                    {/* What you need list */}
                    {s.whatYouNeed && s.whatYouNeed.length > 0 && (
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          O que precisa de reunir:
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {s.whatYouNeed.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive Checklist if present */}
                    {s.checklist && s.checklist.length > 0 && (
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                            Checklist de Documentação Obrigatória:
                          </h4>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            Clique para marcar
                          </span>
                        </div>
                        <div className="space-y-2">
                          {s.checklist.map((item, cIdx) => {
                            const isDone = !!checkedItems[`${stepIdx}-${cIdx}`];
                            return (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() => toggleCheck(`${stepIdx}-${cIdx}`)}
                                className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 line-through'
                                    : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Logistics metadata badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                      {s.whereToGo && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Onde tratar</span>
                            <span className="text-slate-800 font-semibold leading-tight">{s.whereToGo}</span>
                          </div>
                        </div>
                      )}

                      {s.estimatedTime && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Tempo estimado</span>
                            <span className="text-slate-800 font-semibold leading-tight">{s.estimatedTime}</span>
                          </div>
                        </div>
                      )}

                      {s.cost && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Custo oficial</span>
                            <span className="text-slate-800 font-semibold leading-tight">{s.cost}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reliability tag */}
                    {s.reliability && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fonte: {s.reliability}</span>
                      </div>
                    )}

                  </div>
                ))}
              </div>

              {/* Official Reliability Disclaimer Banner */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Regra de Confiabilidade Assistente Chafy mz:</strong> Informações baseadas em procedimentos oficiais de Moçambique. Taxas municipais e prazos podem variar consoante o Município (Maputo, Matola, Beira, Nampula) e alterações legislativas.
                </div>
              </div>

              {/* SECTION: "Precisa que façamos por si?" (Assistente Remoto Humano) */}
              <div className="pt-6 border-t-2 border-slate-200 print:hidden">
                <div className="text-center max-w-xl mx-auto mb-6">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">
                    Assistente Remoto Humano
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Precisa que façamos por si?
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Não quer perder tempo em filas ou organizar documentos sozinho? Escolha o seu nível de apoio:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Opção 1: Faça Você Mesmo */}
                  <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-3">
                        🟢 FAÇA VOCÊ MESMO
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        Orientação Gratuita
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Siga o plano passo a passo sozinho com a nossa checklist e locais indicados.
                      </p>
                      <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-center gap-1.5">✓ Acesso a todo o plano</li>
                        <li className="flex items-center gap-1.5">✓ Checklist interactiva</li>
                        <li className="flex items-center gap-1.5">✓ Locais e contactos</li>
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="text-lg font-black text-slate-900 mb-3">
                        0 MT
                      </div>
                      <button
                        onClick={handleSaveToDashboard}
                        className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Continuar Sozinho
                      </button>
                    </div>
                  </div>

                  {/* Opção 2: Ajuda Remota */}
                  <div className="p-5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/30 relative flex flex-col justify-between shadow-md">
                    <div className="absolute -top-3 right-4 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Mais Popular
                    </div>
                    <div>
                      <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold mb-3">
                        🔵 AJUDA REMOTA
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        Assistente Chafy mz
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Um assistente pessoal ajuda a organizar documentos, preparar cartas, minutas e orientar todo o processo via WhatsApp e chamadas.
                      </p>
                      <ul className="mt-4 space-y-1.5 text-xs text-slate-700 font-medium">
                        <li className="flex items-center gap-1.5">✓ Preparação de minutas e cartas</li>
                        <li className="flex items-center gap-1.5">✓ Verificação prévia de documentos</li>
                        <li className="flex items-center gap-1.5">✓ Suporte directo no WhatsApp</li>
                        <li className="flex items-center gap-1.5 text-[11px] text-emerald-800">
                          📱 M-Pesa: 843610372 • e-Mola: 877610372
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-emerald-200">
                      <div className="text-lg font-black text-emerald-900 mb-3">
                        A partir de 150 MT
                      </div>
                      <button
                        onClick={() => onOrderAssistance(plan.title, recognizedCategory, plan.summary?.cidade || 'Maputo', 'ajuda_remota', 150)}
                        className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Pedir Ajuda Remota (150 MT)
                      </button>
                    </div>
                  </div>

                  {/* Opção 3: Resolva Por Mim */}
                  <div className="p-5 rounded-2xl border-2 border-purple-200 bg-white hover:border-purple-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 text-[11px] font-bold mb-3">
                        🟣 RESOLVA POR MIM
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        Serviço Completo
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Ligamos o seu caso a profissionais credenciados ou equipa de campo para tratar do processo chave-na-mão.
                      </p>
                      <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-center gap-1.5">✓ Deslocação e submissão</li>
                        <li className="flex items-center gap-1.5">✓ Levantamento de certidões/alvarás</li>
                        <li className="flex items-center gap-1.5">✓ Entrega em mão ou correio</li>
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="text-lg font-black text-purple-900 mb-3">
                        Orçamento Personalizado
                      </div>
                      <button
                        onClick={() => onOrderAssistance(plan.title, recognizedCategory, plan.summary?.cidade || 'Maputo', 'fazer_por_mim', 800)}
                        className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Solicitar Orçamento
                      </button>
                    </div>
                  </div>

                </div>

                {/* Backtrack / Return to Home Navigation Bar */}
                <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setStep('questions')}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs w-full sm:w-auto"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                      <span>Recuar e Ajustar Perguntas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStep('input'); setPlan(null); }}
                      className="px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold transition-colors cursor-pointer hidden md:inline-flex"
                    >
                      Nova Pesquisa
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-300" />
                    <span>Voltar à Página Inicial</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
