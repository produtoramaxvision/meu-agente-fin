"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  MessageSquare, 
  Bug, 
  Lightbulb,
  Clock,
  Users,
  Shield,
  CreditCard,
  Settings,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  lastUpdated: string;
}

interface SupportFAQProps {
  onSelectQuestion?: (question: string) => void;
}

const faqData: FAQItem[] = [
  // Conta e Autenticação
  {
    id: '1',
    question: 'Como faço para criar uma conta no Meu Agente?',
    answer: 'Para criar uma conta, clique em "Cadastrar" na página inicial, preencha seus dados pessoais e confirme seu número de telefone. Você receberá um código de verificação por SMS.',
    category: 'Conta',
    tags: ['cadastro', 'verificação', 'sms'],
    helpful: 45,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    question: 'Esqueci minha senha. Como recuperar?',
    answer: 'Clique em "Esqueci minha senha" na tela de login, informe seu número de telefone e você receberá um link para redefinir sua senha por SMS.',
    category: 'Conta',
    tags: ['senha', 'recuperação', 'sms'],
    helpful: 38,
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    question: 'Como altero meus dados pessoais?',
    answer: 'Acesse "Perfil" no menu lateral, clique em "Editar Perfil" e faça as alterações necessárias. Não esqueça de salvar as mudanças.',
    category: 'Conta',
    tags: ['perfil', 'dados', 'edição'],
    helpful: 29,
    lastUpdated: '2024-01-12'
  },

  // Planos e Pagamentos
  {
    id: '4',
    question: 'Quais são os planos disponíveis?',
    answer: 'Oferecemos 4 planos: Free (gratuito), Basic, Business e Premium. Cada plano tem funcionalidades e limites diferentes. Consulte a página de planos para mais detalhes.',
    category: 'Planos',
    tags: ['planos', 'preços', 'funcionalidades'],
    helpful: 52,
    lastUpdated: '2024-01-20'
  },
  {
    id: '5',
    question: 'Como faço upgrade do meu plano?',
    answer: 'Acesse "Planos" no menu, escolha o plano desejado e clique em "Fazer Upgrade". Você será redirecionado para o pagamento seguro.',
    category: 'Planos',
    tags: ['upgrade', 'pagamento', 'plano'],
    helpful: 41,
    lastUpdated: '2024-01-18'
  },
  {
    id: '6',
    question: 'Posso cancelar minha assinatura a qualquer momento?',
    answer: 'Sim, você pode cancelar sua assinatura a qualquer momento. Acesse "Configurações" > "Assinatura" e clique em "Cancelar Assinatura".',
    category: 'Planos',
    tags: ['cancelamento', 'assinatura', 'configurações'],
    helpful: 33,
    lastUpdated: '2024-01-14'
  },

  // Funcionalidades
  {
    id: '7',
    question: 'Como adiciono uma nova tarefa?',
    answer: 'Clique em "Tarefas" no menu, depois em "Nova Tarefa". Preencha o título, descrição, categoria e data de vencimento. Clique em "Salvar" para criar.',
    category: 'Funcionalidades',
    tags: ['tarefas', 'criação', 'organização'],
    helpful: 67,
    lastUpdated: '2024-01-22'
  },
  {
    id: '8',
    question: 'Como funciona o sistema de metas?',
    answer: 'As metas ajudam você a acompanhar objetivos financeiros. Acesse "Metas", clique em "Nova Meta" e defina o valor, prazo e categoria da meta.',
    category: 'Funcionalidades',
    tags: ['metas', 'objetivos', 'financeiro'],
    helpful: 58,
    lastUpdated: '2024-01-19'
  },
  {
    id: '9',
    question: 'Como visualizo meus relatórios financeiros?',
    answer: 'Acesse "Relatórios" no menu para ver gráficos e análises dos seus gastos, receitas e categorias. Você pode filtrar por período e exportar os dados.',
    category: 'Funcionalidades',
    tags: ['relatórios', 'gráficos', 'análise'],
    helpful: 44,
    lastUpdated: '2024-01-16'
  },

  // Problemas Técnicos
  {
    id: '10',
    question: 'O aplicativo está lento. O que fazer?',
    answer: 'Tente fechar e reabrir o aplicativo, limpar o cache do navegador ou verificar sua conexão com a internet. Se o problema persistir, entre em contato conosco.',
    category: 'Técnico',
    tags: ['lentidão', 'performance', 'cache'],
    helpful: 36,
    lastUpdated: '2024-01-13'
  },
  {
    id: '11',
    question: 'Não consigo fazer login. O que pode ser?',
    answer: 'Verifique se seu número de telefone está correto, se você tem conexão com a internet e se não há problemas com o serviço SMS. Tente novamente em alguns minutos.',
    category: 'Técnico',
    tags: ['login', 'conexão', 'sms'],
    helpful: 42,
    lastUpdated: '2024-01-17'
  },
  {
    id: '12',
    question: 'Os dados não estão sincronizando. Como resolver?',
    answer: 'Verifique sua conexão com a internet e tente fazer logout e login novamente. Se o problema persistir, pode ser necessário aguardar alguns minutos para a sincronização.',
    category: 'Técnico',
    tags: ['sincronização', 'dados', 'conexão'],
    helpful: 31,
    lastUpdated: '2024-01-11'
  },

  // Privacidade e Segurança
  {
    id: '13',
    question: 'Meus dados estão seguros no Meu Agente?',
    answer: 'Sim, utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança. Seus dados são armazenados de forma segura e nunca compartilhados.',
    category: 'Segurança',
    tags: ['segurança', 'privacidade', 'criptografia'],
    helpful: 49,
    lastUpdated: '2024-01-21'
  },
  {
    id: '14',
    question: 'Como posso excluir minha conta e dados?',
    answer: 'Acesse "Configurações" > "Privacidade" > "Excluir Conta". Você receberá uma confirmação por SMS antes da exclusão definitiva dos seus dados.',
    category: 'Segurança',
    tags: ['exclusão', 'dados', 'privacidade'],
    helpful: 27,
    lastUpdated: '2024-01-09'
  }
];

const categoryConfig = {
  'Conta': { icon: Users, color: 'bg-blue-500', label: 'Conta' },
  'Planos': { icon: CreditCard, color: 'bg-green-500', label: 'Planos' },
  'Funcionalidades': { icon: Settings, color: 'bg-purple-500', label: 'Funcionalidades' },
  'Técnico': { icon: Bug, color: 'bg-red-500', label: 'Técnico' },
  'Segurança': { icon: Shield, color: 'bg-orange-500', label: 'Segurança' }
};

export function SupportFAQ({ onSelectQuestion }: SupportFAQProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Filter FAQ items based on search and category
  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleQuestionSelect = (question: string) => {
    if (onSelectQuestion) {
      onSelectQuestion(question);
    }
  };

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-text mb-2">Central de Ajuda</h2>
          <p className="text-text-muted">
            Encontre respostas rápidas para suas dúvidas mais comuns
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Buscar perguntas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter Tabs */}
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger 
            value="all" 
            className="flex items-center gap-1 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            Todas ({faqData.length})
          </TabsTrigger>
          {categories.map(category => {
            const config = categoryConfig[category as keyof typeof categoryConfig];
            const count = faqData.filter(item => item.category === category).length;
            return (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="flex items-center gap-1 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <config.icon className="h-3 w-3" />
                {config.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* FAQ Items - All Categories */}
        <TabsContent value="all" className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card className="bg-surface border">
                <CardContent className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <h3 className="font-medium text-text mb-2">Nenhuma pergunta encontrada</h3>
                  <p className="text-sm text-text-muted">
                    Tente ajustar os filtros ou fazer uma nova busca.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((item) => {
                const config = categoryConfig[item.category as keyof typeof categoryConfig];
                const isExpanded = expandedItems.has(item.id);
                
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader 
                      className="pb-3 cursor-pointer"
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={cn('p-2 rounded-lg', config.color)}>
                            <config.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base text-text mb-1">
                              {item.question}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              <Badge variant="outline" className="text-xs">
                                {config.label}
                              </Badge>
                              <span>•</span>
                              <span>{item.helpful} pessoas acharam útil</span>
                              <span>•</span>
                              <span>Atualizado em {new Date(item.lastUpdated).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuestionSelect(item.question);
                            }}
                            className="text-xs"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Usar esta pergunta
                          </Button>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-text-muted" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-text-muted" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <p className="text-sm text-text-muted leading-relaxed">
                            {item.answer}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2"
                              >
                                👍 Útil ({item.helpful})
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2"
                              >
                                👎 Não útil
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* FAQ Items - Individual Categories */}
        {categories.map(category => {
          const categoryFAQs = faqData.filter(item => item.category === category);
          const filteredCategoryFAQs = categoryFAQs.filter(item => {
            const matchesSearch = searchTerm === '' || 
              item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return matchesSearch;
          });

          return (
            <TabsContent key={category} value={category} className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {filteredCategoryFAQs.length === 0 ? (
                  <Card className="bg-surface border">
                    <CardContent className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-text-muted mx-auto mb-4" />
                      <h3 className="font-medium text-text mb-2">Nenhuma pergunta encontrada</h3>
                      <p className="text-sm text-text-muted">
                        Tente ajustar os filtros ou fazer uma nova busca.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredCategoryFAQs.map((item) => {
                    const config = categoryConfig[item.category as keyof typeof categoryConfig];
                    const isExpanded = expandedItems.has(item.id);
                    
                    return (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardHeader 
                          className="pb-3 cursor-pointer"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={cn('p-2 rounded-lg', config.color)}>
                                <config.icon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-base text-text mb-1">
                                  {item.question}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                  <Badge variant="outline" className="text-xs">
                                    {config.label}
                                  </Badge>
                                  <span>•</span>
                                  <span>{item.helpful} pessoas acharam útil</span>
                                  <span>•</span>
                                  <span>Atualizado em {new Date(item.lastUpdated).toLocaleDateString('pt-BR')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuestionSelect(item.question);
                                }}
                                className="text-xs"
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Usar esta pergunta
                              </Button>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-text-muted" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-text-muted" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        {isExpanded && (
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <p className="text-sm text-text-muted leading-relaxed">
                                {item.answer}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-6 px-2"
                                  >
                                    👍 Útil ({item.helpful})
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-6 px-2"
                                  >
                                    👎 Não útil
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>
          );
        })}

        {/* Footer */}
        <div className="text-center pt-4 border-t mt-4">
          <p className="text-sm text-text-muted mb-2">
            Não encontrou o que procurava?
          </p>
          <Button
            variant="outline"
            onClick={() => handleQuestionSelect('')}
            className="text-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Criar um ticket de suporte
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
