import { useState, useMemo, useRef, useEffect } from 'react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { Download, ArrowUpIcon, ArrowDownIcon, TrendingUp, FileText, CalendarIcon, X, ArrowUpDown, Trash2, Copy, Edit, CheckCircle, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DeleteRecordDialog } from '@/components/DeleteRecordDialog';
import { BulkDeleteDialog } from '@/components/BulkDeleteDialog';
import { EditRecordDialog } from '@/components/EditRecordDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from '@/components/ui/context-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const EXPENSE_COLORS = [
  { start: '#FF6B6B', end: '#fa5252' }, // Red
  { start: '#FD7E14', end: '#ff922b' }, // Orange
  { start: '#F06595', end: '#f783ac' }, // Pink
  { start: '#FAB005', end: '#ffd43b' }, // Yellow
  { start: '#E03131', end: '#c92a2a' }, // Darker Red
  { start: '#D9480F', end: '#bf3604' }, // Darker Orange
];

const INCOME_COLORS = [
  { start: '#40C057', end: '#69db7c' }, // Green
  { start: '#12B886', end: '#40c057' }, // Teal
  { start: '#15AABF', end: '#3bc9db' }, // Cyan
  { start: '#228BE6', end: '#4dabf7' }, // Blue
  { start: '#4C6EF5', end: '#748ffc' }, // Indigo
  { start: '#2F9E44', end: '#51cf66' }, // Darker Green
];

export default function Reports() {
  const { cliente } = useAuth();
  const { searchQuery, setSearchQuery, setHasResults } = useSearch();
  const [periodFilter, setPeriodFilter] = useState<string>('month');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'entrada' | 'saida' | 'all'>('all');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [sortColumn, setSortColumn] = useState<'data_hora' | 'valor' | 'categoria'>('data_hora');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryType, setCategoryType] = useState<'entrada' | 'saida'>('saida');
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [selectedRecords, setSelectedRecords] = useState<Set<number>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<any>(null);
  const recordsPerPage = 50;
  const transactionsTableRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to transactions table on search
  useEffect(() => {
    if (searchQuery && transactionsTableRef.current) {
      transactionsTableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchQuery]);

  // Memoize period in days to prevent infinite loop
  const periodDays = useMemo(() => {
    // Se for período customizado, calcula diferença em dias
    if (periodFilter === 'custom' && customStartDate && customEndDate) {
      const diffTime = customEndDate.getTime() - customStartDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    
    switch (periodFilter) {
      case 'month':
        return 30;
      case '3months':
        return 90;
      case 'year':
        return 365;
      default:
        return 30;
    }
  }, [periodFilter, customStartDate, customEndDate]);

  const { records, loading, metrics, getCategoryData, getMonthlyData, getInsights, refetch } = useFinancialData(
    periodDays,
    categoryFilter,
    typeFilter
  );

  const categoryData = getCategoryData(categoryType);
  const monthlyData = getMonthlyData();
  const insights = getInsights(categoryType);

  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;

    try {
      const { error } = await supabase
        .from('financeiro_registros')
        .delete()
        .eq('id', recordToDelete.id);

      if (error) throw error;

      toast({
        title: "Registro excluído",
        description: "O registro foi removido com sucesso.",
      });

      refetch();
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o registro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedRecords.map(r => r.id));
      setSelectedRecords(allIds);
    } else {
      setSelectedRecords(new Set());
    }
  };

  const handleSelectRecord = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRecords);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRecords(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedRecords.size === 0) return;

    setIsBulkDeleting(true);
    try {
      const { error } = await supabase
        .from('financeiro_registros')
        .delete()
        .in('id', Array.from(selectedRecords));

      if (error) throw error;

      toast({
        title: "Registros excluídos",
        description: `${selectedRecords.size} ${selectedRecords.size === 1 ? 'registro foi excluído' : 'registros foram excluídos'} com sucesso.`,
      });

      refetch();
      setSelectedRecords(new Set());
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir em massa:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir os registros. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDuplicateRecord = async (record: any) => {
    try {
      const { error } = await supabase
        .from('financeiro_registros')
        .insert({
          phone: record.phone,
          tipo: record.tipo,
          categoria: record.categoria,
          valor: record.valor,
          descricao: record.descricao,
          data_hora: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Registro duplicado",
        description: "Uma cópia do registro foi criada com sucesso.",
      });

      refetch();
    } catch (error) {
      console.error('Erro ao duplicar:', error);
      toast({
        title: "Erro ao duplicar",
        description: "Não foi possível duplicar o registro. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const COLORS = categoryType === 'saida' ? EXPENSE_COLORS : INCOME_COLORS;

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 12}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" className="text-sm font-semibold">
          {payload.name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))" className="text-xs">
          {`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records.filter((record) =>
      searchQuery === '' || 
      record.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort records
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case 'data_hora':
          comparison = new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime();
          break;
        case 'valor':
          comparison = Number(a.valor) - Number(b.valor);
          break;
        case 'categoria':
          comparison = a.categoria.localeCompare(b.categoria);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [records, searchQuery, sortColumn, sortDirection]);

  // Notify SearchContext when results change
  useEffect(() => {
    const hasResults = searchQuery === '' || filteredAndSortedRecords.length > 0;
    setHasResults(hasResults);
  }, [filteredAndSortedRecords.length, searchQuery, setHasResults]);

  // Get unique categories
  const uniqueCategories = Array.from(new Set(records.map((r) => r.categoria)));

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRecords.length / recordsPerPage);
  const paginatedRecords = filteredAndSortedRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Get selected records data for bulk dialog
  const selectedRecordsData = paginatedRecords.filter(r => selectedRecords.has(r.id));

  // Handle sort
  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setPeriodFilter('month');
    setCategoryFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
    setCurrentPage(1);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Data', 'Tipo', 'Status', 'Categoria', 'Descrição', 'Valor'];
    const rows = filteredAndSortedRecords.map((r) => [
      new Date(r.data_hora).toLocaleDateString('pt-BR'),
      r.tipo === 'entrada' ? 'Entrada' : 'Saída',
      r.status === 'pago' ? 'Pago' : 'Pendente',
      r.categoria,
      r.descricao || '',
      Number(r.valor).toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Export to PDF
  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Relatorio Financeiro', 14, 22);
    
    // Subtítulo com data
    doc.setFontSize(10);
    doc.text(`Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
    
    // Métricas resumidas
    doc.setFontSize(12);
    doc.text(`Total de Receitas: R$ ${metrics.totalReceitas.toFixed(2)}`, 14, 40);
    doc.text(`Total de Despesas: R$ ${metrics.totalDespesas.toFixed(2)}`, 14, 47);
    doc.text(`Saldo: R$ ${metrics.saldo.toFixed(2)}`, 14, 54);
    
    // Tabela de transações
    doc.setFontSize(10);
    let y = 65;
    doc.text('Data', 14, y);
    doc.text('Tipo', 40, y);
    doc.text('Status', 60, y);
    doc.text('Categoria', 85, y);
    doc.text('Descricao', 125, y);
    doc.text('Valor', 180, y);
    
    y += 7;
    filteredAndSortedRecords.slice(0, 50).forEach((r) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(format(new Date(r.data_hora), 'dd/MM/yyyy'), 14, y);
      doc.text(r.tipo === 'entrada' ? 'Entrada' : 'Saida', 40, y);
      doc.text(r.status === 'pago' ? 'Pago' : 'Pendente', 60, y);
      doc.text(r.categoria.substring(0, 15), 85, y);
      doc.text((r.descricao || '').substring(0, 20), 125, y);
      doc.text(`R$ ${Number(r.valor).toFixed(2)}`, 180, y);
      y += 7;
    });
    
    doc.save(`relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  if (loading) {
    return (
      <div className="py-4 sm:py-6 lg:py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent drop-shadow-sm">Relatórios</h1>
          <p className="text-text-muted mt-2">Análise detalhada das suas finanças</p>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Estado vazio - sem dados
  if (!loading && records.length === 0) {
    return (
      <div className="py-4 sm:py-6 lg:py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent drop-shadow-sm">Relatórios</h1>
          <p className="text-text-muted mt-2">Análise detalhada das suas finanças</p>
        </div>
        
        <Card className="p-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="h-20 w-20 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
              <FileText className="h-10 w-10 text-[hsl(var(--muted-foreground))]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
                Nenhum registro financeiro encontrado
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] max-w-md">
                Comece adicionando suas primeiras transações na página de Dashboard para visualizar relatórios e análises detalhadas.
              </p>
            </div>
            <Button asChild size="lg" className="mt-4">
              <a href="/dashboard">Ir para Dashboard</a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 lg:py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-extrabold bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent drop-shadow-sm">Relatórios</h1>
          <p className="text-text-muted mt-2">Análise detalhada das suas finanças</p>
        </div>
        
        {/* Grupo de botões de exportação */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
          <button
            onClick={handleExportPDF}
            className="group relative overflow-hidden rounded-lg px-4 py-2 transition-all duration-200 bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4 text-white transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold text-white">Exportar PDF</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          
          <button
            onClick={handleExportCSV}
            className="group relative overflow-hidden rounded-lg px-4 py-2 transition-all duration-200 bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4 text-white transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold text-white">Exportar CSV</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <button
            onClick={clearFilters}
            className="group relative overflow-hidden rounded-lg px-3 py-1.5 transition-all duration-200 bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] hover:shadow-lg hover:scale-105 flex items-center gap-2"
          >
            <X className="h-4 w-4 text-white transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold text-white hidden sm:inline">Limpar Filtros</span>
          </button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="entrada">Entradas</SelectItem>
                  <SelectItem value="saida">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <Input
                placeholder="Descrição ou categoria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Custom Date Range */}
          {periodFilter === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Data Inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customStartDate ? format(customStartDate, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Data Final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customEndDate ? format(customEndDate, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      initialFocus
                      disabled={(date) => customStartDate ? date < customStartDate : false}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '0ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-text-muted">Total Receitas</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-[#39a85b] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-lg" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-[#39a85b]">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalReceitas)}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-text-muted">Total Despesas</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-[#a93838] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-lg" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-[#a93838]">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalDespesas)}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-text-muted">Saldo</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-lg" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold ${metrics.saldo >= 0 ? 'text-[#39a85b]' : 'text-[#a93838]'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.saldo)}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-text-muted">
              {categoryType === 'saida' ? 'Categoria com Maior Gasto' : 'Categoria com Maior Receita'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-lg" />
          </CardHeader>
          <CardContent className="relative z-10">
            {insights.topCategory ? (
              <>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insights.topCategory.value)}
                </div>
                <p className="text-sm text-text-muted mt-1">{insights.topCategory.name}</p>
              </>
            ) : (
              <p className="text-text-muted">
                {categoryType === 'saida' ? 'Adicione despesas para análise' : 'Adicione receitas para análise'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Pie Chart */}
        <Card className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-10" />
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>
                {categoryType === 'saida' ? 'Gastos por Categoria' : 'Receitas por Categoria'}
              </CardTitle>
              <Tabs value={categoryType} onValueChange={(v: any) => setCategoryType(v)} className="w-auto">
                <TabsList className="grid w-full grid-cols-2 p-1 h-auto gap-1">
                  <TabsTrigger value="saida" className="text-xs px-3 py-1.5">Despesas</TabsTrigger>
                  <TabsTrigger value="entrada" className="text-xs px-3 py-1.5">Receitas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1" key={index}>
                        <stop offset="0%" stopColor={color.start} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={color.end} stopOpacity={1} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(undefined)}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#colorGradient${index % COLORS.length})`} stroke={'hsl(var(--surface))'} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-surface border border-border rounded-lg p-3 shadow-xl backdrop-blur-sm">
                            <p className="font-semibold text-sm mb-1">{payload[0].name}</p>
                            <p className="text-primary font-bold text-base">
                              {new Intl.NumberFormat('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                              }).format(payload[0].value as number)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {((payload[0].value as number / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% do total
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                    wrapperStyle={{
                      paddingLeft: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-center text-text-muted px-4">
                {categoryType === 'saida' 
                  ? 'Nenhuma despesa disponível. Adicione despesas para ver a distribuição.' 
                  : 'Nenhuma receita disponível. Adicione receitas para ver a distribuição.'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Bar Chart */}
        <Card className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-10" />
          <CardHeader>
            <CardTitle>Comparação Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  barGap={8}
                  barCategoryGap="20%"
                >
                  <defs>
                    <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#39a85b" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#39a85b" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a93838" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#a93838" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    opacity={0.3}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--foreground))" 
                    fontSize={11}
                    fontWeight={400}
                    tickLine={false}
                    axisLine={false}
                    opacity={0.7}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))" 
                    fontSize={11}
                    fontWeight={400}
                    tickLine={false}
                    axisLine={false}
                    opacity={0.7}
                    width={60}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--surface))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                    wrapperStyle={{ outline: 'none' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                    formatter={(value: number) => [
                      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
                      ''
                    ]}
                    labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                  />
                  <Legend 
                    iconType="circle"
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  />
                  <Bar 
                    dataKey="entradas" 
                    fill="url(#colorEntradas)" 
                    name="Entradas"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                  <Bar 
                    dataKey="saidas" 
                    fill="url(#colorSaidas)" 
                    name="Saídas"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-text-muted">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card ref={transactionsTableRef}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todas as Transações</CardTitle>
            <span className="text-sm text-text-muted">
              {filteredAndSortedRecords.length} {filteredAndSortedRecords.length === 1 ? 'transação' : 'transações'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Empty search state */}
          {searchQuery && filteredAndSortedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-red-500/70" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Não encontramos transações com o termo "<span className="font-medium text-foreground">{searchQuery}</span>"
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpar busca
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  Limpar todos os filtros
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-6 text-center">
                Dica: Verifique a ortografia ou tente termos mais genéricos
              </p>
            </div>
          ) : filteredAndSortedRecords.length > 0 ? (
            <>
              <div className="space-y-2">
                {/* Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,2fr)_minmax(0,1fr)] items-center gap-4 px-4 py-2 font-medium text-muted-foreground border-b">
                  <div className="flex items-center">
                    <Checkbox
                      checked={paginatedRecords.length > 0 && paginatedRecords.every(r => selectedRecords.has(r.id))}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selecionar todos"
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 -ml-3 justify-start" onClick={() => handleSort('data_hora')}>
                    Data <ArrowUpDown className="h-3 w-3" />
                  </Button>
                  <div>Tipo</div>
                  <div>Status</div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 -ml-3 justify-start" onClick={() => handleSort('categoria')}>
                    Categoria <ArrowUpDown className="h-3 w-3" />
                  </Button>
                  <div>Descrição</div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 justify-end w-full" onClick={() => handleSort('valor')}>
                    Valor <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Body */}
                <div className="space-y-2">
                  {paginatedRecords.map((record, index) => {
                    const isSelected = selectedRecords.has(record.id);
                    const handleCheckedChange = (checked: boolean) => handleSelectRecord(record.id, checked);

                    return (
                      <ContextMenu key={record.id}>
                        <ContextMenuTrigger asChild>
                          <div
                            className={cn(
                              "cursor-context-menu group relative overflow-hidden rounded-lg bg-surface-elevated hover:bg-surface-hover transition-all duration-200 border",
                              isSelected && "bg-primary/5 border-primary/20"
                            )}
                          >
                            {/* Mobile View */}
                            <div className="md:hidden p-3 space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <Checkbox checked={isSelected} onCheckedChange={handleCheckedChange} aria-label={`Selecionar registro ${record.id}`} onClick={(e) => e.stopPropagation()} />
                                  <div>
                                    <div className="font-semibold">{record.descricao || record.categoria}</div>
                                    <div className="text-sm text-muted-foreground">{new Date(record.data_hora).toLocaleDateString('pt-BR')}</div>
                                  </div>
                                </div>
                                <div className={`font-semibold text-right ${record.tipo === 'entrada' ? 'text-[#39a85b]' : 'text-[#a93838]'}`}>
                                  {record.tipo === 'entrada' ? '+' : '-'}
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(record.valor))}
                                </div>
                              </div>
                              <div className="pt-3 border-t grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <div className="text-muted-foreground text-xs mb-1">Tipo</div>
                                  <div className="flex items-center gap-1">
                                    {record.tipo === 'entrada' ? <ArrowUpIcon className="h-3 w-3 text-[#39a85b]" /> : <ArrowDownIcon className="h-3 w-3 text-[#a93838]" />}
                                    {record.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground text-xs mb-1">Status</div>
                                  <div className="flex items-center gap-1">
                                    {record.status === 'pago' ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Clock className="h-3 w-3 text-yellow-500" />}
                                    {record.status === 'pago' ? 'Pago' : 'Pendente'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground text-xs mb-1">Categoria</div>
                                  <div>{record.categoria}</div>
                                </div>
                              </div>
                            </div>

                            {/* Desktop View */}
                            <div className="hidden md:grid md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,2fr)_minmax(0,1fr)] items-center gap-4 px-4 py-3">
                              <Checkbox checked={isSelected} onCheckedChange={handleCheckedChange} aria-label={`Selecionar registro ${record.id}`} onClick={(e) => e.stopPropagation()} />
                              <div className="font-medium text-sm">{new Date(record.data_hora).toLocaleDateString('pt-BR')}</div>
                              <div className="flex items-center gap-2 text-sm">
                                {record.tipo === 'entrada' ? <ArrowUpIcon className="h-4 w-4 text-[#39a85b]" /> : <ArrowDownIcon className="h-4 w-4 text-[#a93838]" />}
                                <span>{record.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                {record.status === 'pago' ? (<><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-green-500">Pago</span></>) : (<><Clock className="h-4 w-4 text-yellow-500" /><span className="text-yellow-500">Pendente</span></>)}
                              </div>
                              <div className="text-sm">{record.categoria}</div>
                              <div className="text-sm text-muted-foreground truncate">{record.descricao || '-'}</div>
                              <div className={`text-right font-semibold ${record.tipo === 'entrada' ? 'text-[#39a85b]' : 'text-[#a93838]'}`}>
                                {record.tipo === 'entrada' ? '+' : '-'}
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(record.valor))}
                              </div>
                            </div>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-48">
                          <ContextMenuItem onClick={() => { setRecordToEdit(record); setEditDialogOpen(true); }} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /><span>Editar</span>
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => handleDuplicateRecord(record)} className="cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" /><span>Duplicar</span>
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem onClick={() => { setRecordToDelete(record); setDeleteDialogOpen(true); }} className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /><span>Excluir</span>
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-text-muted">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-text-muted">
              Nenhuma transação encontrada
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteRecordDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        record={recordToDelete}
        onConfirm={handleDeleteRecord}
      />

      <BulkDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        recordCount={selectedRecords.size}
        recordsPreview={selectedRecordsData}
        onConfirm={handleBulkDelete}
        isDeleting={isBulkDeleting}
      />

      <EditRecordDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        record={recordToEdit}
        onSuccess={() => {
          refetch();
          setEditDialogOpen(false);
          setRecordToEdit(null);
        }}
      />

      {/* Floating Bulk Actions Button */}
      {selectedRecords.size > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Button
            onClick={() => setBulkDeleteDialogOpen(true)}
            size="lg"
            className="shadow-2xl hover:shadow-3xl transition-all duration-200 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white gap-2 px-6 py-6 text-base font-semibold rounded-full"
          >
            <Trash2 className="h-5 w-5" />
            Excluir {selectedRecords.size} {selectedRecords.size === 1 ? 'selecionado' : 'selecionados'}
          </Button>
        </div>
      )}
    </div>
  );
}