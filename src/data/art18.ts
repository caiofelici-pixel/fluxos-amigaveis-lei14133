export interface Inciso {
  numero: string;
  titulo: string;
  descricao: string;
  obrigatorio: boolean;
  textoLegal: string;
}

export const INCISOS_ART18: Inciso[] = [
  {
    numero: "I",
    titulo: "Descrição da necessidade da contratação",
    descricao: "Fundamentação da necessidade da contratação, considerado o problema a ser resolvido sob a perspectiva do interesse público.",
    obrigatorio: true,
    textoLegal: "Art. 18, I — descrição da necessidade da contratação, considerado o problema a ser resolvido sob a perspectiva do interesse público.",
  },
  {
    numero: "II",
    titulo: "Descrição do objeto",
    descricao: "Descrição do objeto para o atendimento da necessidade, com definição de requisitos.",
    obrigatorio: true,
    textoLegal: "Art. 18, II — descrição do objeto para o atendimento da necessidade.",
  },
  {
    numero: "III",
    titulo: "Demonstração da previsão no plano de contratações anual",
    descricao: "Demonstração da previsão da contratação no plano de contratações anual, sempre que elaborado.",
    obrigatorio: true,
    textoLegal: "Art. 18, III — demonstração da previsão da contratação no plano de contratações anual.",
  },
  {
    numero: "IV",
    titulo: "Requisitos da contratação",
    descricao: "Requisitos da contratação, incluindo especificação do objeto, com estudo técnico preliminar.",
    obrigatorio: true,
    textoLegal: "Art. 18, IV — requisitos da contratação.",
  },
  {
    numero: "V",
    titulo: "Estimativas das quantidades",
    descricao: "Estimativas das quantidades para a contratação, acompanhadas das memórias de cálculo.",
    obrigatorio: true,
    textoLegal: "Art. 18, V — estimativas das quantidades para a contratação, acompanhadas das memórias de cálculo e dos documentos que lhes dão suporte.",
  },
  {
    numero: "VI",
    titulo: "Estimativa do valor da contratação",
    descricao: "Estimativa do valor da contratação, acompanhada dos preços unitários referenciais e das memórias de cálculo.",
    obrigatorio: true,
    textoLegal: "Art. 18, VI — estimativa do valor da contratação, acompanhada dos preços unitários referenciais, das memórias de cálculo e dos documentos que lhe dão suporte.",
  },
  {
    numero: "VII",
    titulo: "Justificativas para o parcelamento ou não",
    descricao: "Justificativas para o parcelamento ou não da contratação.",
    obrigatorio: true,
    textoLegal: "Art. 18, VII — justificativas para o parcelamento ou não da contratação.",
  },
  {
    numero: "VIII",
    titulo: "Pesquisa de mercado",
    descricao: "Demonstração do resultado da pesquisa de mercado realizada.",
    obrigatorio: true,
    textoLegal: "Art. 18, VIII — pesquisa de mercado.",
  },
  {
    numero: "IX",
    titulo: "Adequação orçamentária",
    descricao: "Adequação orçamentária e compatibilidade com a lei de diretrizes orçamentárias e com o plano plurianual.",
    obrigatorio: true,
    textoLegal: "Art. 18, IX — adequação orçamentária.",
  },
  {
    numero: "X",
    titulo: "Termo de referência ou projeto básico",
    descricao: "Elaboração do termo de referência, anteprojeto, projeto básico ou projeto executivo.",
    obrigatorio: true,
    textoLegal: "Art. 18, X — termo de referência, anteprojeto, projeto básico ou projeto executivo.",
  },
  {
    numero: "XI",
    titulo: "Modalidade de licitação",
    descricao: "Definição da modalidade e do critério de julgamento da licitação.",
    obrigatorio: true,
    textoLegal: "Art. 18, XI — modalidade de licitação, o critério de julgamento, o modo de disputa e a adequação e eficiência da forma de combinação desses parâmetros.",
  },
  {
    numero: "XII",
    titulo: "Matriz de alocação de riscos",
    descricao: "Matriz de alocação de riscos, quando aplicável.",
    obrigatorio: false,
    textoLegal: "Art. 18, XII — matriz de alocação de riscos, quando aplicável.",
  },
  {
    numero: "XIII",
    titulo: "Motivação para contratação direta",
    descricao: "Motivação circunstanciada para contratação direta por inexigibilidade ou dispensa.",
    obrigatorio: false,
    textoLegal: "Art. 18, XIII — motivação circunstanciada das condições do caso concreto, na hipótese de contratação direta.",
  },
];

export interface Documento {
  id: string;
  objeto: string;
  tipo: "ETP" | "TR" | "Matriz de Riscos";
  dataCriacao: string;
  status: "rascunho" | "em_andamento" | "concluido";
  incisos: Record<string, { preenchido: boolean; conteudo: string }>;
}
