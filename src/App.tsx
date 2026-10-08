import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PopularProblemsSection } from './components/PopularProblemsSection';
import { ServicesSection } from './components/ServicesSection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import { AssistantFlowModal } from './components/AssistantFlowModal';
import { OrderHelpModal } from './components/OrderHelpModal';
import { ProRegistrationModal } from './components/ProRegistrationModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

import { UserProcess, Ticket, Professional } from './types';
import { 
  INITIAL_USER_PROCESSES, 
  INITIAL_PROFESSIONALS, 
  MOZAMBIQUE_INSTITUTIONS 
} from './data/mockData';

export default function App() {
  // Modal states
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');
  
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [proRegisterOpen, setProRegisterOpen] = useState(false);

  // Order modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderParams, setOrderParams] = useState<{
    serviceTitle: string;
    category: string;
    city: string;
    planType: 'ajuda_remota' | 'fazer_por_mim';
    amountMT: number;
  }>({
    serviceTitle: 'Assistência Remota',
    category: 'Geral',
    city: 'Maputo',
    planType: 'ajuda_remota',
    amountMT: 150
  });

  // Data states
  const [processes, setProcesses] = useState<UserProcess[]>(() => {
    const saved = localStorage.getItem('rmz_processes');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROCESSES;
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  const [institutions, setInstitutions] = useState(MOZAMBIQUE_INSTITUTIONS);

  // Sync processes to localStorage
  useEffect(() => {
    localStorage.setItem('rmz_processes', JSON.stringify(processes));
  }, [processes]);

  // Fetch initial tickets and professionals from server with continuous real-time polling
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [ticketsRes, profsRes] = await Promise.all([
          fetch('/api/tickets'),
          fetch('/api/professionals')
        ]);
        if (ticketsRes.ok && isMounted) {
          const tData = await ticketsRes.json();
          if (Array.isArray(tData)) setTickets(tData);
        }
        if (profsRes.ok && isMounted) {
          const pData = await profsRes.json();
          if (Array.isArray(pData) && pData.length > 0) setProfessionals(pData);
        }
      } catch (err) {
        console.error('Initial fetch fallback to local defaults:', err);
      }
    };
    fetchData();

    // Real-time polling for tickets every 3 seconds to sync status changes across users/admin
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/tickets');
        if (res.ok && isMounted) {
          const latestTickets = await res.json();
          if (Array.isArray(latestTickets)) {
            setTickets((prev) => {
              // Only update state if ticket statuses or tickets list actually changed
              const isDifferent = latestTickets.some((nt: Ticket) => {
                const existing = prev.find(ot => ot.id === nt.id);
                return !existing || existing.status !== nt.status;
              }) || latestTickets.length !== prev.length;

              return isDifferent ? latestTickets : prev;
            });
          }
        }
      } catch {
        // Silently tolerate temporary polling connection hiccups
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Handlers
  const handleOpenAssistant = (initialQuery: string = '') => {
    setAssistantQuery(initialQuery);
    setAssistantModalOpen(true);
  };

  const handleOrderAssistance = (
    serviceTitle: string,
    category: string,
    city: string,
    planType: 'ajuda_remota' | 'fazer_por_mim',
    amountMT: number
  ) => {
    setOrderParams({
      serviceTitle,
      category,
      city,
      planType,
      amountMT
    });
    setOrderModalOpen(true);
  };

  const handleSaveToMyProcesses = (newProc: UserProcess) => {
    setProcesses(prev => [newProc, ...prev]);
  };

  const handleToggleStep = (processId: string, stepId: string) => {
    setProcesses(prev => prev.map(proc => {
      if (proc.id !== processId) return proc;
      const updatedSteps = proc.steps.map(s => {
        if (s.id !== stepId) return s;
        return { ...s, completed: !s.completed };
      });
      const completedCount = updatedSteps.filter(s => s.completed).length;
      const progressPercent = updatedSteps.length > 0 
        ? Math.round((completedCount / updatedSteps.length) * 100) 
        : proc.progressPercent;
      const status = progressPercent === 100 ? 'Concluído' : 'Em andamento';
      return {
        ...proc,
        steps: updatedSteps,
        progressPercent,
        status
      };
    }));
  };

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleUpdateTicketStatus = async (id: string, status: 'Aguardando assistência' | 'Em análise' | 'Resolvido') => {
    try {
      const res = await fetch('/api/tickets/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      }
    } catch (err) {
      console.error(err);
      // Fallback update in state
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    }
  };

  const handleAddInstitution = (inst: typeof MOZAMBIQUE_INSTITUTIONS[0]) => {
    setInstitutions(prev => [inst, ...prev]);
  };

  const handleRegisteredPro = (newProf: Professional) => {
    setProfessionals(prev => [newProf, ...prev]);
  };

  const handleRequestLead = (prof: Professional) => {
    handleOrderAssistance(
      `Contacto e Orçamento com ${prof.name}`,
      prof.category,
      prof.city,
      'ajuda_remota',
      prof.priceStartingMT
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* Header */}
      <Header
        onOpenAssistant={handleOpenAssistant}
        onOpenDashboard={() => setDashboardOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        activeProcessesCount={processes.filter(p => p.status === 'Em andamento').length}
        professionals={professionals}
        onSelectService={(serviceTitle, category, amountMT) => {
          handleOrderAssistance(serviceTitle, category, 'Maputo', 'ajuda_remota', amountMT);
        }}
        onRequestLead={handleRequestLead}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onStartSearch={handleOpenAssistant} />

        {/* 20 Popular Problems Grid */}
        <PopularProblemsSection onSelectProblem={handleOpenAssistant} />

        {/* Paid & Remote Services Section */}
        <ServicesSection
          onSelectService={(serviceTitle, category, amountMT) => {
            handleOrderAssistance(serviceTitle, category, 'Maputo', 'ajuda_remota', amountMT);
          }}
        />

        {/* Verified Professionals Marketplace */}
        <MarketplaceSection
          professionals={professionals}
          onOpenProRegister={() => setProRegisterOpen(true)}
          onRequestLead={handleRequestLead}
        />

        {/* Transparent Pricing Section */}
        <PricingSection
          onSelectFree={() => handleOpenAssistant()}
          onSelectResolvePlus={() => handleOrderAssistance('Subscrição Resolve+ Mensal', 'Subscrição', 'Moçambique', 'ajuda_remota', 150)}
          onSelectAssistance={() => handleOrderAssistance('Assistência Remota Dedicada', 'Geral', 'Maputo', 'ajuda_remota', 300)}
        />
      </main>

      {/* Footer with Anizio Francio Chafy attribution */}
      <Footer
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenAssistant={() => handleOpenAssistant()}
      />

      {/* Interactive Core Assistant Flow Modal */}
      <AssistantFlowModal
        isOpen={assistantModalOpen}
        onClose={() => setAssistantModalOpen(false)}
        initialQuery={assistantQuery}
        onOrderAssistance={handleOrderAssistance}
        onSaveToMyProcesses={handleSaveToMyProcesses}
      />

      {/* Order Help Modal (M-Pesa / e-Mola / Tickets RMZ-XXXX) */}
      <OrderHelpModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        serviceTitle={orderParams.serviceTitle}
        category={orderParams.category}
        city={orderParams.city}
        planType={orderParams.planType}
        amountMT={orderParams.amountMT}
        onTicketCreated={handleTicketCreated}
        onReturnHome={() => {
          setOrderModalOpen(false);
          setAssistantModalOpen(false);
        }}
        onViewDashboard={() => {
          setOrderModalOpen(false);
          setAssistantModalOpen(false);
          setDashboardOpen(true);
        }}
      />

      {/* Professional Registration Modal ("É profissional?") */}
      <ProRegistrationModal
        isOpen={proRegisterOpen}
        onClose={() => setProRegisterOpen(false)}
        onRegistered={handleRegisteredPro}
      />

      {/* User Dashboard Modal ("Meus Processos") */}
      <UserDashboardModal
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        processes={processes}
        tickets={tickets}
        onToggleStep={handleToggleStep}
        onStartNewProblem={() => handleOpenAssistant()}
        onUpdateTicketStatus={handleUpdateTicketStatus}
      />

      {/* Administrator Console Modal */}
      <AdminDashboardModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        tickets={tickets}
        onUpdateTicketStatus={handleUpdateTicketStatus}
        institutions={institutions}
        onAddInstitution={handleAddInstitution}
      />

    </div>
  );
}
