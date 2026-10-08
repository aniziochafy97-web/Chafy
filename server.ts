import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// In-memory data store for persistent experience during session
interface Ticket {
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

interface Professional {
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

let tickets: Ticket[] = [
  {
    id: 'RMZ-1048',
    userEmail: 'aniziochafy97@gmail.com',
    userName: 'Amélia Mondlane',
    serviceTitle: 'Abertura de Empresa (Sociedade Unipessoal)',
    category: 'Empresas',
    city: 'Maputo',
    planType: 'ajuda_remota',
    amountMT: 350,
    paymentMethod: 'mpesa',
    paymentPhone: '843610372',
    status: 'Em análise',
    createdAt: '2026-10-07 14:30',
    details: 'Preparação de estatutos e acompanhamento no BAU Maputo.'
  },
  {
    id: 'RMZ-1047',
    userEmail: 'carlos.nhantumbo@gmail.com',
    userName: 'Carlos Nhantumbo',
    serviceTitle: 'Importação de Viatura do Japão via Porto de Maputo',
    category: 'Automóveis',
    city: 'Matola',
    planType: 'fazer_por_mim',
    amountMT: 1200,
    paymentMethod: 'emola',
    paymentPhone: '879876543',
    status: 'Aguardando assistência',
    createdAt: '2026-10-06 09:15',
    details: 'Ajuda com ligação a despachante aduaneiro certificado e cálculo de direitos aduaneiros na JUE.'
  },
  {
    id: 'RMZ-1046',
    userEmail: 'fatima.m@outlook.com',
    userName: 'Fátima Mahumane',
    serviceTitle: 'Elaboração de Currículo e Carta de Apresentação',
    category: 'Emprego',
    city: 'Beira',
    planType: 'ajuda_remota',
    amountMT: 150,
    paymentMethod: 'mpesa',
    paymentPhone: '852233445',
    status: 'Resolvido',
    createdAt: '2026-10-05 11:20',
    details: 'Formatação profissional de CV segundo padrões aceites em Moçambique.'
  }
];

let professionals: Professional[] = [
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
    name: 'Armando Sitoe (Despachos)',
    category: 'Despachante Aduaneiro',
    rating: 4.7,
    reviewsCount: 21,
    city: 'Maputo',
    verified: true,
    shortBio: 'Despachante oficial credenciado pela Autoridade Tributária. Importação de viaturas, carga marítima e aérea.',
    phone: '+258 86 776 5544',
    whatsapp: '+258 86 776 5544',
    priceStartingMT: 2500,
    featured: false
  },
  {
    id: 'prof-5',
    name: 'Gervásio Langa',
    category: 'Canalizador & Redes de Água',
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
    category: 'Gestão de Recursos Humanos & CV',
    rating: 4.9,
    reviewsCount: 65,
    city: 'Nampula / Remoto',
    verified: true,
    shortBio: 'Especialista em recrutamento local, revisão de CVs, cartas formais e preparação para entrevistas.',
    phone: '+258 87 234 5678',
    whatsapp: '+258 87 234 5678',
    priceStartingMT: 300,
    featured: true
  }
];

// Curated Mozambican Knowledge Bases for the Top Problems (ensures immediate, authoritative, 100% reliable ground truth)
const LOCAL_KNOWLEDGE_BASE: Record<string, any> = {
  'abrir_empresa': {
    title: 'Plano para Abertura de Empresa em Moçambique',
    category: 'Negócios',
    questions: [
      {
        id: 'tipo_negocio',
        label: 'Que tipo de negócio pretende abrir?',
        options: ['Comércio Geral', 'Restaurante / Alimentação', 'Prestação de Serviços', 'Transportes', 'Construção', 'Outro']
      },
      {
        id: 'cidade',
        label: 'Em que cidade pretende operar?',
        options: ['Maputo', 'Matola', 'Beira', 'Nampula', 'Tete', 'Outra']
      },
      {
        id: 'estrutura',
        label: 'Vai abrir sozinho ou com sócios?',
        options: ['Sozinho (Sociedade Unipessoal)', 'Com Sócios (Sociedade por Quotas - Lda)']
      }
    ],
    generatePlan: (answers: Record<string, string>) => ({
      title: 'Plano para Abrir a Sua Empresa',
      summary: {
        cidade: answers['cidade'] || 'Maputo',
        tipo: answers['tipo_negocio'] || 'Comércio Geral',
        estrutura: answers['estrutura'] || 'Sociedade por Quotas'
      },
      steps: [
        {
          number: 1,
          title: 'Definir a Estrutura e Reserva de Nome',
          explanation: 'Antes de registar, deve solicitar a Certidão Negativa de Nome na Conservatória do Registo das Entidades Legais (CREL / BAU) para verificar se o nome escolhido está livre.',
          whatYouNeed: [
            '3 opções de denominação social (nomes da empresa)',
            'Cópia do BI autenticada de todos os sócios',
            'NUIT pessoal dos sócios',
            'Definição da percentagem de quotas e capital social'
          ],
          whereToGo: answers['cidade'] === 'Matola' 
            ? 'BAU da Matola (Balcão de Atendimento Único) ou Conservatória Comercial'
            : 'BAU de Maputo (Av. 25 de Setembro / Praça dos Trabalhadores) ou CREL',
          estimatedTime: '2 a 5 dias úteis',
          cost: 'Aprox. 200 a 400 MT (Certidão de reserva de nome)',
          reliability: 'Confirmado com procedimentos BAU / CREL'
        },
        {
          number: 2,
          title: 'Elaboração dos Estatutos e Formalização',
          explanation: 'Elaborar o pacto social (estatutos da empresa). Para pequenas empresas, pode utilizar a minuta padrão simplificada fornecida pelo próprio BAU, não sendo obrigatória escritura pública notarial para sociedades por quotas sem imóveis.',
          checklist: [
            'Cópia de BI/Passaporte de todos os sócios',
            'NUIT pessoal dos sócios',
            'Minuta dos estatutos da sociedade',
            'Indicação do Gerente nomeado',
            'Declaração de aceitação da gerência'
          ],
          whereToGo: 'Balcão de Atendimento Único (BAU) da sua província',
          estimatedTime: '3 a 7 dias úteis',
          cost: 'Aprox. 1.500 a 3.500 MT (taxas de registo e publicação no Boletim da República - BR)',
          reliability: 'Confirmado pelo Decreto nº 2/2014 e Código Comercial revisto'
        },
        {
          number: 3,
          title: 'Registo Fiscal (NUIT da Empresa) e Início de Actividade',
          explanation: 'Com a certidão de registo definitiva, deve cadastrar a empresa na Autoridade Tributária (AT) para obter o NUIT fiscal da entidade colectiva e comunicar o início de actividade.',
          whereToGo: 'Direcção de Área Fiscal (DAF) da Autoridade Tributária de Moçambique ou posto AT no BAU',
          checklist: [
            'Certidão de Registo Comercial emitida pelo BAU/CREL',
            'Boletim M/01 (Declaração de Início de Actividade)',
            'Contrato de arrendamento ou comprovativo de morada da sede da empresa',
            'Cópia do BI e NUIT do representante legal'
          ],
          cost: 'Gratuito (Emissão do cartão de NUIT)',
          estimatedTime: '2 a 4 dias úteis',
          reliability: 'Informação oficial da Autoridade Tributária de Moçambique (AT)'
        },
        {
          number: 4,
          title: 'Licenciamento / Alvará Simples e INSS',
          explanation: 'Para a maioria das actividades comerciais e de serviços, aplica-se o regime de Mera Comunicação Prévia ou Alvará Simplificado através do BAU. Deve também inscrever a empresa e trabalhadores no Instituto Nacional de Segurança Social (INSS).',
          whereToGo: 'BAU local e Delegação do INSS (Delegação Distrital ou Cidade)',
          estimatedTime: 'Imediato a 10 dias úteis',
          cost: 'Variável conforme tabela municipal (aprox. 500 a 2.000 MT para licença simplificada)',
          reliability: 'Decreto do Licenciamento Simplificado em Moçambique'
        }
      ],
      officialNotice: 'O Resolve MZ baseia-se nos regulamentos em vigor no Balcão de Atendimento Único (BAU) e Código Comercial de Moçambique. As taxas municipais podem variar consoante o Município (Maputo, Matola, Beira, etc.).'
    })
  },
  'renovar_bi': {
    title: 'Plano para Emissão ou Renovação de Bilhete de Identidade (BI)',
    category: 'Documentos',
    questions: [
      {
        id: 'situacao',
        label: 'Qual é a sua situação com o BI?',
        options: ['Renovação (caducado ou a caducar)', 'Perda / Extravio / Roubo', 'Primeira vez (maior de 18 anos)', 'Primeira vez (menor de idade)']
      },
      {
        id: 'cidade',
        label: 'Em que cidade pretende tratar?',
        options: ['Maputo', 'Matola', 'Beira', 'Nampula', 'Tete', 'Outra']
      }
    ],
    generatePlan: (answers: Record<string, string>) => ({
      title: 'Plano para Tratar o Bilhete de Identidade (BI)',
      summary: {
        situacao: answers['situacao'] || 'Renovação',
        cidade: answers['cidade'] || 'Maputo'
      },
      steps: [
        {
          number: 1,
          title: 'Reunir os Documentos Obrigatórios',
          explanation: 'A Direcção Nacional de Identificação Civil (DIC) exige documentação precisa para evitar rejeição no posto.',
          whatYouNeed: answers['situacao']?.includes('Perda') ? [
            'Talão de participação de perda/roubo emitido pela PRM (Polícia da República de Moçambique)',
            'Cópia do BI anterior (se tiver) ou Certidão de Nascimento / Assento de Nascimento',
            'Valor da taxa oficial'
          ] : [
            'Bilhete de Identidade antigo / caducado',
            'Se houver alteração de estado civil: Certidão de Casamento',
            'Valor da taxa oficial'
          ],
          whereToGo: answers['cidade'] === 'Maputo'
            ? 'Postos da DIC: DIC Central (Av. 24 de Julho), Posto do Zimpeto, ou Postos de Atendimento Rápido'
            : `Posto da DIC na Direcção Provincial de Identificação Civil de ${answers['cidade'] || 'Moçambique'}`,
          estimatedTime: 'Atendimento presencial com captura biométrica',
          cost: 'Aprox. 180 MT (taxa normal) / Pedidos urgentes podem ter sobretaxa legal',
          reliability: 'Informação oficial da Direcção Nacional de Identificação Civil (DIC)'
        },
        {
          number: 2,
          title: 'Captura Biométrica no Posto DIC',
          explanation: 'Recomenda-se chegar cedo no período da manhã. A fotografia e impressões digitais são colhidas no local.',
          checklist: [
            'Vestuário adequado (evitar camisas muito claras que se confundem com o fundo)',
            'Levar documentos originais',
            'Guardar com segurança o talão / comprovativo de levantamento fornecido'
          ],
          whereToGo: 'Posto DIC escolhido',
          estimatedTime: '1 a 3 horas na fila de atendimento',
          cost: 'Pago directamente no posto (com recibo oficial do Estado)',
          reliability: 'Procedimento padrão DIC'
        },
        {
          number: 3,
          title: 'Levantamento do BI',
          explanation: 'Após o prazo indicado no talão (habitualmente 15 a 30 dias para normal), dirija-se ao mesmo posto com o recibo original para levantar.',
          whereToGo: 'Mesmo posto onde fez a captura',
          estimatedTime: '15 a 30 dias para emissão normal',
          cost: '0 MT no acto de levantamento',
          reliability: 'Confirmado'
        }
      ],
      officialNotice: 'Aviso: Nunca entregue dinheiro a intermediários ("pastas") fora das instalações da DIC. Todos os pagamentos devem ter guia/recibo oficial.'
    })
  },
  'importar_carro': {
    title: 'Plano para Importação de Viatura para Moçambique',
    category: 'Automóveis',
    questions: [
      {
        id: 'origem',
        label: 'De onde pretende importar o veículo?',
        options: ['Japão (BeForward, SBT, etc.)', 'África do Sul', 'Reino Unido', 'Outro país']
      },
      {
        id: 'porto',
        label: 'Qual é o porto de entrada em Moçambique?',
        options: ['Porto de Maputo', 'Porto da Beira', 'Porto de Nacala', 'Fronteira Terrestre de Ressano Garcia']
      },
      {
        id: 'cilindrada',
        label: 'Ano aproximado ou tipo de viatura?',
        options: ['Viatura ligeira de passageiros', 'Carrinha / Pick-up comercial', 'Camião pesado']
      }
    ],
    generatePlan: (answers: Record<string, string>) => ({
      title: 'Plano de Importação de Viatura em Moçambique',
      summary: {
        origem: answers['origem'] || 'Japão',
        pontoEntrada: answers['porto'] || 'Porto de Maputo',
        tipo: answers['cilindrada'] || 'Viatura ligeira'
      },
      steps: [
        {
          number: 1,
          title: 'Compra e Envio dos Documentos Originais',
          explanation: 'Após a compra no exportador, deve receber por correio expresso (DHL/FedEx) os documentos originais do veículo indispensáveis para o desalfandegamento.',
          whatYouNeed: [
            'Factura comercial original (Commercial Invoice)',
            'Conhecimento de Embarque Marítimo (Bill of Lading - B/L)',
            'Certificado de Exportação original (com tradução em inglês)',
            'Certificado de Inspecção Pré-Embarque (se aplicável, ex: Intertek)'
          ],
          whereToGo: 'Recepção postal e Janela Única Electrónica (JUE)',
          estimatedTime: '20 a 45 dias para navegação marítima até Maputo/Beira',
          cost: 'Custo do frete pago ao exportador (em USD)',
          reliability: 'Procedimento Aduaneiro de Moçambique'
        },
        {
          number: 2,
          title: 'Contratação de Despachante Aduaneiro Credenciado',
          explanation: 'Pela legislação moçambicana, o desembaraço aduaneiro na JUE deve ser submetido por um Despachante Aduaneiro oficialmente credenciado pela Autoridade Tributária.',
          whereToGo: 'Câmara dos Despachantes Aduaneiros ou terminal do Porto de Maputo/Beira',
          checklist: [
            'Entregar B/L original e Invoice ao despachante',
            'Fornecer NUIT e cópia do BI do proprietário',
            'Solicitar a simulação do Documento Único (DU) para cálculo prévio de impostos'
          ],
          estimatedTime: '3 a 7 dias úteis após atracagem do navio',
          cost: 'Honorários de despachante: habitualmente entre 5.000 MT e 15.000 MT (a acordar)',
          reliability: 'Obrigatório nos termos do Regulamento Aduaneiro'
        },
        {
          number: 3,
          title: 'Pagamento de Direitos Aduaneiros (Direitos, ICE, IVA)',
          explanation: 'A AT calcula o valor com base na tabela aduaneira: Direitos Aduaneiros (geralmente 20% para ligeiros), Imposto sobre Consumos Específicos (ICE, varia com cilindrada e idade), IVA (16%), e taxas de terminal portuário (Cornelder / MPDC).',
          whereToGo: 'Bancos comerciais autorizados através da Guia da JUE (com código de barras)',
          cost: 'Varia drasticamente conforme ano, cilindrada e valor CIF. (Simulação recomendada antes da compra)',
          estimatedTime: '2 a 3 dias para liquidação bancária',
          reliability: 'Tabela Pauta Aduaneira de Moçambique'
        },
        {
          number: 4,
          title: 'Vistoria, Matrícula no INATRO e Livrete',
          explanation: 'Com a viatura desalfandegada, procede-se à inspecção no Instituto Nacional dos Transportes Terrestres (INATRO) para atribuição da chapa de matrícula moçambicana (série da província) e emissão do livrete.',
          whereToGo: 'Delegação do INATRO da Província (ex: INATRO Maputo ou Matola)',
          checklist: [
            'DU (Documento Único) aduaneiro quitado',
            'Recibos da AT e despacho',
            'Viatura para inspecção física (número de chassis e motor)',
            'BI e NUIT do proprietário'
          ],
          cost: 'Aprox. 2.500 a 4.500 MT (taxas de matrícula, inspecção e emissão de livrete)',
          estimatedTime: '3 a 10 dias úteis',
          reliability: 'Regulamento do INATRO'
        }
      ],
      officialNotice: 'Cuidado com anúncios que prometem desalfandegamento sem guia oficial da JUE da Autoridade Tributária. Pague as guias aduaneiras apenas em balcões bancários credenciados.'
    })
  },
  'arrendar_casa': {
    title: 'Plano para Arrendamento Seguro de Casa em Maputo / Moçambique',
    category: 'Habitação',
    questions: [
      {
        id: 'cidade',
        label: 'Em que zona pretende arrendar?',
        options: ['Maputo Cidade (Polana, Sommerschield, Central, Malhangalene)', 'Maputo Arredores (Costa do Sol, Zimpeto, Triunfo)', 'Matola (Cidade, Fomento, Matola Rio)', 'Outra Cidade']
      },
      {
        id: 'tipo_imovel',
        label: 'Que tipo de imóvel procura?',
        options: ['Quarto / Dependência', 'Apartamento T1 ou T2', 'Apartamento T3 ou superior', 'Vivenda / Casa independente']
      },
      {
        id: 'orcamento',
        label: 'Qual é o seu orçamento mensal aproximado?',
        options: ['Até 10.000 MT', '10.000 a 25.000 MT', '25.000 a 50.000 MT', 'Mais de 50.000 MT']
      }
    ],
    generatePlan: (answers: Record<string, string>) => ({
      title: 'Plano para Arrendar Casa com Segurança Jurídica',
      summary: {
        zona: answers['cidade'] || 'Maputo',
        tipo: answers['tipo_imovel'] || 'Apartamento',
        orcamento: answers['orcamento'] || '10.000 a 25.000 MT'
      },
      steps: [
        {
          number: 1,
          title: 'Definir Requisitos e Evitar Burlas com "Agentes"',
          explanation: 'Em Maputo e Matola é comum existirem intermediários informais. Nunca pague "taxas de visualização" elevadas nem adiante valores de renda ou caução antes de ver o imóvel fisicamente e confirmar quem é o legítimo proprietário.',
          whatYouNeed: [
            'Visita presencial e teste de água (FIPAG / AdM) e energia (Credelec EDM)',
            'Confirmação se as contas de água e condomínio estão regularizadas',
            'Exigência de identificação do senhorio (BI e NUIT)'
          ],
          whereToGo: 'Imóvel a arrendar',
          estimatedTime: '1 a 2 semanas de procura orientada',
          cost: 'Gratuito para visualização (ou taxa simbólica de deslocação do agente)',
          reliability: 'Prática de segurança imobiliária em Moçambique'
        },
        {
          number: 2,
          title: 'Elaboração do Contrato de Arrendamento',
          explanation: 'O contrato escrito protege ambas as partes. Deve estipular com clareza o valor da renda em Meticais (MT), o valor da caução (habitualmente 1 a 2 meses), prazo de duração, encargos de manutenção e condições de rescisão.',
          checklist: [
            'Identificação completa do Senhorio e Inquino (Nomes, BI, NUIT, Residência)',
            'Descrição detalhada do imóvel',
            'Valor da caução e condições de devolução',
            'Auto de vistoria (fotografias do estado das torneiras, loiças, pintura)',
            'Regras sobre subarrendamento e obras'
          ],
          whereToGo: 'Gabinete jurídico ou minuta profissional Resolve MZ',
          cost: 'Minuta acessível / gratuita no Resolve MZ',
          estimatedTime: '1 a 2 dias',
          reliability: 'Conforme Código Civil de Moçambique e Legislação do Inquilinato'
        },
        {
          number: 3,
          title: 'Reconhecimento de Firmas no Cartório Notarial',
          explanation: 'Para conferir plena validade jurídica e executória ao contrato, as assinaturas do senhorio e do inquilino devem ser reconhecidas presencialmente perante um Notário Público.',
          whereToGo: 'Qualquer Cartório Notarial (ex: 1º ou 2º Cartório Notarial de Maputo, ou no BAU)',
          checklist: [
            'Duas vias do contrato assinadas',
            'BIs originais válidos dos outorgantes',
            'Presença de ambas as partes (ou procuração com poderes bastantes)'
          ],
          cost: 'Aprox. 150 a 300 MT por assinatura no Cartório Notarial',
          estimatedTime: 'No próprio dia',
          reliability: 'Regulamento do Notariado em Moçambique'
        }
      ],
      officialNotice: 'Dica do Resolve MZ: Exija sempre recibo formal de cada pagamento efectuado e dê preferência a transferências bancárias com descrição comprovável ou M-Pesa com referência.'
    })
  },
  'curriculo_emprego': {
    title: 'Plano para Currículo e Candidatura a Emprego em Moçambique',
    category: 'Emprego',
    questions: [
      {
        id: 'area',
        label: 'Qual é a sua área profissional?',
        options: ['Administração / Finanças', 'Tecnologia / TI', 'Vendas / Comercial', 'Educação / Ensino', 'Operações / Logística', 'Primeiro Emprego']
      },
      {
        id: 'nivel',
        label: 'Qual é o seu nível de experiência?',
        options: ['Estudante / Recém-formado', '1 a 3 anos de experiência', 'Mais de 3 anos / Sénior']
      }
    ],
    generatePlan: (answers: Record<string, string>) => ({
      title: 'Plano Estruturado para Conquistar Emprego',
      summary: {
        area: answers['area'] || 'Administração',
        experiencia: answers['nivel'] || '1 a 3 anos'
      },
      steps: [
        {
          number: 1,
          title: 'Formatação do CV nos Padrões de Moçambique',
          explanation: 'Os recrutadores moçambicanos esperam um formato sóbrio, directo, de no máximo 2 páginas. Deve incluir nacionalidade, cidade de residência, línguas dominadas (Português, Inglês e línguas nacionais se relevante) e contactos rápidos (WhatsApp e e-mail profissional).',
          whatYouNeed: [
            'Resumo profissional objectivo de 3 linhas',
            'Experiência profissional por ordem cronológica inversa (com realizações mensuráveis)',
            'Habilitações literárias e certificados de formação',
            'Competências técnicas e ferramentas de software',
            'Duas referências profissionais com cargo e contacto'
          ],
          whereToGo: 'Assistente Resolve MZ para gerar modelo pronto em PDF',
          estimatedTime: '24 horas',
          cost: 'Orientação gratuita / 150 MT com revisão assistida',
          reliability: 'Práticas de RH em Moçambique'
        },
        {
          number: 2,
          title: 'Carta de Candidatura / Apresentação Formal',
          explanation: 'Em Moçambique, a maioria das empresas e ONGs exige uma carta formal dirigida ao "Exmo. Senhor Director dos Recursos Humanos". A carta deve explicar como o seu perfil responde aos requisitos do anúncio.',
          checklist: [
            'Endereçamento formal correcto',
            'Referência ao código da vaga ou anúncio',
            'Destaque de 2 principais pontos fortes',
            'Disponibilidade para entrevista'
          ],
          whereToGo: 'Elaboração no Resolve MZ',
          estimatedTime: '1 dia',
          cost: 'Incluído no apoio ao emprego',
          reliability: 'Conforme normas de correspondência profissional'
        },
        {
          number: 3,
          title: 'Onde Procurar Oportunidades Confiáveis em Moçambique',
          explanation: 'Foque nos canais mais activos e verifique a autenticidade dos anúncios para nunca pagar para ser recrutado.',
          checklist: [
            'Portais moçambicanos de emprego (ex: Emprego.co.mz, MM Emprego)',
            'LinkedIn focado em empresas em Maputo/Matola e multinacionais',
            'Secção de classificados do Jornal Notícias e Savana (sextas-feiras)',
            'Candidaturas espontâneas por e-mail a empresas do sector'
          ],
          whereToGo: 'Plataformas digitais oficiais',
          estimatedTime: 'Candidaturas diárias',
          cost: '0 MT (Cuidado: Recrutamento legítimo NUNCA cobra dinheiro do candidato)',
          reliability: 'Recomendação de segurança'
        }
      ],
      officialNotice: 'Aviso crucial: Nenhuma empresa idónea ou agência de recrutamento em Moçambique cobra valores para fazer entrevistas ou aceitar candidaturas. Rejeite qualquer pedido de M-Pesa para "garantir vaga".'
    })
  },
  'abrir_conta_bancaria': {
    title: 'Plano para Abertura de Conta Bancária em Moçambique',
    category: 'Finanças',
    questions: [
      {
        id: 'tipo_conta',
        label: 'Que tipo de conta bancária pretende abrir?',
        options: ['Conta Particular / Pessoal', 'Conta Estudante / Jovem', 'Conta Empresa / Comercial']
      },
      {
        id: 'rendimento',
        label: 'Possui declaração de trabalho ou é trabalhador independente?',
        options: ['Trabalhador por Conta de Outrem (com contrato/recibo)', 'Conta Própria / Negócio Próprio', 'Estudante / Sem rendimento fixo']
      }
    ],
    generatePlan: (answers: Record<string, string>) => ({
      title: 'Plano para Abertura de Conta Bancária',
      summary: {
        tipo: answers['tipo_conta'] || 'Particular',
        rendimento: answers['rendimento'] || 'Conta Própria'
      },
      steps: [
        {
          number: 1,
          title: 'Reunir Requisitos do Banco de Moçambique (Aviso KYC)',
          explanation: 'Todos os bancos moçambicanos (Millennium BIM, Standard Bank, BCI, Moza Banco, Absa, etc.) são obrigados pelo Banco de Moçambique a cumprir regras estritas de identificação do cliente.',
          whatYouNeed: [
            'Bilhete de Identidade (BI) ou DIRE ou Passaporte válido',
            'Cartão de NUIT emitido pela Autoridade Tributária',
            'Comprovativo de Residência (Declaração do Bairro / Estrutura do Bairro ou factura de água/luz/recibo de renda em seu nome)',
            'Comprovativo de Rendimentos (declaração da entidade empregadora, recibo de vencimento recente ou declaração de rendimentos para conta própria)',
            'Montante de depósito inicial mínimo (varia entre 500 MT a 2.500 MT dependendo do banco e pacote)'
          ],
          whereToGo: 'Balcão de qualquer agência bancária ou balcão móvel',
          estimatedTime: '30 a 60 minutos no balcão',
          cost: 'Apenas o depósito inicial que fica na sua própria conta',
          reliability: 'Regulamentação do Banco de Moçambique'
        },
        {
          number: 2,
          title: 'Configurar Serviços Digitais e Cartão de Débito',
          explanation: 'Para movimentar a sua conta sem custos elevados e associar ao M-Pesa/e-Mola, active o Internet Banking e solicite o cartão da rede SIMO.',
          checklist: [
            'Activação da app mobile do banco',
            'Subscrição do serviço de SMS de notificação',
            'Associação da conta bancária à sua carteira móvel (M-Pesa / e-Mola via Banco)',
            'Definição de PIN de segurança seguro'
          ],
          whereToGo: 'No próprio balcão ao assinar os formulários',
          estimatedTime: 'Imediato (cartão personalizado entregue em 5 a 10 dias úteis)',
          cost: 'Comissões de manutenção de conta conforme preçário do banco',
          reliability: 'Confirmado'
        }
      ],
      officialNotice: 'Dica Resolve MZ: Se não tiver comprovativo de salário formal, muitos bancos dispõem de pacotes de contas simplificadas ou para informais mediante declaração de actividade e NUIT.'
    })
  }
};

// API: Analyze User Query
app.post('/api/assistant/analyze', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Por favor, indique o que precisa de resolver.' });
    }

    const cleanQuery = query.toLowerCase().trim();

    // Check pre-configured knowledge bases first for ultra-fast, authoritative response
    if (cleanQuery.includes('empresa') || cleanQuery.includes('abrir negócio') || cleanQuery.includes('criar empresa') || cleanQuery.includes('registar negócio') || cleanQuery.includes('sociedade')) {
      const kb = LOCAL_KNOWLEDGE_BASE['abrir_empresa'];
      return res.json({
        recognizedCategory: 'Negócios',
        confidence: 'high',
        key: 'abrir_empresa',
        message: 'Claro! Vou ajudá-lo a organizar a abertura do seu negócio em Moçambique com todos os passos práticos.',
        questions: kb.questions,
        samplePlanAvailable: true
      });
    }

    if (cleanQuery.includes('bi') || cleanQuery.includes('bilhete de identidade') || cleanQuery.includes('identificação civil')) {
      const kb = LOCAL_KNOWLEDGE_BASE['renovar_bi'];
      return res.json({
        recognizedCategory: 'Documentos',
        confidence: 'high',
        key: 'renovar_bi',
        message: 'Com certeza. Tratar o BI em Moçambique exige documentos específicos para não perder viagens na fila.',
        questions: kb.questions,
        samplePlanAvailable: true
      });
    }

    if (cleanQuery.includes('carro') || cleanQuery.includes('viatura') || cleanQuery.includes('importar') || cleanQuery.includes('japão') || cleanQuery.includes('alfândega')) {
      const kb = LOCAL_KNOWLEDGE_BASE['importar_carro'];
      return res.json({
        recognizedCategory: 'Automóveis',
        confidence: 'high',
        key: 'importar_carro',
        message: 'Excelente. O processo de importação de viaturas em Moçambique envolve desembaraço na JUE, taxas e registo no INATRO.',
        questions: kb.questions,
        samplePlanAvailable: true
      });
    }

    if (cleanQuery.includes('casa') || cleanQuery.includes('arrendar') || cleanQuery.includes('alugar') || cleanQuery.includes('apartamento') || cleanQuery.includes('habitação')) {
      const kb = LOCAL_KNOWLEDGE_BASE['arrendar_casa'];
      return res.json({
        recognizedCategory: 'Habitação',
        confidence: 'high',
        key: 'arrendar_casa',
        message: 'Vamos ajudá-lo a encontrar e arrendar casa com segurança jurídica e sem risco de burlas.',
        questions: kb.questions,
        samplePlanAvailable: true
      });
    }

    if (cleanQuery.includes('currículo') || cleanQuery.includes('curriculo') || cleanQuery.includes('cv') || cleanQuery.includes('emprego') || cleanQuery.includes('trabalho') || cleanQuery.includes('candidatura')) {
      const kb = LOCAL_KNOWLEDGE_BASE['curriculo_emprego'];
      return res.json({
        recognizedCategory: 'Emprego',
        confidence: 'high',
        key: 'curriculo_emprego',
        message: 'Muito bem. Vamos preparar o seu perfil para se destacar nos processos de recrutamento em Moçambique.',
        questions: kb.questions,
        samplePlanAvailable: true
      });
    }

    if (cleanQuery.includes('bancária') || cleanQuery.includes('banco') || cleanQuery.includes('conta')) {
      const kb = LOCAL_KNOWLEDGE_BASE['abrir_conta_bancaria'];
      return res.json({
        recognizedCategory: 'Finanças',
        confidence: 'high',
        key: 'abrir_conta_bancaria',
        message: 'Vamos estruturar a abertura da sua conta bancária nos bancos comerciais em Moçambique.',
        questions: kb.questions,
        samplePlanAvailable: true
      });
    }

    // Dynamic AI Analysis with Gemini if key is present
    if (ai) {
      try {
        const prompt = `Você é o cérebro do ASSISTENTE CHAFY MZ, um assistente remoto profissional para Moçambique.
O utilizador escreveu este pedido: "${query}".
O seu objectivo: NÃO dê uma resposta longa agora. Em vez disso, faça exactamente 2 ou 3 perguntas curtas de escolha múltipla para recolher os detalhes necessários (ex: cidade em Moçambique como Maputo/Matola/Beira/Nampula, subtipo de serviço, situação actual).

Responda SOMENTE em JSON com esta estrutura:
{
  "recognizedCategory": "Negócios" | "Documentos" | "Habitação" | "Automóveis" | "Emprego" | "Finanças" | "Serviços Práticos" | "Outro",
  "message": "Mensagem acolhedora curta em português de Moçambique",
  "questions": [
    {
      "id": "q1",
      "label": "Pergunta 1 clara e directa",
      "options": ["Opção 1", "Opção 2", "Opção 3", "Outra"]
    },
    {
      "id": "cidade",
      "label": "Em que cidade ou província de Moçambique pretende tratar?",
      "options": ["Maputo", "Matola", "Beira", "Nampula", "Tete", "Outra"]
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            recognizedCategory: parsed.recognizedCategory || 'Serviços Gerais',
            confidence: 'medium',
            key: 'dynamic_ai',
            message: parsed.message || 'Com certeza. Para estruturar o seu plano detalhado, responda a estas questões rápidas:',
            questions: parsed.questions || [
              {
                id: 'cidade',
                label: 'Em que cidade de Moçambique pretende resolver isso?',
                options: ['Maputo', 'Matola', 'Beira', 'Nampula', 'Outra']
              }
            ],
            samplePlanAvailable: false
          });
        }
      } catch (aiErr) {
        console.error('Error generating dynamic questions with Gemini:', aiErr);
      }
    }

    // Default fallback questions
    return res.json({
      recognizedCategory: 'Serviços Práticos',
      confidence: 'medium',
      key: 'general_service',
      message: 'Com certeza. Para prepararmos o melhor plano de acção para o seu caso em Moçambique, precisamos de alguns detalhes rápidos:',
      questions: [
        {
          id: 'cidade',
          label: 'Em que cidade pretende resolver isso?',
          options: ['Maputo', 'Matola', 'Beira', 'Nampula', 'Tete', 'Outra']
        },
        {
          id: 'prazo',
          label: 'Com que urgência precisa da solução?',
          options: ['Urgente (Hoje ou amanhã)', 'Esta semana', 'Nas próximas 2 semanas', 'Planeamento com calma']
        },
        {
          id: 'detalhe',
          label: 'Prefere que um profissional credenciado ajude no processo?',
          options: ['Quero primeiro saber como fazer sozinho', 'Quero ajuda de um assistente Resolve MZ', 'Quero contratar um profissional directamente']
        }
      ],
      samplePlanAvailable: false
    });
  } catch (error: any) {
    console.error('Error in /api/assistant/analyze:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar o seu pedido. Tente novamente.' });
  }
});

// API: Generate Action Plan
app.post('/api/assistant/generate-plan', async (req, res) => {
  try {
    const { key, query, answers } = req.body;

    // If matching local knowledge base, return rich validated local plan instantly
    if (key && LOCAL_KNOWLEDGE_BASE[key]) {
      const plan = LOCAL_KNOWLEDGE_BASE[key].generatePlan(answers || {});
      return res.json(plan);
    }

    // Otherwise, generate with Gemini 3.8 Flash grounded in Mozambican public institutions & administration
    if (ai) {
      const prompt = `Você é o assistente inteligente do ASSISTENTE CHAFY MZ, focado exclusivamente na realidade da República de Moçambique.
Pedido do utilizador: "${query}".
Respostas fornecidas pelo utilizador: ${JSON.stringify(answers || {})}.

IMPORTANTE - REGRAS DE CONFIABILIDADE DE MOÇAMBIQUE:
1. Adapte totalmente aos procedimentos, instituições e termos reais de Moçambique (ex: BAU - Balcão de Atendimento Único, CREL, Conservatória, Autoridade Tributária AT, NUIT, INSS, INATRO, DIREC, Conselho Municipal de Maputo/Matola, EDM, FIPAG, moeda sempre em MT/MZN).
2. NUNCA invente artigos de lei específicos falsos, telefones inventados ou taxas falsas. Se o custo ou prazo variar, indique explicitamente "Informação não confirmada. Recomendamos verificar directamente com a instituição."
3. Seja prático, ultra claro, estruturado em passos numerados (Passo 1, Passo 2, Passo 3, etc.) com o que precisa, checklist de documentos, onde ir, tempo estimado e custos em MT.

Responda OBRIGATORIAMENTE em JSON no seguinte formato:
{
  "title": "Título claro do plano em Moçambique",
  "summary": {
    "cidade": "Cidade seleccionada ou Maputo",
    "tipo": "Tipo de pedido",
    "detalhes": "Resumo das opções"
  },
  "steps": [
    {
      "number": 1,
      "title": "Título do Passo 1",
      "explanation": "Explicação simples e directa sem rodeios.",
      "whatYouNeed": ["Item 1", "Item 2", "Item 3"],
      "whereToGo": "Instituição exacta em Moçambique (ex: BAU, AT, Delegação)",
      "estimatedTime": "Tempo estimado",
      "cost": "Custo em MT ou indicação de gratuitidade",
      "reliability": "Confirmado ou Informação não confirmada"
    },
    {
      "number": 2,
      "title": "Título do Passo 2 - Preparar Documentação",
      "explanation": "Explicação da documentação.",
      "checklist": ["Documento A", "Documento B", "Documento C"],
      "whereToGo": "Local",
      "estimatedTime": "Tempo estimado",
      "cost": "Custo",
      "reliability": "Confirmado"
    },
    {
      "number": 3,
      "title": "Título do Passo 3 - Formalização / Conclusão",
      "explanation": "Explicação final.",
      "checklist": ["Ponto 1", "Ponto 2"],
      "whereToGo": "Local final",
      "estimatedTime": "Tempo estimado",
      "cost": "Custo",
      "reliability": "Confirmado"
    }
  ],
  "officialNotice": "Nota de confiabilidade com fontes oficiais de Moçambique."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    }

    // Fallback if AI not reachable
    return res.json({
      title: `Plano de Resolução para: ${query}`,
      summary: {
        cidade: answers?.cidade || 'Maputo',
        tipo: 'Serviço personalizado',
        detalhes: 'Orientação geral estruturada para Moçambique'
      },
      steps: [
        {
          number: 1,
          title: 'Levantamento de Requisitos e Documentos Pessoais',
          explanation: 'Reúna o seu Bilhete de Identidade (BI) válido ou DIRE, NUIT pessoal e comprovativo de morada antes de se deslocar a qualquer instituição.',
          whatYouNeed: ['BI original e cópia autenticada', 'Cartão de NUIT', 'Declaração do Bairro ou factura de residência'],
          whereToGo: answers?.cidade ? `Instituição correspondente em ${answers.cidade}` : 'Balcão de Atendimento Único (BAU) ou Delegação Distrital',
          estimatedTime: '1 a 2 dias úteis',
          cost: 'Taxas normais de autenticação notarial (aprox. 50 a 100 MT)',
          reliability: 'Confirmado'
        },
        {
          number: 2,
          title: 'Submissão e Acompanhamento do Pedido',
          explanation: 'Apresente os formulários no balcão de atendimento e guarde sempre o comprovativo numerado com carimbo de entrada.',
          checklist: ['Formulário oficial devidamente preenchido', 'Guias de pagamento pagas em banco credenciado', 'Talão com número de processo'],
          whereToGo: 'Posto de atendimento sectorial',
          estimatedTime: 'Informação não confirmada. Recomendamos verificar directamente com a instituição.',
          cost: 'Variável',
          reliability: 'Informação não confirmada. Recomendamos verificar directamente com a instituição.'
        },
        {
          number: 3,
          title: 'Finalização e Suporte',
          explanation: 'Se encontrar qualquer entrave ou precisar de auxílio com formulários, a equipa do Assistente Chafy mz pode intervir para agilizar a preparação.',
          whereToGo: 'Plataforma Assistente Chafy mz',
          estimatedTime: 'Suporte remoto contínuo',
          cost: 'A partir de 100 MT',
          reliability: 'Garantido pelo Assistente Chafy mz'
        }
      ],
      officialNotice: 'O Assistente Chafy mz fornece orientação e informação com base nas práticas administrativas de Moçambique. Não substitui aconselhamento jurídico ou institucional formal.'
    });
  } catch (err) {
    console.error('Error generating plan:', err);
    res.status(500).json({ error: 'Não foi possível gerar o plano. Tente novamente.' });
  }
});

// API: Ticket creation ("Precisa que façamos por si?")
app.post('/api/tickets/create', (req, res) => {
  try {
    const {
      serviceTitle,
      category,
      city,
      planType,
      amountMT,
      paymentMethod,
      paymentPhone,
      userName,
      userEmail,
      details
    } = req.body;

    const newTicketId = `RMZ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: Ticket = {
      id: newTicketId,
      userEmail: userEmail || 'aniziochafy97@gmail.com',
      userName: userName || 'Anizio Chafy',
      serviceTitle: serviceTitle || 'Assistência Remota',
      category: category || 'Geral',
      city: city || 'Maputo',
      planType: planType || 'ajuda_remota',
      amountMT: Number(amountMT) || 100,
      paymentMethod: paymentMethod || 'mpesa',
      paymentPhone: paymentPhone || '',
      status: 'Aguardando assistência',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: details || 'Apoio solicitado pelo utilizador através da plataforma Assistente Chafy mz.'
    };

    tickets.unshift(newTicket);

    res.status(201).json({
      success: true,
      ticket: newTicket,
      message: `Pedido ${newTicket.id} registado com sucesso! A nossa equipa entrará em contacto por WhatsApp/telefone.`
    });
  } catch (e: any) {
    console.error('Error creating ticket:', e);
    res.status(500).json({ error: 'Erro ao registar pedido de assistência.' });
  }
});

// API: List tickets (for user dashboard and admin)
app.get('/api/tickets', (req, res) => {
  const { email } = req.query;
  if (email && typeof email === 'string') {
    const filtered = tickets.filter(t => t.userEmail.toLowerCase() === email.toLowerCase());
    return res.json(filtered);
  }
  return res.json(tickets);
});

// API: Update ticket status (Admin)
app.post('/api/tickets/update-status', (req, res) => {
  const { id, status } = req.body;
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }
  if (!['Aguardando assistência', 'Em análise', 'Resolvido'].includes(status)) {
    return res.status(400).json({ error: 'Estado inválido.' });
  }
  ticket.status = status;
  res.json({ success: true, ticket });
});

// API: Professionals marketplace
app.get('/api/professionals', (req, res) => {
  const { category, city } = req.query;
  let filtered = [...professionals];
  if (category && typeof category === 'string' && category !== 'Todos') {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (city && typeof city === 'string' && city !== 'Todas') {
    filtered = filtered.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
  }
  res.json(filtered);
});

// API: Register as professional ("É profissional?")
app.post('/api/professionals/register', (req, res) => {
  try {
    const { name, category, city, phone, whatsapp, shortBio, plan } = req.body;
    if (!name || !category || !phone) {
      return res.status(400).json({ error: 'Preencha os campos obrigatórios (Nome, Categoria, Telefone).' });
    }

    const newProf: Professional = {
      id: `prof-${Date.now()}`,
      name,
      category,
      city: city || 'Maputo',
      rating: 5.0,
      reviewsCount: 1,
      verified: plan === 'Profissional' || plan === 'Empresa',
      shortBio: shortBio || `Profissional qualificado na área de ${category} em ${city || 'Moçambique'}.`,
      phone,
      whatsapp: whatsapp || phone,
      priceStartingMT: plan === 'Profissional' ? 500 : 300,
      featured: plan === 'Profissional'
    };

    professionals.unshift(newProf);
    res.status(201).json({
      success: true,
      professional: newProf,
      message: 'Registo submetido com sucesso! O seu perfil estará visível para novos clientes.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registar profissional.' });
  }
});

// API: Admin stats and metrics
app.get('/api/admin/metrics', (req, res) => {
  const totalRevenueMT = tickets.reduce((acc, t) => acc + (t.amountMT || 0), 0) + 4500;
  res.json({
    usersCount: 384,
    processesCount: tickets.length + 120,
    paidOrdersCount: tickets.length,
    revenueMT: totalRevenueMT,
    professionalsCount: professionals.length,
    leadsCount: 87,
    openTicketsCount: tickets.filter(t => t.status === 'Aguardando assistência').length
  });
});

// In dev, mount Vite middlewares; in production, serve built dist files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`RESOLVE MZ server running on port ${port} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
