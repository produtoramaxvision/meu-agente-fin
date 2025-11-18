# Kit UI/UX do Meu Agente

Documento de referência para replicar a experiência visual e interativa do Meu Agente em novos produtos. Todas as diretrizes abaixo foram extraídas do código-fonte atual e mantêm compatibilidade com o ecossistema shadcn/ui.

---

## 1. Visão Geral

- **Eixo visual**: paleta monocromática preto/cinza com acentos em gradientes brand-900 → brand-700 e semânticos vibrantes para estados financeiros.
- **Arquitetura**: shell composto por Sidebar persistente (desktop), Drawer animado (mobile), Header contextual, Footer institucional e conteúdo em cartões/glassmorphism.
- **Tecnologias**: Tailwind + shadcn/ui + Radix; tokens centralizados via CSS vars em `src/index.css`.
- **Interações**: animações curtas (200–400 ms), gradientes em hover, feedbacks persistentes (toasts, skeletons), e forte foco em acessibilidade (prefers-reduced-motion, tooltips sr-only, aria labels).

---

## 2. Fundamentos Visuais (Tokens)

### 2.1 Registro de tokens no Tailwind

O tema Tailwind aponta diretamente para as variáveis CSS, expondo cores, tipografias, espaçamentos, sombras, keyframes e animações customizadas.

```23:210:tailwind.config.ts
    extend: {
      colors: {
        /* Design System Colors */
        brand: {
          50: "hsl(var(--color-brand-50))",
          ...
        },
        bg: "hsl(var(--color-bg))",
        surface: {
          DEFAULT: "hsl(var(--color-surface))",
          ...
        },
        text: {
          DEFAULT: "hsl(var(--color-text))",
          ...
        },
        ...
        sidebar: {
          bg: "hsl(var(--sidebar-bg))",
          ...
        },
        /* Legacy shadcn colors */
        background: "hsl(var(--background))",
        ...
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        xs: "var(--font-size-xs)",
        ...
      },
      spacing: {
        2: "var(--space-2)",
        ...
      },
      boxShadow: {
        1: "var(--shadow-1)",
        ...
      },
      borderRadius: {
        lg: "var(--radius)",
        ...
      },
      keyframes: {
        "accordion-down": { ... },
        "fade-in": { ... },
        "shimmer": { ... },
        "premium-pulse": { ... },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        ...
      },
    },
```

### 2.2 Paleta light/dark

| Grupo            | Light (`data-theme="light"`) | Dark (`data-theme="dark"`) |
|------------------|------------------------------|----------------------------|
| **Brand escala** | 0 – 98% de luminosidade (`--color-brand-*`) | Invertida (0 – 98%) para contrastes no dark |
| **Fundo**        | `--color-bg: 0 0% 98%`       | `--color-bg: 0 0% 5%`      |
| **Superfícies**  | `--color-surface: 0 0% 100%`, hover 94% | `--color-surface: 0 0% 8%`, hover 14% |
| **Texto**        | Preto pleno / 40% muted / branco invertido | Branco pleno / 60% muted / preto invertido |
| **Bordas**       | 88% (padrão), 70% (forte)    | 18% / 28%                   |
| **Focus**        | Azul 210/80/50 (light)       | Roxo 269/91/65 (dark)       |
| **Semânticas**   | Verde 142, Laranja 38, Vermelho 0, Azul 199 (versões bg suaves) | Contrapartes saturadas e bg escuros |
| **Sidebar**      | Branco puro com texto preto/muted | BG 6%, texto inverso, hover 12% |

```10:206:src/index.css
:root[data-theme="light"] {
  --color-brand-50: 0 0% 98%;
  ...
  --color-danger: 0 84% 60%;
  ...
  --chart-5: 269 91% 65%;
}
:root[data-theme="dark"] {
  --color-bg: 0 0% 5%;
  ...
  --color-info: 199 89% 60%;
  ...
  --chart-5: 269 91% 65%;
}
:root {
  --font-sans: 'Inter', ...;
  --space-2: 0.5rem;
  ...
}
```

### 2.3 Tipografia e hierarquia

- **Primária**: `Inter` (fallbacks do sistema) via `--font-sans`.
- **Mono**: usada em IDs e métricas (`--font-mono`).
- **Escala**: XS 12 px → 3XL 30 px (via `--font-size-*`).
- **Títulos**: `@apply font-semibold` para `h1–h6`.

### 2.4 Espaçamentos, raios e sombras

- Espaços tokenizados (`--space-2 … 32`) suportam o grid de cartões (padding 24–32 px).
- Raio padrão `--radius` (0.5 rem light / 0.75 rem dark) com variações calculadas.
- Sombras suaves `--shadow-1/2/3` e brilho `--shadow-glow` reforçam efeito glass no dark.

### 2.5 Semântica financeira e gráficos

- Paleta para gráficos (`--chart-1 … 5`) repetida em dashboards, relatórios e alertas.
- Estados financeiros (receita/despesa) usam hard-coded `#39a85b` e `#a93838` nos cards principais para facilitar leitura rápida (`src/pages/Dashboard.tsx`).

### 2.6 Regras globais de foco e a11y

- Todos os elementos recebem `border-border`; foco visível aplica `ring-2` e offset, com cor derivada de `--color-focus`.
- Scrollbars customizados e variantes `.custom-scrollbar`, `.thin-scrollbar`, `.smooth-scrollbar`.
- Matriz de `prefers-reduced-motion` desativa animações, framer-motion e transformações de hover.

```233:583:src/index.css
@layer utilities {
  .scrollbar-hide { ... }
  @keyframes shake { ... }
  .animate-fade-in { ... }
  ::-webkit-scrollbar { ... }
  ...
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after { animation-duration: 0.01ms !important; ... }
  [data-framer-motion] { animation: none !important; }
  ...
}
```

---

## 3. Layout Estrutural e Shell

### 3.1 AppLayout

- Provider único envolvendo `NotificationProvider`, `ThemeProvider`, `AuthProvider` (via `App.tsx`).
- `AppLayout` gerencia estado colapsado da Sidebar, overlay móvel com animações de entrar e sair, e hook `useScrollToTop`.
- Conteúdo central com `max-w-[1920px]`, paddings responsivos e Footer fixo.

```14:90:src/components/layout/AppLayout.tsx
export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  ...
  return (
    <NotificationProvider>
      <div className="flex h-screen w-full bg-bg overflow-hidden">
        <div className="hidden md:block h-[calc(100vh-2.6rem)]">
          <AppSidebar ... />
        </div>
        {(sidebarOpen || isClosing) && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} />
            <div className={`fixed left-0 top-0 h-full w-64 transition-transform duration-300 ${isClosing ? 'animate-out slide-out-to-left' : 'animate-in slide-in-from-left'}`}>
              <AppSidebar showCloseButton />
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <AppHeader ... />
          <main className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">{children}</div>
          </main>
          <AppFooter />
        </div>
      </div>
    </NotificationProvider>
  );
}
```

### 3.2 Sidebar responsiva

- Estados: colapsada (16 px), expandida (64 px), overlay mobile (Drawer).
- Itens com gradiente brand-900/700 para ativos; hover aplica escala, sombra e “varredura” (`group-hover translate-x`).
- Integra blocos QuickActions, Ajuda/Suporte, Logout com loader.
- Ping para notificações não lidas e heurísticas anti-clique acidental.

```149:236:src/components/layout/AppSidebar.tsx
<nav className={cn("flex-1 space-y-1 ...", collapsed ? 'p-2' : 'p-4')}>
  {navigation.map((item) => (
    <NavLink
      className={cn(
        'group relative overflow-hidden flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-gradient-to-r from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] text-white shadow-lg'
          : 'text-[hsl(var(--sidebar-text-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:scale-105 hover:shadow-lg',
        collapsed && 'justify-center'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      ...
    </NavLink>
  ))}
</nav>
```

### 3.3 Cabeçalho e busca unificada

- Botão hambúrguer animado (troca Menu ↔ X).
- Campo de busca global com shake vermelho quando vazio ou sem resultados, sincronia automática com `SearchContext`, fallback para página de Tarefas.
- Pilha de ações: `ThemeSwitch`, `NotificationBell`, informações do usuário e avatar com fallback de iniciais.

```68:142:src/components/layout/AppHeader.tsx
<Input
  placeholder="Buscar tarefas ou transações..."
  className={cn("pl-9 pr-10 bg-surface transition-all duration-300", showError && "border-red-500/50 animate-shake")}
  value={localSearch}
  ...
/>
{showError && <AlertCircle ... className="text-red-500 animate-pulse" />}
...
<ThemeSwitch />
<NotificationBell />
<Avatar>
  <AvatarImage src={cliente.avatar_url} />
  <AvatarFallback className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
    {getInitials(cliente.name)}
  </AvatarFallback>
</Avatar>
```

### 3.4 Rodapé institucional

- Sempre visível, texto XS, link com underline on hover.

```5:21:src/components/layout/AppFooter.tsx
<footer className="w-full py-3 px-4 border-t border-border bg-bg text-center text-xs text-text" role="contentinfo">
  ...
</footer>
```

### 3.5 Theming e persistência

- `ThemeContext` inicia em dark, sincroniza com `localStorage` e aplica `data-theme` na raiz. O switch usa botão ghost com gradiente em hover.

```13:47:src/contexts/ThemeContext.tsx
const [theme, setTheme] = useState<Theme>(() => {
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
});
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);
```

```5:27:src/components/ds/ThemeSwitch.tsx
<Button
  role="switch"
  aria-checked={theme === 'dark'}
  className="h-9 w-9 group relative overflow-hidden rounded-lg p-2 transition-all duration-200 hover:scale-105"
>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full ..." />
</Button>
```

---

## 4. Componentes Base e Padrões

### 4.1 Botões shadcn customizados

- Variantes com gradientes para ações principais, bordas translúcidas para outline e ghost minimal.
- Todas as variantes herdam `ring-offset` e suportam ícones (auto sizing 16 px).

```1:47:src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 ... focus-visible:ring-2 ...",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-brand-500 to-brand-400 ...",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 ...",
        outline: "border-2 border-brand-500/50 ...",
        ...
      },
      size: { default: "h-10 px-4 py-2", ... }
    }
  }
);
```

Diretrizes:
- Use `variant="default"` para CTAs; `outline/ghost` para filtros ou triggers.
- Ícones devem ficar antes do texto e aproveitar o `gap-2`.

### 4.2 Cards e superfícies

- Base com borda semitransparente, sombra suave e blur (“glass”).
- Headers/footers padronizados `p-6`.

```5:52:src/components/ui/card.tsx
<div className="rounded-xl border border-border/50 bg-surface text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm" />
```

### 4.3 Inputs e formulários

- Inputs forçam `controlledValue` para evitar warnings.
- Estilo: altura 40 px, borda `border-input`, `focus-visible:ring-2`.

```5:29:src/components/ui/input.tsx
const controlledValue = value === undefined ? '' : value;
<input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ..." />
```

### 4.4 Dialogs, Popovers e menus

- `QuickActions` concentra fluxos de criação com `Dialog` e botões gradientes.
- `NotificationBell` e `PeriodFilter` usam `Popover` com headers, ações e calendários responsivos.

```109:200:src/components/QuickActions.tsx
<button className="group relative overflow-hidden ... hover:scale-105 hover:shadow-lg">
  ...
</button>
<DialogContent className="sm:max-w-[400px]"> ... </DialogContent>
```

```11:33:src/components/NotificationBell.tsx
<Button variant="ghost" size="icon" className="relative h-9 w-9 group ...">
  ...
  {unreadCount > 0 && <span className="absolute -top-1 -right-1 ...">
    <span className="animate-ping ..." />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
  </span>}
</Button>
```

```118:169:src/components/PeriodFilter.tsx
<Popover open={isOpen}>
  <Button
    variant="outline"
    className="w-full sm:w-[260px] ... group relative overflow-hidden ... hover:scale-105"
  >
    <CalendarIcon ... />
    {formatDateDisplay()}
  </Button>
  <PopoverContent className="w-auto p-2 space-y-2">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <Button variant={preset === 'today' ? 'default' : 'ghost'} size="sm">Hoje</Button>
      ...
    </div>
    <Calendar ... />
  </PopoverContent>
</Popover>
```

### 4.5 Context menus e ações

- `ActionMenu` encapsula DropdownMenu e ContextMenu compartilhando itens.

```1:59:src/components/ui/ActionMenu.tsx
export function ActionMenu({ children, items }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        {items.map(...)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 4.6 Cartões interativos e estados

- `NotificationItem` demonstra badges dinâmicos, `ActionMenu`, context menu e indicadores de leitura.

```32:135:src/components/NotificationItem.tsx
const typeConfig = { pagamento: { icon: CreditCard, color: 'bg-green-100 ...' }, ... };
<div className={cn('group relative ...', !notification.lida ? 'bg-surface-2 border-primary/20' : 'bg-surface border-border/50')}>
  {!notification.lida && <div className="absolute ... bg-primary animate-pulse" />}
  <ActionMenu items={actionMenuItems}>...</ActionMenu>
  ...
</div>
```

- `TaskItem` combina motion para entrada/hover, badges de prioridade/status, quick actions e popover com formulário inline.

```128:292:src/components/TaskItem.tsx
<motion.div className={cn('group relative rounded-lg border ...', priorityVisual.color, ...)} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} whileHover={{ y: -2, scale: 1.02 }}>
  ...
  <Badge variant="outline" className={cn('text-xs', statusConfig[task.status].color)}>...</Badge>
</motion.div>
<Popover ...>
  <TaskForm ... />
</Popover>
```

---

## 5. Páginas, Módulos e Widgets

### 5.1 Dashboard financeiro

- Hero com gradiente, filtro temporal (`PeriodFilter`) e grade de cartões animados focados em receita, despesa, saldo e total de transações.
- Zona esquerda: `AreaChart` com gradientes custom, grade desativada vertical, tooltips temáticos.
- Zona direita: `PieChart` com gradientes multi-tons, tabs para despesas/receitas e cards auxiliares (metas, contas a pagar, tarefas urgentes).
- Base: lista de transações com context menu + formulário rápido `FinanceRecordForm`.

```175:572:src/pages/Dashboard.tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  <Card className="group relative overflow-hidden ...">
    <CardTitle className="text-sm font-medium text-text-muted">Total Receitas</CardTitle>
    <CardContent> ... currency ... </CardContent>
  </Card>
  ...
</div>
...
<ResponsiveContainer width="100%" height={350}>
  <AreaChart data={dailyData}>
    <defs>
      <linearGradient id="colorEntradas" ... />
      ...
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
    ...
  </AreaChart>
</ResponsiveContainer>
...
<Tabs value={categoryType}>
  <TabsTrigger value="saida">Despesas</TabsTrigger>
  ...
</Tabs>
...
<ContextMenu>
  <div className="... hover:scale-[1.02] hover:shadow-lg">
    ...
  </div>
</ContextMenu>
```

### 5.2 Agenda omnicanal

- Header com CTA “Atualizar”, Tabs com 6 vistas (dia, semana, mês, agenda, timeline, ano) e descrições sr-only.
- Card de filtros com chips multi-seletivos e busca com debounce.
- Área principal troca componentes especializados (GridDay, Timeline, Heatmap) mantendo loader centralizado.
- Sidebar lateral traz CTA “Novo Evento”, calendário pequeno com resumo do intervalo selecionado e CTA “Hoje”, além de `UpcomingTasksCard`.
- Atalhos de teclado implementados (Ctrl+F, /, N, setas) e `toast` de feedback.

```390:742:src/pages/Agenda.tsx
<Tabs value={view} onValueChange={(v) => handleViewChange(v as View)} ...>
  <TabsList className="grid grid-cols-3 xs:grid-cols-6 gap-1 p-1">
    <TabsTrigger value="day" className={triggerClasses}>Dia</TabsTrigger>
    ...
  </TabsList>
</Tabs>
...
<AgendaFilters ... onClearFilters={onClearFilters} />
...
{view === 'day' && <AgendaGridDay ... />}
{view === 'timeline' && <AgendaTimeline ... />}
...
<button className="group relative ... bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] ..." aria-describedby="new-event-description">
  ...
</button>
```

### 5.3 Contas (a pagar / receber)

- Header com gradiente, filtro de categoria e CTA de “Nova Transação”.
- Métricas em cards animados e tabs com quatro estados (a pagar, a receber, pagas, recebidas) reutilizando `Card` com `renderContent()`.
- `ContaItem` (não exibido no snippet) adiciona tags de status com cores específicas, botões “Marcar como pago” e menus contextuais.

```151:374:src/pages/Contas.tsx
<Select value={categoryFilter} onValueChange={setCategoryFilter}>...</Select>
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  <Card className="group relative overflow-hidden ...">
    <CardTitle>A Pagar</CardTitle>
    <div className="text-2xl font-bold text-[#a93838]">{...}</div>
  </Card>
  ...
</div>
<Tabs value={tabFilter}>
  <TabsTrigger value="a-pagar">A Pagar</TabsTrigger>
  ...
  <TabsContent value="a-pagar">
    <Card className="relative rounded-xl border-2 border-border/40 bg-surface ...">
      <CardTitle>{getTabTitle()}</CardTitle>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

### 5.4 Tarefas

- Estrutura com CTA desktop/mobile, `TaskStats` cards, filtros (tabs + search) e lista com `TaskItem`.
- Estados vazios motivacionais com CTAs, skeletons em loading, e modais `TaskForm` + `DeleteTaskDialog`.

```89:246:src/pages/Tasks.tsx
<TaskStats tasks={tasks} />
<TaskFilters ... />
<Card className="relative rounded-xl border-2 border-border/40 bg-surface ...">
  {isLoading ? <Skeleton ... /> : tasks.length > 0 ? <TaskItem ... /> : <empty state />}
</Card>
```

### 5.5 Relatórios

- Tela avançada com múltiplos filtros (período, categoria, tipo, busca, custom range) e controles de sort/paginação/bulk actions/export (CSV/PDF).
- Insights: gráficos mensais, pizza categórica, timeline de status e cards de métricas.
- Export se integra a `toast` e `Blob`, garantindo BOM e progress feedback.

```48:399:src/pages/Reports.tsx
const [periodFilter, setPeriodFilter] = useState('month');
...
const handleExportCSV = () => {
  const headers = ['Data', 'Tipo', ...];
  const rows = filteredAndSortedRecords.map(...);
  const csvContent = BOM + [headers, ...rows].map(...).join('\n');
  ...
  toast.success("Relatório exportado com sucesso!", { ... });
};
```

### 5.6 Notificações & Alertas

- Tabs “Notificações” e “Alertas Financeiros” com contadores, skeletons e empty states ilustrados.
- Cards de alertas (`AlertsSection`) exibem indicadores de contas vencendo/vencidas, saldo mensal, status geral, insights e recomendações com cores contextuais.

```36:163:src/pages/Notifications.tsx
<Tabs defaultValue="notifications">
  <TabsList className="grid w-full grid-cols-2 ...">
    <TabsTrigger value="notifications">...</TabsTrigger>
    <TabsTrigger value="alerts">...</TabsTrigger>
  </TabsList>
  <TabsContent value="notifications">
    <Card className="group relative overflow-hidden ...">
      <Tabs value={filter}>...</Tabs>
      <CardContent>
        {loading ? <SkeletonNotification /> : <NotificationItem ... />}
      </CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="alerts">
    <AlertsSection />
  </TabsContent>
</Tabs>
```

### 5.7 Metas e carteiras

- `Goals` exibe CTA e cards animados; `GoalListItem` incorpora `Progress`, badges “Principal”, context menu para editar/duplicar/excluir e alert dialogs.

```26:89:src/pages/Goals.tsx
<GoalForm onSuccess={refetch}>
  <button className="group relative ... bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] ...">
    Nova Meta
  </button>
</GoalForm>
...
{goals.length > 0 ? goals.map(goal => <GoalListItem ... />) : <Card className="p-12">...</Card>}
```

### 5.8 Perfil e assinatura

- `Profile` organiza seções pessoais, privacidade, backup, configurações e planos dentro de `AnimatedTabs`, que ajusta experiência para desktop/tablet/mobile e usa `framer-motion` para transições suaves.

```162:402:src/pages/Profile.tsx
const tabs = [
  { id: "personal", label: "Pessoal", content: <Card><AvatarUpload ... /></Card> },
  { id: "privacy", ... },
  ...
];
<AnimatedTabs defaultTab={searchParams.get('tab') || "personal"} tabs={tabs} />
```

### 5.9 Autenticação

- Tela login/registro step-by-step com `AnimatePresence`, `motion.form` e CTA contextuais. Campos possuem ícones, máscaras (telefone/CPF) e feedbacks de loading.
- Botão Ajuda flutuante reutiliza `HelpAndSupport`.

```175:443:src/pages/auth/Login.tsx
<AnimatePresence mode="wait">
  {step === 'phone' && (
    <motion.form variants={slideVariants} ...>
      <Input placeholder="55 (11) 9 8451-2354" />
      ...
    </motion.form>
  )}
  ...
</AnimatePresence>
```

---

## 6. Animações, Feedback e Acessibilidade

### 6.1 Tailwind keyframes

- `fade-in`, `scale-in`, `shimmer`, `premium-pulse`, `accordion-up/down` definidos no tema (ver seção 2.1).
- Utilização recorrente (cards, skeletons, nav) garante consistência temporal (0.2–0.5 s).

### 6.2 Utilitários customizados

- `animate-shake` aplicado em buscas inválidas; `animate-fade-in` em praticamente todos os cards para “stagger”.
- Scrollbars personalizados por contexto (padrão, `.custom-scrollbar`, `.thin-scrollbar`, `.hide-scrollbar`) mantêm identidade inclusive em dark mode.

```233:366:src/index.css
@keyframes shake { ... }
.animate-shake { animation: shake 0.3s ease-in-out; }
.animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
::-webkit-scrollbar { width: 8px; ... }
.custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--color-brand-400)); ... }
```

### 6.3 Framer Motion & componentes interativos

- `TaskItem`, `AnimatedTabs` e `Login` usam `motion` para transições suaves, loops e microinterações (rotate, scale, blur).

```20:160:src/components/ui/animated-tabs.tsx
<motion.div layoutId="active-tab-desktop" className="absolute inset-0 bg-background shadow-sm ..." transition={{ type: "spring", duration: 0.6, bounce: 0.2 }} />
...
<AnimatePresence mode="wait">
  {tabs.map(tab => activeTab === tab.id && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
    >
      {tab.content}
    </motion.div>
  ))}
</AnimatePresence>
```

### 6.4 Feedbacks e loading

- `Skeleton`, `Spinner`, badges pulsantes, `toast` (mensagens de sucesso/erro) e pings para notificações (gradiente + animação `animate-ping`).
- `NotificationItem` e `ContaItem` usam badges coloridos + `formatDistanceToNow`.

### 6.5 Acessibilidade

- Uso extensivo de `aria-label`, `aria-describedby`, sr-only para instruções (Agenda tabs, botões “Hoje”, CTA “Novo Evento”).
- `prefers-reduced-motion` remove animações e transições.
- Atalhos de teclado na Agenda (Ctrl+F, N, setas, /) reduzem fricção para usuários power-user.

---

## 7. Diretrizes Práticas para Novos Produtos

1. **Paleta e gradientes**  
   - Base monocromática; reserve cores vibrantes para KPIs (verde receita, vermelho despesa) e estados semânticos.  
   - Gradientes brand-900 → brand-700 identificam CTAs críticos; aplicar `hover:scale-105` + “scan light” (div `absolute` com translate-x).

2. **Espaçamento e grid**  
   - Cards: `p-6`, `gap-6` entre colunas, `max-w-[1920px]` e gutters responsivos `px-4/6/8`.  
   - Sidebar mobile ocupa largura fixa 256px e sobrepõe com backdrop 50% (ver `AppLayout`).

3. **Tipografia e hierarquia**  
   - Títulos principais: `text-4xl font-extrabold` + gradiente.  
   - Subtítulos: `text-text-muted mt-2`.  
   - Campos e labels utilizam `text-sm` e ícones lucide 16–20 px.

4. **Componentização**  
   - Extenda `Button`, `Card`, `Input`, `Dialog`, `Tabs`, `Popover` do pacote `src/components/ui` para garantir consistência com tokens.  
   - Use `ActionMenu` + `ContextMenu` para menus contextuais e `QuickActions` como blueprint de hubs multi-CTA.

5. **Estados e animações**  
   - Aplique `animate-fade-in` e delays incremental (`style={{ animationDelay: '${index * 50}ms' }}`) para listas.  
   - Para feedback negativo (busca vazia), utilize `animate-shake` + cores semânticas.  
   - Sempre espelhe `prefers-reduced-motion`.

6. **Interações e acessos**  
   - Todos os controles de filtro devem ter equivalentes mobile (Tabs, Select, Drawer).  
   - Forneça tooltips sr-only quando ações dependem de ícones (Agenda Tabs, botões ghost).

7. **Dados e visualizações**  
   - Reutilize paleta `--chart-*` nos gráficos; degrade os twin colors (#39a85b / #a93838) para “receitas x despesas”.  
   - Box plot/legendas devem incluir porcentagem e valor em BRL com `Intl.NumberFormat('pt-BR')`.

8. **Feedback operacional**  
   - Exportações, duplicações e exclusões sempre exibem `toast` com descrição e fallback (ver `Reports` e `NotificationItem`).  
   - Ao interagir com dados críticos (logout, exclusão), adicione `AlertDialog` e estado de loading (`Loader2`).

9. **Acessibilidade contínua**  
   - Use `aria-label` para botões icon-only e `role="switch"` no `ThemeSwitch`.  
   - Garanta contraste mínimo (text-muted no dark ≈ 60% de luminância).

Seguir estes padrões assegura que novas superfícies mantenham o DNA visual do Meu Agente, aproveitando o ecossistema shadcn/ui + Tailwind já configurado, reduzindo esforço de re-design e garantindo consistência entre produtos.

---

