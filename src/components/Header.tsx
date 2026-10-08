import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Bell, 
  LayoutDashboard, 
  Shield, 
  Menu, 
  X, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  User, 
  MapPin, 
  Star, 
  FileText, 
  CornerDownLeft,
  Flame
} from 'lucide-react';
import { Professional } from '../types';
import { INITIAL_PROBLEMS_20 } from '../data/mockData';

interface HeaderProps {
  onOpenAssistant: (initialQuery?: string) => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  activeProcessesCount: number;
  professionals: Professional[];
  onSelectService?: (serviceTitle: string, category: string, amountMT: number) => void;
  onRequestLead?: (prof: Professional) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAssistant,
  onOpenDashboard,
  onOpenAdmin,
  activeProcessesCount,
  professionals,
  onSelectService,
  onRequestLead
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const notifications = [
    { id: 1, text: 'O seu processo de abertura de empresa tem 2 passos pendentes.', time: 'Há 2 horas', unread: true },
    { id: 2, text: 'Encontrámos 3 profissionais disponíveis em Maputo para o seu pedido.', time: 'Hoje, 09:30', unread: true },
    { id: 3, text: 'A sua solicitação #RMZ-1048 recebeu uma resposta do assistente.', time: 'Ontem', unread: false }
  ];

  // Core Service definitions for searching
  const coreServices = [
    { title: 'Documentos & Requerimentos', category: 'Documentos', price: 100, keywords: 'requerimento carta certidao contrato procuracao autenticacao' },
    { title: 'Empresas & Negócios no BAU', category: 'Empresas', price: 350, keywords: 'empresa bau nuit alvara sociedade estatutos comercio' },
    { title: 'Habitação & Arrendamento', category: 'Habitação', price: 250, keywords: 'casa arrendar quarto apartamento alugar duat imovel' },
    { title: 'Automóveis & Importação JUE', category: 'Automóveis', price: 450, keywords: 'carro importar viatura japao alfandega inatro livrete matricula' },
    { title: 'Emprego & Elaboração de CV', category: 'Emprego', price: 150, keywords: 'curriculo cv emprego carta candidatura vaga entrevista trabalho' },
    { title: 'Rede de Técnicos & Peritos', category: 'Profissionais', price: 200, keywords: 'eletricista canalizador contabilista advogado mecanico ocam oam' }
  ];

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setSearchFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanTerm = searchQuery.toLowerCase().trim();

  // Filter popular problems
  const filteredProblems = cleanTerm ? INITIAL_PROBLEMS_20.filter(p => 
    p.title.toLowerCase().includes(cleanTerm) || 
    p.category.toLowerCase().includes(cleanTerm) ||
    p.query.toLowerCase().includes(cleanTerm)
  ).slice(0, 4) : [];

  // Filter services
  const filteredServices = cleanTerm ? coreServices.filter(s =>
    s.title.toLowerCase().includes(cleanTerm) ||
    s.category.toLowerCase().includes(cleanTerm) ||
    s.keywords.toLowerCase().includes(cleanTerm)
  ).slice(0, 3) : [];

  // Filter professionals
  const filteredPros = cleanTerm ? professionals.filter(pr =>
    pr.name.toLowerCase().includes(cleanTerm) ||
    pr.category.toLowerCase().includes(cleanTerm) ||
    pr.city.toLowerCase().includes(cleanTerm) ||
    pr.shortBio.toLowerCase().includes(cleanTerm)
  ).slice(0, 3) : [];

  const hasResults = filteredProblems.length > 0 || filteredServices.length > 0 || filteredPros.length > 0;
  const isSearching = cleanTerm.length > 0 && searchFocused;

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProblem = (query: string) => {
    setSearchFocused(false);
    setSearchQuery('');
    onOpenAssistant(query);
  };

  const handleSelectServiceItem = (title: string, cat: string, price: number) => {
    setSearchFocused(false);
    setSearchQuery('');
    if (onSelectService) {
      onSelectService(title, cat, price);
    } else {
      onOpenAssistant(title);
    }
  };

  const handleSelectProItem = (prof: Professional) => {
    setSearchFocused(false);
    setSearchQuery('');
    if (onRequestLead) {
      onRequestLead(prof);
    } else {
      scrollTo('profissionais');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 transition-colors">
                C
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                    Assistente Chafy mz
                  </span>
                  <span className="text-xl" role="img" aria-label="Moçambique">🇲🇿</span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden lg:block">
                  Diga o que precisa. Nós mostramos como resolver.
                </p>
              </div>
            </button>
          </div>

          {/* Global Search Bar (Center with smooth expanding width animation) */}
          <div 
            ref={searchContainerRef} 
            className={`flex-1 relative hidden sm:block transition-all duration-300 ease-out ${
              searchFocused 
                ? 'max-w-lg lg:max-w-xl' 
                : 'max-w-xs md:max-w-sm lg:max-w-md'
            }`}
          >
            <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
              searchFocused 
                ? 'bg-white border-emerald-600 ring-3 ring-emerald-500/15 shadow-md shadow-emerald-950/5' 
                : 'bg-slate-100/90 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100'
            }`}>
              <Search className={`w-4 h-4 ml-3.5 transition-colors duration-200 shrink-0 ${
                searchFocused ? 'text-emerald-700' : 'text-slate-400'
              }`} />
              
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Pesquisar serviços, profissionais ou problemas..."
                className="w-full py-2.5 pl-2.5 pr-14 text-xs font-medium text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
              />
              
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  title="Limpar pesquisa"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="absolute right-2.5 flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-200/70 px-1.5 py-0.5 rounded-md pointer-events-none transition-opacity duration-200">
                  <span>⌘K</span>
                </div>
              )}
            </div>

            {/* Live Search Results Dropdown with Smooth Motion Transitions */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.985 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
                >
                  {hasResults ? (
                    <motion.div 
                      layout
                      className="p-3 space-y-3.5"
                    >
                      
                      {/* Category 1: Problemas Populares */}
                      {filteredProblems.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <Flame className="w-3.5 h-3.5 text-red-600" />
                            <span>Problemas Populares</span>
                          </div>
                          <div className="space-y-1">
                            {filteredProblems.map((p) => (
                              <motion.button
                                layout="position"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.16 }}
                                key={p.id}
                                onClick={() => handleSelectProblem(p.query)}
                                className="w-full p-2.5 rounded-xl hover:bg-emerald-50/70 text-left flex items-center justify-between group transition-all duration-150 cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-150">
                                    <Building2 className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 block">
                                      {p.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {p.category} • Abrir plano de acção
                                    </span>
                                  </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all duration-150" />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Category 2: Serviços Resolve MZ */}
                      {filteredServices.length > 0 && (
                        <div className="space-y-1 border-t border-slate-100 pt-2.5">
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Serviços & Documentos</span>
                          </div>
                          <div className="space-y-1">
                            {filteredServices.map((s, idx) => (
                              <motion.button
                                layout="position"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.16 }}
                                key={idx}
                                onClick={() => handleSelectServiceItem(s.title, s.category, s.price)}
                                className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between group transition-all duration-150 cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors duration-150">
                                    <FileText className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 block">
                                      {s.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {s.category} • A partir de {s.price} MT
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-150">
                                  Pedir Apoio
                                </span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Category 3: Profissionais Verificados */}
                      {filteredPros.length > 0 && (
                        <div className="space-y-1 border-t border-slate-100 pt-2.5">
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <User className="w-3.5 h-3.5 text-blue-600" />
                            <span>Profissionais Verificados</span>
                          </div>
                          <div className="space-y-1">
                            {filteredPros.map((pr) => (
                              <motion.button
                                layout="position"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.16 }}
                                key={pr.id}
                                onClick={() => handleSelectProItem(pr)}
                                className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between group transition-all duration-150 cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-150">
                                    {pr.name[0]}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                                        {pr.name}
                                      </span>
                                      <div className="flex items-center text-[10px] text-amber-700 bg-amber-50 px-1.5 rounded-sm">
                                        <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                                        <span>{pr.rating}</span>
                                      </div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                      <span>{pr.category}</span>
                                      <span>•</span>
                                      <MapPin className="w-2.5 h-2.5 text-slate-400 inline" />
                                      <span>{pr.city}</span>
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-semibold text-slate-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all duration-150">
                                  Pedir Orçamento →
                                </span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dynamic query fallback trigger */}
                      <div className="pt-2 border-t border-slate-100">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectProblem(searchQuery)}
                          className="w-full p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold flex items-center justify-between transition-colors duration-150 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-700" />
                            <span>Perguntar ao assistente: “{searchQuery}”</span>
                          </div>
                          <CornerDownLeft className="w-3.5 h-3.5 text-emerald-700" />
                        </motion.button>
                      </div>

                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 text-center space-y-3"
                    >
                      <p className="text-xs text-slate-500">
                        Não encontrámos itens correspondentes directos para <strong>"{searchQuery}"</strong>.
                      </p>
                      <button
                        onClick={() => handleSelectProblem(searchQuery)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors duration-150 cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gerar Plano de Resolução com o Assistente</span>
                      </button>
                    </motion.div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            <button 
              onClick={() => scrollTo('como-funciona')}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Como funciona
            </button>
            <button 
              onClick={() => scrollTo('servicos')}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollTo('profissionais')}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Profissionais
            </button>
            <button 
              onClick={() => scrollTo('precos')}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Preços
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notificações</span>
                      <span className="text-xs text-emerald-700 font-semibold">2 novas</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {notifications.map(n => (
                        <div key={n.id} className="py-3 text-xs flex gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                          <div>
                            <p className="text-slate-800 font-medium leading-relaxed">{n.text}</p>
                            <span className="text-slate-400 text-[11px]">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setNotificationsOpen(false); onOpenDashboard(); }}
                      className="w-full mt-2 py-2 text-center text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Ver Meus Processos
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dashboard shortcut */}
            <button
              onClick={onOpenDashboard}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-700" />
              <span>Meus Processos</span>
              <span className="ml-1 bg-emerald-700 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                {activeProcessesCount}
              </span>
            </button>

            {/* Admin shortcut */}
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors cursor-pointer"
              title="Painel de Controlo do Administrador"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => onOpenAssistant()}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <span className="hidden sm:inline">Resolver problema</span>
              <span className="sm:hidden">Resolver</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile search bar (under header on small screens) */}
        <div className="sm:hidden pb-3">
          <div className="relative flex items-center rounded-xl bg-slate-100 border border-slate-200 focus-within:border-emerald-600 focus-within:bg-white transition-colors duration-200">
            <Search className="w-4 h-4 ml-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Pesquisar serviços, profissionais ou problemas..."
              className="w-full py-2 pl-2 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 mr-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Mobile search dropdown with animation */}
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-2 space-y-2 max-h-72 overflow-y-auto"
              >
                {filteredProblems.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProblem(p.query)}
                    className="w-full p-2 text-left text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>{p.title}</span>
                    <span className="text-[10px] text-slate-400">{p.category}</span>
                  </button>
                ))}
                {filteredServices.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectServiceItem(s.title, s.category, s.price)}
                    className="w-full p-2 text-left text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>{s.title}</span>
                    <span className="text-[10px] text-emerald-700">{s.price} MT</span>
                  </button>
                ))}
                {filteredPros.map(pr => (
                  <button
                    key={pr.id}
                    onClick={() => handleSelectProItem(pr)}
                    className="w-full p-2 text-left text-xs font-semibold text-slate-800 hover:bg-emerald-50 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <span>{pr.name} ({pr.category})</span>
                    <span className="text-[10px] text-slate-400">{pr.city}</span>
                  </button>
                ))}
                <button
                  onClick={() => handleSelectProblem(searchQuery)}
                  className="w-full p-2 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-bold text-center block cursor-pointer"
                >
                  Perguntar ao assistente: “{searchQuery}” →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-slate-100 bg-white space-y-3 overflow-hidden"
            >
              <button
                onClick={() => scrollTo('como-funciona')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Como funciona
              </button>
              <button
                onClick={() => scrollTo('servicos')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollTo('profissionais')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Profissionais
              </button>
              <button
                onClick={() => scrollTo('precos')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Preços
              </button>
              <div className="pt-2 border-t border-slate-100 px-4 flex gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
                  className="flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
                >
                  Meus Processos ({activeProcessesCount})
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                  className="px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 rounded-lg cursor-pointer"
                >
                  Admin
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};
