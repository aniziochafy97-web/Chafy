export interface Question {
  id: string;
  label: string;
  options: string[];
}

export interface PlanStep {
  number: number;
  title: string;
  explanation: string;
  whatYouNeed?: string[];
  checklist?: string[];
  whereToGo: string;
  estimatedTime?: string;
  cost?: string;
  reliability?: string;
  contacts?: string;
}

export interface ActionPlan {
  title: string;
  summary: {
    cidade?: string;
    tipo?: string;
    estrutura?: string;
    detalhes?: string;
    [key: string]: any;
  };
  steps: PlanStep[];
  officialNotice?: string;
}

export interface Ticket {
  id: string;
  userEmail: string;
  userName: string;
  serviceTitle: string;
  category: string;
  city: string;
  planType: 'ajuda_remota' | 'fazer_por_mim';
  amountMT: number;
  paymentMethod: 'mpesa' | 'emola' | 'mkesh' | 'cartao' | 'banco';
  paymentPhone?: string;
  status: 'Aguardando assistência' | 'Em análise' | 'Resolvido';
  createdAt: string;
  details: string;
}

export interface Professional {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  city: string;
  verified: boolean;
  shortBio: string;
  phone: string;
  whatsapp: string;
  priceStartingMT: number;
  featured: boolean;
}

export interface UserProcess {
  id: string;
  title: string;
  category: string;
  city: string;
  progressPercent: number;
  status: 'Em andamento' | 'Concluído' | 'Pendente';
  steps: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  date: string;
}
