import { UserProcess, Professional } from '../types';

export const INITIAL_PROBLEMS_20 = [
  { id: '1', title: 'Abrir empresa', category: 'Negócios', icon: 'Building2', query: 'Quero abrir uma empresa em Moçambique' },
  { id: '2', title: 'Registar negócio', category: 'Negócios', icon: 'FileSpreadsheet', query: 'Quero registar um negócio individual ou informal' },
  { id: '3', title: 'Encontrar emprego', category: 'Emprego', icon: 'Briefcase', query: 'Quero encontrar emprego em Maputo ou Matola' },
  { id: '4', title: 'Fazer CV profissional', category: 'Emprego', icon: 'FileText', query: 'Preciso de um currículo profissional no formato moçambicano' },
  { id: '5', title: 'Carta de candidatura', category: 'Emprego', icon: 'Mail', query: 'Preciso de uma carta de candidatura formal para emprego' },
  { id: '6', title: 'Arrendar casa', category: 'Habitação', icon: 'Home', query: 'Procuro uma casa para arrendar em Maputo com segurança' },
  { id: '7', title: 'Comprar casa / DUAT', category: 'Habitação', icon: 'LandPlot', query: 'Quero comprar uma casa ou verificar o DUAT do terreno' },
  { id: '8', title: 'Importar carro', category: 'Automóveis', icon: 'Ship', query: 'Quero importar um carro do Japão pelo Porto de Maputo' },
  { id: '9', title: 'Comprar carro local', category: 'Automóveis', icon: 'Car', query: 'Quero comprar um carro em Moçambique e transferir propriedade no INATRO' },
  { id: '10', title: 'Encontrar contabilista', category: 'Profissionais', icon: 'Calculator', query: 'Quero encontrar um contabilista certificado pela OCAM' },
  { id: '11', title: 'Encontrar advogado', category: 'Profissionais', icon: 'Scale', query: 'Quero encontrar um advogado da OAM para contratos' },
  { id: '12', title: 'Contratar trabalhador', category: 'Serviços', icon: 'UserCheck', query: 'Preciso contratar uma empregada doméstica ou trabalhador e inscrever no INSS' },
  { id: '13', title: 'Criar contrato', category: 'Documentos', icon: 'FileSignature', query: 'Preciso de uma minuta de contrato de trabalho ou arrendamento' },
  { id: '14', title: 'Encontrar eletricista', category: 'Profissionais', icon: 'Zap', query: 'Preciso de um eletricista qualificado para instalação e manutenção' },
  { id: '15', title: 'Encontrar canalizador', category: 'Profissionais', icon: 'Wrench', query: 'Preciso de um canalizador para tubagens e electrobomba' },
  { id: '16', title: 'Encontrar mecânico', category: 'Profissionais', icon: 'Cog', query: 'Procuro uma oficina ou mecânico de confiança em Maputo/Matola' },
  { id: '17', title: 'Abrir conta bancária', category: 'Finanças', icon: 'CreditCard', query: 'Quero abrir uma conta bancária comercial ou pessoal' },
  { id: '18', title: 'Encontrar escola', category: 'Educação', icon: 'GraduationCap', query: 'Procuro escolas primárias, secundárias ou creches de qualidade' },
  { id: '19', title: 'Organizar documentação', category: 'Documentos', icon: 'FolderArchive', query: 'Preciso autenticar documentos e reconhecer firmas em cartório' },
  { id: '20', title: 'Renovar BI / Identificação', category: 'Documentos', icon: 'IdCard', query: 'Preciso renovar o meu BI na Direcção de Identificação Civil' }
];

export const INITIAL_USER_PROCESSES: UserProcess[] = [
  {
    id: 'proc-1',
    title: 'Abertura de Empresa (Sociedade por Quotas)',
    category: 'Negócios',
    city: 'Maputo',
    progressPercent: 60,
    status: 'Em andamento',
    date: '06 Out 2026',
    steps: [
      { id: 's1', title: 'Definir tipo de empresa e sócios', completed: true },
      { id: 's2', title: 'Certidão negativa de nome no BAU/CREL', completed: true },
      { id: 's3', title: 'Elaboração e depósito dos estatutos', completed: true },
      { id: 's4', title: 'Obtenção de NUIT fiscal da empresa', completed: false },
      { id: 's5', title: 'Licenciamento / Alvará simplificado', completed: false }
    ]
  },
  {
    id: 'proc-2',
    title: 'Arrendamento de Apartamento T2',
    category: 'Habitação',
    city: 'Maputo (Alto Maé)',
    progressPercent: 40,
    status: 'Em andamento',
    date: '04 Out 2026',
    steps: [
      { id: 's1', title: 'Visita presencial e verificação de água/luz', completed: true },
      { id: 's2', title: 'Minuta de contrato com termo de caução', completed: true },
      { id: 's3', title: 'Reconhecimento de firmas no Notário', completed: false },
      { id: 's4', title: 'Inventário e entrega das chaves', completed: false }
    ]
  },
  {
    id: 'proc-3',
    title: 'Elaboração de Currículo e Carta',
    category: 'Emprego',
    city: 'Matola',
    progressPercent: 100,
    status: 'Concluído',
    date: '02 Out 2026',
    steps: [
      { id: 's1', title: 'Selecção do modelo moçambicano', completed: true },
      { id: 's2', title: 'Revisão ortográfica e dados de contacto', completed: true },
      { id: 's3', title: 'Exportação em PDF pronta para envio', completed: true }
    ]
  }
];

export const MOZAMBIQUE_INSTITUTIONS = [
  {
    name: 'Balcão de Atendimento Único (BAU Maputo)',
    role: 'Registo comercial, licenças e alvarás simplificados',
    location: 'Av. 25 de Setembro, Edifício Jat V / Baixa de Maputo',
    contact: '+258 21 320 000',
    schedule: 'Seg - Sex: 07:30 às 15:30'
  },
  {
    name: 'Autoridade Tributária de Moçambique (AT)',
    role: 'Emissão de NUIT, declaração fiscal e impostos',
    location: 'Delegações Fiscais em todas as capitais provinciais e postos de atendimento',
    contact: 'Linha Verde AT: 800 111 222',
    schedule: 'Seg - Sex: 07:30 às 15:30'
  },
  {
    name: 'Direcção Nacional de Identificação Civil (DIC)',
    role: 'Emissão e renovação de Bilhete de Identidade (BI)',
    location: 'Av. 24 de Julho (Central), Zimpeto, Matola e sedes distritais',
    contact: 'Atendimento presencial',
    schedule: 'Seg - Sex: 07:00 às 15:00'
  },
  {
    name: 'Instituto Nacional dos Transportes Terrestres (INATRO)',
    role: 'Matrículas, cartas de condução, inspecção e livretes',
    location: 'Av. do Trabalho / Machava (Matola) e capitais provinciais',
    contact: 'Delegações provinciais',
    schedule: 'Seg - Sex: 07:30 às 15:30'
  },
  {
    name: 'Instituto Nacional de Segurança Social (INSS)',
    role: 'Inscrição de empresas, trabalhadores e previdência social',
    location: 'Delegações provinciais e distritais em todo o país',
    contact: '+258 21 350 400',
    schedule: 'Seg - Sex: 07:30 às 15:30'
  }
];

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-1',
    name: 'Dr. Tomás Macuácua',
    category: 'Contabilidade & Fiscalidade',
    rating: 4.9,
    reviewsCount: 38,
    city: 'Maputo',
    verified: true,
    shortBio: 'Contabilista certificado pela OCAM com 12 anos de experiência em pequenas empresas e conformidade com AT.',
    phone: '+258 84 551 2234',
    whatsapp: '+258 84 551 2234',
    priceStartingMT: 1500,
    featured: true
  },
  {
    id: 'prof-2',
    name: 'Dra. Elsa Cossa',
    category: 'Direito & Contratos',
    rating: 4.8,
    reviewsCount: 29,
    city: 'Maputo',
    verified: true,
    shortBio: 'Advogada inscrita na OAM. Especialista em contratos de arrendamento, trabalho e constituição societária.',
    phone: '+258 82 443 9988',
    whatsapp: '+258 82 443 9988',
    priceStartingMT: 2000,
    featured: true
  },
  {
    id: 'prof-3',
    name: 'Mateus Tembe',
    category: 'Eletricista Certificado',
    rating: 4.9,
    reviewsCount: 54,
    city: 'Matola / Maputo',
    verified: true,
    shortBio: 'Técnico de instalações elétricas residenciais e comerciais, manutenção de quadros e conformidade EDM.',
    phone: '+258 84 312 7766',
    whatsapp: '+258 84 312 7766',
    priceStartingMT: 500,
    featured: true
  },
  {
    id: 'prof-4',
    name: 'Armando Sitoe',
    category: 'Despachante Aduaneiro',
    rating: 4.7,
    reviewsCount: 21,
    city: 'Maputo',
    verified: true,
    shortBio: 'Despachante oficial credenciado pela Autoridade Tributária. Desembaraço aduaneiro na JUE no Porto de Maputo.',
    phone: '+258 86 776 5544',
    whatsapp: '+258 86 776 5544',
    priceStartingMT: 2500,
    featured: false
  },
  {
    id: 'prof-5',
    name: 'Gervásio Langa',
    category: 'Canalizador & Bombas',
    rating: 4.8,
    reviewsCount: 42,
    city: 'Maputo',
    verified: true,
    shortBio: 'Instalação e reparação de tubagens, electrobombas, reservatórios de água e esgotos na Grande Maputo.',
    phone: '+258 84 990 1122',
    whatsapp: '+258 84 990 1122',
    priceStartingMT: 600,
    featured: false
  },
  {
    id: 'prof-6',
    name: 'Beatriz Lhate',
    category: 'Recrutamento & CV',
    rating: 4.9,
    reviewsCount: 65,
    city: 'Nampula / Remoto',
    verified: true,
    shortBio: 'Especialista em RH moçambicano, estruturação de currículos padrão e cartas de candidatura formal.',
    phone: '+258 87 234 5678',
    whatsapp: '+258 87 234 5678',
    priceStartingMT: 300,
    featured: true
  }
];
