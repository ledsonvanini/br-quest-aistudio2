import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  BookOpen,
  Users,
  BarChart3,
  Download,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Plus,
  Compass,
  Award,
  Database,
  Layers,
  ChevronRight,
  Filter,
  Info,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { EDUCATIONAL_TRACKS, INITIAL_CLASSROOMS } from '../../data/educatorTracksData';
import { EducationalTrack, ClassroomGroup, EducationTier } from '../../types/educator';
import { audioEngine } from '../../lib/audioSynth';

interface EducatorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrackState?: (stateId: string) => void;
}

type EducatorCategory = 'trilhas' | 'turmas' | 'relatorios' | 'exportar';

export const EducatorPortalModal: React.FC<EducatorPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectTrackState,
}) => {
  const [activeCategory, setActiveCategory] = useState<EducatorCategory>('trilhas');
  const [activeSubTab, setActiveSubTab] = useState<string>('todos');
  const [selectedTrack, setSelectedTrack] = useState<EducationalTrack>(EDUCATIONAL_TRACKS[0]);
  const [classrooms, setClassrooms] = useState<ClassroomGroup[]>(INITIAL_CLASSROOMS);

  // Criação de nova turma
  const [newClassName, setNewClassName] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newGrade, setNewGrade] = useState('7º Ano EF');
  const [newTier, setNewTier] = useState<EducationTier>('fundamental');

  // Question simulator
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [exportedNotice, setExportedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: EducatorCategory) => {
    audioEngine.playSfx('click');
    setActiveCategory(cat);
    setActiveSubTab('todos');
  };

  const getSubTabs = () => {
    switch (activeCategory) {
      case 'trilhas':
        return [
          { id: 'todos', label: `Todas as Trilhas (${EDUCATIONAL_TRACKS.length})` },
          { id: 'fundamental', label: 'Fundamental (6º-9º)' },
          { id: 'medio', label: 'Médio & ENEM (1º-3º)' },
          { id: 'avancado', label: 'Pesquisa / Avançado' },
        ];
      case 'turmas':
        return [
          { id: 'todos', label: `Turmas Ativas (${classrooms.length})` },
          { id: 'nova_turma', label: '➕ Cadastrar Nova Turma' },
        ];
      case 'relatorios':
        return [
          { id: 'todos', label: 'Visão Geral & Métricas' },
          { id: 'competencias', label: 'Matriz de Habilidades BNCC' },
          { id: 'desempenho', label: 'Diagnóstico por Nível' },
        ];
      case 'exportar':
        return [
          { id: 'todos', label: 'Planilhas CSV' },
          { id: 'fontes', label: 'Bases Oficiais 2024/2025' },
        ];
      default:
        return [{ id: 'todos', label: 'Geral' }];
    }
  };

  const subTabs = getSubTabs();

  // Filtragem de trilhas por subtab
  const filteredTracks =
    activeSubTab === 'todos' || activeCategory !== 'trilhas'
      ? EDUCATIONAL_TRACKS
      : EDUCATIONAL_TRACKS.filter((t) => t.targetTier === activeSubTab);

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    audioEngine.playSfx('click');
    const generatedCode = `BRQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGroup: ClassroomGroup = {
      id: `turma-${Date.now()}`,
      name: newClassName.trim(),
      schoolName: newSchoolName.trim() || 'Escola Conveniada',
      grade: newGrade,
      tier: newTier,
      accessCode: generatedCode,
      studentCount: 0,
      averageScorePercent: 0,
      activeTrackId: selectedTrack.id,
      statesMasteredCount: 0,
    };

    setClassrooms([newGroup, ...classrooms]);
    setNewClassName('');
    setNewSchoolName('');
    setExportedNotice(`Turma "${newGroup.name}" cadastrada com código ${generatedCode}!`);
    setTimeout(() => setExportedNotice(null), 4000);
  };

  const handleExportCSV = (classroom: ClassroomGroup) => {
    audioEngine.playSfx('click');
    const csvContent = `data:text/csv;charset=utf-8,Turma,Escola,Nível,Ano,Código,Alunos,Média Acerto,Estados Conquistados,Fonte Dados\n"${classroom.name}","${classroom.schoolName}","${classroom.tier}","${classroom.grade}","${classroom.accessCode}",${classroom.studentCount},${classroom.averageScorePercent}%,${classroom.statesMasteredCount}/27,"IBGE Censo 2024/2025 & INPE 2025"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_${classroom.accessCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedNotice(`Relatório diagnóstico da turma "${classroom.name}" exportado em CSV!`);
    setTimeout(() => setExportedNotice(null), 4000);
  };

  const getTierBadgeInfo = (tier: EducationTier) => {
    switch (tier) {
      case 'fundamental':
        return {
          label: 'Ensino Fundamental (6º-9º)',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dotColor: 'bg-emerald-400',
        };
      case 'medio':
        return {
          label: 'Ensino Médio & ENEM (1º-3º)',
          badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          dotColor: 'bg-sky-400',
        };
      case 'avancado':
        return {
          label: 'Avançado (Pesquisador)',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dotColor: 'bg-amber-400',
        };
    }
  };

  const totalStudents = classrooms.reduce((acc, c) => acc + c.studentCount, 0);

  return (
    <div
      id="modal-portal-educador-backdrop"
      className="modal-portal-educador-backdrop modal-portal-educador fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="painel-educador-container"
        className="painel-educador-container painel-explorador-unificado relative w-[98vw] sm:w-[95vw] md:w-[92vw] lg:w-[90vw] max-w-6xl h-[95vh] sm:h-[94vh] max-h-[96vh] flex flex-col bg-gradient-to-b from-slate-950 via-[#0a1122] to-slate-950 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.25)] text-slate-100 my-auto overflow-hidden font-sans"
      >
        {/* Cantos Ornamentais RPG */}
        <div className="ornamento-canto-tl absolute -top-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-tr absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-bl absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />
        <div className="ornamento-canto-br absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-yellow-200 rotate-45 pointer-events-none shadow z-30 ring-1 ring-amber-500/80" />

        {/* Cabeçalho Compacto do Portal */}
        <div className="cabecalho-modal-educador flex items-center justify-between pb-3 border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-wide flex items-center gap-1.5">
                  BR Quest Edu — Portal do Educador & Pesquisador
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  BNCC • ENEM • Censo 2025
                </span>
                <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <Database className="w-3 h-3" />
                  <span>IBGE • INPE • ICMBio</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Trilhas curriculares adaptadas por nível de ensino, simulação de questões, gestão de turmas e relatórios diagnósticos.
              </p>
            </div>
          </div>

          <button
            id="btn-fechar-portal-educador"
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="btn-fechar-portal-educador text-slate-300 hover:text-slate-950 p-2 rounded-xl bg-slate-900 hover:bg-amber-500 border border-amber-500/40 transition z-30 cursor-pointer shadow-md"
            title="Fechar portal educador"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Notificação Temporária de Ação */}
        {exportedNotice && (
          <div className="mt-2 p-2 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-in fade-in duration-200 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{exportedNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setExportedNotice(null)}
              className="p-0.5 hover:bg-emerald-900 rounded text-emerald-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CORPO PRINCIPAL EM 2 COLUNAS (Wide-Screen 2-Column Pattern) */}
        <div className="corpo-duas-colunas flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 pt-3 overflow-hidden">
          {/* ========================================================================= */}
          {/* COLUNA 1 (Esquerda): Resumo Institucional & Categorias Empilhadas           */}
          {/* ========================================================================= */}
          <aside className="coluna-lateral-educador w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar-gold pr-0.5">
            {/* 1.1 Card de Resumo Pedagógico */}
            <div className="card-educador-resumo p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-sm shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-100 truncate">Ambiente Pedagógico</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      BNCC 2025
                    </span>
                  </div>
                  <div className="text-[10px] text-amber-300/90 font-medium truncate">
                    Educação Básica & Superior
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {EDUCATIONAL_TRACKS.length} Trilhas Temáticas
                  </div>
                </div>
              </div>

              {/* Barra de Alinhamento Curricular */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Alinhamento BNCC</span>
                  <span className="text-emerald-400 font-bold">100% Cobertura</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
                </div>
              </div>

              {/* Mini Pílulas de Estatísticas */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono">
                <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] font-bold text-emerald-400">{totalStudents}</div>
                  <div className="text-[8px] text-slate-400 uppercase tracking-tighter">Estudantes</div>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] font-bold text-sky-400">{classrooms.length}</div>
                  <div className="text-[8px] text-slate-400 uppercase tracking-tighter">Turmas</div>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] font-bold text-amber-400">83%</div>
                  <div className="text-[8px] text-slate-400 uppercase tracking-tighter">Acerto Médio</div>
                </div>
              </div>
            </div>

            {/* 1.2 Categorias Principais Empilhadas (Vertical Navigation) */}
            <div className="categorias-empilhadas flex flex-col gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                Módulos do Educador
              </span>

              <button
                type="button"
                onClick={() => handleSelectCategory('trilhas')}
                className={`btn-aba-trilhas w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeCategory === 'trilhas'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Trilhas Curriculares</div>
                    <div className={`text-[10px] leading-tight ${activeCategory === 'trilhas' ? 'text-slate-900' : 'text-slate-400'}`}>
                      Planos de aula & Simulados
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeCategory === 'trilhas' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('turmas')}
                className={`btn-aba-turmas w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeCategory === 'turmas'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Gestão de Turmas</div>
                    <div className={`text-[10px] leading-tight ${activeCategory === 'turmas' ? 'text-slate-900' : 'text-slate-400'}`}>
                      {classrooms.length} grupos cadastrados
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeCategory === 'turmas' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('relatorios')}
                className={`btn-aba-relatorios w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeCategory === 'relatorios'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Matriz Diagnóstica</div>
                    <div className={`text-[10px] leading-tight ${activeCategory === 'relatorios' ? 'text-slate-900' : 'text-slate-400'}`}>
                      Desempenho BNCC & ENEM
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeCategory === 'relatorios' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleSelectCategory('exportar')}
                className={`btn-aba-exportar w-full p-2.5 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                  activeCategory === 'exportar'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight">Exportação CSV</div>
                    <div className={`text-[10px] leading-tight ${activeCategory === 'exportar' ? 'text-slate-900' : 'text-slate-400'}`}>
                      Planilhas & Bases Oficiais
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeCategory === 'exportar' ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>
            </div>

            {/* Dica Pedagógica Fixada */}
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-2 mt-auto">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                As questões e simulados utilizam dados científicos reais do Censo IBGE 2024/2025 e do INPE Queimadas 2025.
              </span>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* COLUNA 2 (Direita): SubTabs no Topo & Conteúdo de Cada Módulo               */}
          {/* ========================================================================= */}
          <main className="coluna-conteudo-principal flex-1 min-w-0 flex flex-col min-h-0 bg-slate-950/70 rounded-2xl border border-amber-500/30 p-3 sm:p-4 overflow-hidden shadow-inner">
            {/* Barra de SubTabs Contextuais no Topo da Coluna 2 */}
            <div className="subtabs-topo flex items-center gap-1.5 pb-2.5 mb-3 border-b border-slate-800 overflow-x-auto custom-scrollbar-gold shrink-0">
              {subTabs.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setActiveSubTab(st.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeSubTab === st.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Conteúdo Principal com Scroll Suave */}
            <div className="conteudo-aba-scroll flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar-gold space-y-4">
              {/* CATEGORIA 1: TRILHAS CURRICULARES */}
              {activeCategory === 'trilhas' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                    {/* Lista de Trilhas Filtradas */}
                    <div className="space-y-2 lg:col-span-1">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Trilhas Pedagógicas</span>
                        <span className="text-[10px] text-amber-300 font-mono">
                          {filteredTracks.length} disponíveis
                        </span>
                      </div>

                      {filteredTracks.map((track) => {
                        const isCurrent = track.id === selectedTrack.id;
                        const tierInfo = getTierBadgeInfo(track.targetTier);
                        return (
                          <button
                            key={track.id}
                            type="button"
                            onClick={() => {
                              audioEngine.playSfx('click');
                              setSelectedTrack(track);
                              setShowQuizAnswer(false);
                              setSelectedAnswerIndex(null);
                            }}
                            className={`card-trilha-pedagogica w-full p-3 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                              isCurrent
                                ? 'bg-amber-950/70 border-amber-400/80 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${tierInfo.badgeClass}`}>
                                {tierInfo.label}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">{track.biome}</span>
                            </div>
                            <div className="text-xs font-bold text-slate-100 line-clamp-2">{track.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between font-mono">
                              <span>⏱️ {track.durationMinutes} min</span>
                              <span className="text-amber-300/90 font-bold">
                                {track.examQuestionSample.points} pts / {track.examQuestionSample.xp} XP
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Detalhes da Trilha Selecionada */}
                    <div className="lg:col-span-2 space-y-4 p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{selectedTrack.title}</span>
                          </h3>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl border ${getTierBadgeInfo(selectedTrack.targetTier).badgeClass}`}>
                            {selectedTrack.targetGrade}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{selectedTrack.overview}</p>

                        {/* Fonte Científica */}
                        <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs text-cyan-300">
                          <Database className="w-4 h-4 shrink-0 text-cyan-400" />
                          <span className="text-[11px]">
                            <strong>Base Científica & APIs:</strong> {selectedTrack.dataSourceRef}
                          </span>
                        </div>
                      </div>

                      {/* Objetivos de Aprendizagem */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Objetivos Pedagógicos & Metas</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {selectedTrack.learningGoals.map((goal, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-400 mt-0.5">•</span>
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Habilidades BNCC */}
                      <div>
                        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Habilidades BNCC & Competências</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedTrack.bnccSkills.map((sk) => (
                            <div key={sk.code} className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/30">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono font-bold text-xs text-emerald-300">{sk.code}</span>
                                <span className="text-[10px] text-slate-400">{sk.theme}</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-snug">{sk.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* UFs de Aplicação Prática no Mapa */}
                      <div>
                        <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Estados de Aplicação no Mapa</span>
                          <span className="text-[10px] text-slate-400">Clique para inspecionar</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {selectedTrack.recommendedStates.map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                audioEngine.playSfx('travel');
                                onSelectTrackState?.(st);
                                onClose();
                              }}
                              className="px-3 py-1 rounded-xl bg-sky-950/70 border border-sky-500/40 text-sky-200 text-xs font-bold hover:bg-sky-500 hover:text-slate-950 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Compass className="w-3.5 h-3.5" />
                              <span>Explorar {st}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Simulado & Questão Modelo */}
                      <div className="card-questao-fixacao p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/40 space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                            <HelpCircle className="w-4 h-4 text-amber-400" />
                            <span>Questão Modelo ({selectedTrack.examQuestionSample.origin})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              +{selectedTrack.examQuestionSample.points} pts
                            </span>
                            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                              +{selectedTrack.examQuestionSample.xp} XP
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          {selectedTrack.examQuestionSample.prompt}
                        </p>
                        <div className="space-y-1.5">
                          {selectedTrack.examQuestionSample.options.map((opt, idx) => {
                            const isSelected = selectedAnswerIndex === idx;
                            const isCorrect = idx === selectedTrack.examQuestionSample.correctIndex;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedAnswerIndex(idx);
                                  setShowQuizAnswer(true);
                                  if (idx === selectedTrack.examQuestionSample.correctIndex) {
                                    audioEngine.playQuestCorrect();
                                  } else {
                                    audioEngine.playQuestWrong();
                                  }
                                }}
                                className={`w-full text-left p-2.5 rounded-xl text-xs transition border cursor-pointer ${
                                  showQuizAnswer
                                    ? isCorrect
                                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-semibold'
                                      : isSelected
                                      ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                                      : 'bg-slate-900/40 border-slate-800 text-slate-400'
                                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-amber-500/40'
                                }`}
                              >
                                <span className="font-bold mr-1.5">{String.fromCharCode(65 + idx)})</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {showQuizAnswer && (
                          <div className="p-2.5 rounded-xl bg-slate-900/90 text-xs text-amber-200 border-l-3 border-amber-400 animate-in fade-in duration-200">
                            <strong>Gabarito Comentado: </strong>
                            {selectedTrack.examQuestionSample.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORIA 2: MINHAS TURMAS */}
              {activeCategory === 'turmas' && (
                <div className="space-y-4">
                  {/* Formulário de Cadastro de Turma */}
                  <form
                    onSubmit={handleCreateClassroom}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3"
                  >
                    <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Cadastrar Nova Turma Escolar ou Grupo de Pesquisa</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Nome da Turma (Ex: 9º Ano B)"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Escola / Universidade"
                        value={newSchoolName}
                        onChange={(e) => setNewSchoolName(e.target.value)}
                        className="p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <select
                        value={newTier}
                        onChange={(e) => setNewTier(e.target.value as EducationTier)}
                        className="p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="fundamental">Nível Fundamental (6º-9º)</option>
                        <option value="medio">Nível Médio & ENEM (1º-3º)</option>
                        <option value="avancado">Nível Avançado / Pesquisa</option>
                      </select>
                      <button
                        type="submit"
                        className="btn-acao-criar-turma px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
                      >
                        Criar Turma
                      </button>
                    </div>
                  </form>

                  {/* Grade de Turmas Ativas */}
                  <div className="painel-diagnostico-turmas grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {classrooms.map((cls) => {
                      const tierInfo = getTierBadgeInfo(cls.tier);
                      return (
                        <div
                          key={cls.id}
                          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${tierInfo.badgeClass}`}>
                                {tierInfo.label}
                              </span>
                              <div className="flex items-center gap-1 font-mono text-xs text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-500/40">
                                <span>PIN:</span>
                                <strong>{cls.accessCode}</strong>
                              </div>
                            </div>
                            <div className="font-bold text-sm text-slate-100">{cls.name}</div>
                            <div className="text-xs text-slate-400">{cls.schoolName}</div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center pt-2.5 border-t border-slate-800 text-xs">
                            <div>
                              <div className="font-bold text-slate-200">{cls.studentCount}</div>
                              <div className="text-[10px] text-slate-400">Estudantes</div>
                            </div>
                            <div>
                              <div className="font-bold text-emerald-400">{cls.averageScorePercent}%</div>
                              <div className="text-[10px] text-slate-400">Acerto Médio</div>
                            </div>
                            <div>
                              <div className="font-bold text-amber-300">{cls.statesMasteredCount}/27</div>
                              <div className="text-[10px] text-slate-400">UFs Concluídas</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleExportCSV(cls)}
                            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            <span>Exportar CSV</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CATEGORIA 3: RELATÓRIOS & MATRIZ DIAGNÓSTICA */}
              {activeCategory === 'relatorios' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                      <div className="text-xs text-slate-400">Total de Estudantes Avaliados</div>
                      <div className="text-2xl font-serif font-black text-amber-300 mt-1">{totalStudents}</div>
                      <div className="text-[11px] text-slate-400">{classrooms.length} turmas ativas • 2024/2025</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                      <div className="text-xs text-slate-400">Taxa Média Geral de Acerto</div>
                      <div className="text-2xl font-serif font-black text-emerald-400 mt-1">83%</div>
                      <div className="text-[11px] text-slate-400">Simulados BNCC, ENEM e Pesquisa</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                      <div className="text-xs text-slate-400">Ponto Fraco Identificado</div>
                      <div className="text-sm font-bold text-rose-400 mt-2 leading-snug">
                        Domínios Morfoclimáticos & Bacias do Sul
                      </div>
                      <div className="text-[11px] text-slate-400">Recomendado reforço em RS e SC</div>
                    </div>
                  </div>

                  {/* Matriz Diagnóstica por Nível */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span>Desempenho por Nível Pedagógico</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div>
                          <div className="text-emerald-300 font-bold">Ensino Fundamental (6º-9º Anos)</div>
                          <div className="text-[10px] text-slate-400">Reconhecimento de biomas, relevo e hidrografia</div>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">78% de precisão</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div>
                          <div className="text-sky-300 font-bold">Ensino Médio & ENEM (1º-3º Anos)</div>
                          <div className="text-[10px] text-slate-400">Matriz de energia, geopolítica, demografia e queimadas</div>
                        </div>
                        <span className="font-mono text-sky-400 font-bold">86% de precisão</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div>
                          <div className="text-amber-300 font-bold">Avançado (Nível Pesquisador / Graduação)</div>
                          <div className="text-[10px] text-slate-400">Telemetria climática INMET, conservação e espécies endêmicas</div>
                        </div>
                        <span className="font-mono text-amber-400 font-bold">94% de precisão</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORIA 4: EXPORTAÇÃO CSV & BASES OFICIAIS */}
              {activeCategory === 'exportar' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
                    <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Exportação Integrada de Dados Pedagógicos</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Baixe relatórios de desempenho e matrizes curriculares no formato padrão CSV, compatível com Google Sala de Aula, Microsoft Teams, SIGAA e sistemas de gestão acadêmica.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {classrooms.map((cls) => (
                        <div
                          key={cls.id}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between shadow-sm"
                        >
                          <div>
                            <div className="font-bold text-xs text-slate-200">{cls.name}</div>
                            <div className="text-[11px] text-slate-400">
                              {cls.studentCount} estudantes • PIN: <span className="font-mono text-amber-300">{cls.accessCode}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleExportCSV(cls)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Exportar</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bases Científicas & Fontes Oficiais */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <span>Fontes de Dados Cartográficos & Científicos Integrados</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="font-bold text-slate-200">IBGE — Censo Demográfico 2024/2025</div>
                        <div className="text-[11px] text-slate-400">População, PIB estadual, IDH e divisões regionais.</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="font-bold text-slate-200">INPE & BDQueimadas 2025</div>
                        <div className="text-[11px] text-slate-400">Focos de calor, desmatamento e monitoramento satelital.</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="font-bold text-slate-200">ICMBio & SiBBr</div>
                        <div className="text-[11px] text-slate-400">Fauna, flora, espécies endêmicas e lista vermelha da biodiversidade.</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="font-bold text-slate-200">ANA & CPRM</div>
                        <div className="text-[11px] text-slate-400">Bacias hidrográficas, relevo sombreado e vazão fluvial.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Rodapé Resumo do Portal */}
        <div className="rodape-portal-educador flex items-center justify-between pt-2.5 mt-2 border-t border-amber-500/20 text-[11px] text-slate-400 font-mono shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">BNCC Competências Gerais da Educação Básica</span>
            <span className="sm:hidden">BNCC Brasil</span>
          </div>
          <div className="text-slate-400">
            Fontes Oficiais: <span className="text-amber-300">IBGE 2025 • INPE • ICMBio • ANA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

