export const CATEGORIAS_DESPESAS = [
  'Transporte',
  'Alimentação',
  'Viagem',
  'Saúde',
  'Educação',
  'Lazer',
  'Moradia',
  'Vestuário',
  'Tecnologia',
  'Pets',
  'Beleza',
  'Investimento',
  'Outros'
] as const;

export const CATEGORIAS_RECEITAS = [
  'Salário',
  'Freelance',
  'Vendas',
  'Investimento',
  'Rendimentos',
  'Presentes',
  'Reembolso',
  'Outros'
] as const;

export type CategoriaDespesa = typeof CATEGORIAS_DESPESAS[number];
export type CategoriaReceita = typeof CATEGORIAS_RECEITAS[number];
