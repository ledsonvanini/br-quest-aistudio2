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
} from 'lucide-react';
import { EDUCATIONAL_TRACKS, INITIAL_CLASSROOMS } from '../../data/educatorTracksData';
import { EducationalTrack, ClassroomGroup } from '../../types/educator';

interface EducatorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrackState?: (stateId: string) => void;
}

type EducatorTab = 'trilhas' | 'turmas' | 'relatorios' | 'exportar';

export const EducatorPortalModal: React.FC<EducatorPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectTrackState,
}) => {
  const [activeTab, setActiveTab] = useState<EducatorTab>('trilhas');
  const [selectedTrack, setSelectedTrack] = useState<EducationalTrack>(EDUCATIONAL_TRACKS[0]);
  const [classrooms, setClassrooms] = useState<ClassroomGroup[]>(INITIAL_CLASSROOMS);
  const [newClassName, setNewClassName] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newGrade, setNewGrade] = useState('7º Ano EF');
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [exportedNotice, setExportedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const generatedCode = `BRQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGroup: ClassroomGroup = {
      id: `turma-${Date.now()}`,
      name: newClassName.trim(),
      schoolName: newSchoolName.trim() || 'Escola Conveniada',
      grade: newGrade,
      accessCode: generatedCode,
      studentCount: 0,
      averageScorePercent: 0,
      activeTrackId: selectedTrack.id,
      statesMasteredCount: 0,
    };

    setClassrooms([newGroup, ...classrooms]);
    setNewClassName('');
    setNewSchoolName('');
  };

  const handleExportCSV = (classroom: ClassroomGroup) => {
    const csvContent = `data:text/csv;charset=utf-8,Turma,Escola,Ano,Código,Alunos,Média Acerto,Estados Conquistados\n"${classroom.name}","${classroom.schoolName}","${classroom.grade}","${classroom.accessCode}",${classroom.studentCount},${classroom.averageScorePercent}%,${classroom.statesMasteredCount}/27`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_${classroom.accessCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedNotice(`Relatório da turma "${classroom.name}" exportado em CSV!`);
    setTimeout(() => setExportedNotice(null), 3000);
  };

  return (
    <div
      id="modal-portal-educador-backdrop"
      className="modal-portal-educador-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="painel-educador-container"
        className="painel-educador-container relative w-[92vw] sm:w-[85vw] max-w-5xl h-[85vh] max-h-[85vh] bg-stone-900/95 border border-amber-500/40 rounded-2xl shadow-2xl p-5 sm:p-7 text-stone-100 font-sans flex flex-col"
      >
        {/* Botão Fechar */}
        <button
          id="btn-fechar-portal-educador"
          onClick={onClose}
          className="btn-fechar-portal-educador absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1.5 rounded-lg hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-stone-800 pb-3 flex-shrink-0">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-wide text-amber-300">
                BR Quest Edu — Portal do Educador
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                BNCC & ENEM
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Trilhas interdisciplinares de Geografia, Ciências e História com acompanhamento diagnóstico de turmas.
            </p>
          </div>
        </div>

        {/* Abas */}
        <div className="grid grid-cols-4 gap-1.5 my-3 p-1 bg-stone-950/80 rounded-xl border border-stone-800 flex-shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('trilhas')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'trilhas'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Trilhas & BNCC</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('turmas')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'turmas'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Minhas Turmas ({classrooms.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('relatorios')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'relatorios'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Diagnóstico ENEM</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exportar')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'exportar'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportação CSV</span>
          </button>
        </div>

        {/* Notificação Temporária de Exportação */}
        {exportedNotice && (
          <div className="mb-2 p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{exportedNotice}</span>
          </div>
        )}

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto pr-1 text-sm text-stone-200 space-y-4">
          {/* ABA 1: TRILHAS PEDAGÓGICAS & BNCC */}
          {activeTab === 'trilhas' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Lista de Trilhas */}
              <div className="space-y-2 lg:col-span-1">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  Trilhas Curriculares por Bioma
                </div>
                {EDUCATIONAL_TRACKS.map((track) => {
                  const isCurrent = track.id === selectedTrack.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        setSelectedTrack(track);
                        setShowQuizAnswer(false);
                        setSelectedAnswerIndex(null);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                        isCurrent
                          ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-md'
                          : 'bg-stone-800/40 border-stone-700/50 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-700/60 text-amber-300">
                          {track.biome}
                        </span>
                        <span className="text-[11px] text-stone-400">{track.targetGrade}</span>
                      </div>
                      <div className="text-xs font-bold text-stone-100 line-clamp-2">{track.title}</div>
                      <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-2">
                        <span>⏱️ {track.durationMinutes} min</span>
                        <span>•</span>
                        <span>{track.bnccSkills.length} Habilidades BNCC</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detalhes da Trilha Selecionada */}
              <div className="lg:col-span-2 space-y-4 p-4 rounded-xl bg-stone-800/40 border border-stone-700/50">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-amber-300">{selectedTrack.title}</h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {selectedTrack.biome} • {selectedTrack.targetGrade}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{selectedTrack.overview}</p>
                </div>

                {/* Habilidades BNCC Codificadas */}
                <div>
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Habilidades BNCC Trabalhadas</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTrack.bnccSkills.map((sk) => (
                      <div key={sk.code} className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-700/60">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-xs text-emerald-300">{sk.code}</span>
                          <span className="text-[10px] text-stone-400">{sk.theme}</span>
                        </div>
                        <p className="text-[11px] text-stone-300 leading-snug">{sk.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UFs Recomendadas para Exploração Interativa */}
                <div>
                  <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
                    Estados de Aplicação Prática no Mapa
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedTrack.recommendedStates.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          onSelectTrackState?.(st);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-200 text-xs font-bold hover:bg-sky-500 hover:text-stone-950 transition flex items-center gap-1"
                      >
                        <Compass className="w-3 h-3" />
                        <span>Ir para {st}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulado Modelo ENEM Integrado */}
                <div className="p-3.5 rounded-xl bg-stone-900/80 border border-amber-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <HelpCircle className="w-4 h-4" />
                      <span>Questão de Fixação ({selectedTrack.examQuestionSample.origin})</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">Foco: {selectedTrack.enemFocusTheme}</span>
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed font-medium">
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
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition border ${
                            showQuizAnswer
                              ? isCorrect
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold'
                                : isSelected
                                ? 'bg-red-950/70 border-red-500 text-red-200'
                                : 'bg-stone-800/40 border-stone-700/50 text-stone-400'
                              : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                          }`}
                        >
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + idx)})</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {showQuizAnswer && (
                    <div className="p-2 rounded bg-stone-800/70 text-[11px] text-amber-200 border-l-2 border-amber-400">
                      <strong>Gabarito Comentado: </strong>
                      {selectedTrack.examQuestionSample.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: MINHAS TURMAS */}
          {activeTab === 'turmas' && (
            <div className="space-y-4">
              {/* Formulário de Criação de Turma */}
              <form
                onSubmit={handleCreateClassroom}
                className="p-4 rounded-xl bg-stone-800/40 border border-stone-700/60 space-y-3"
              >
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Nova Turma Escolar</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Nome da Turma (Ex: 8º Ano B - Manhã)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="p-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Escola / Colégio"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    className="p-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="p-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 flex-1"
                    >
                      <option value="6º Ano EF">6º Ano EF</option>
                      <option value="7º Ano EF">7º Ano EF</option>
                      <option value="8º Ano EF">8º Ano EF</option>
                      <option value="9º Ano EF">9º Ano EF</option>
                      <option value="1º Ano EM">1º Ano EM</option>
                      <option value="2º Ano EM">2º Ano EM</option>
                      <option value="3º Ano EM">3º Ano EM (ENEM)</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition"
                    >
                      Criar Turma
                    </button>
                  </div>
                </div>
              </form>

              {/* Lista de Turmas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {classrooms.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/60 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {cls.grade}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-xs text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/40">
                          <span>Código:</span>
                          <strong>{cls.accessCode}</strong>
                        </div>
                      </div>
                      <div className="font-bold text-sm text-stone-100">{cls.name}</div>
                      <div className="text-xs text-stone-400">{cls.schoolName}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-stone-700/40 text-xs">
                      <div>
                        <div className="font-bold text-stone-200">{cls.studentCount}</div>
                        <div className="text-[10px] text-stone-500">Alunos</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-400">{cls.averageScorePercent}%</div>
                        <div className="text-[10px] text-stone-500">Acerto Médio</div>
                      </div>
                      <div>
                        <div className="font-bold text-amber-300">{cls.statesMasteredCount}/27</div>
                        <div className="text-[10px] text-stone-500">UFs Dominadas</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExportCSV(cls)}
                      className="w-full py-1.5 rounded-lg bg-stone-700/60 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar CSV da Turma</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 3: DIAGNÓSTICO & SIMULADOS ENEM */}
          {activeTab === 'relatorios' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/60">
                  <div className="text-xs text-stone-400">Total de Estudantes Avaliados</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">105</div>
                  <div className="text-[11px] text-stone-500">3 turmas ativas</div>
                </div>
                <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/60">
                  <div className="text-xs text-stone-400">Taxa Média Geral de Acerto</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">83%</div>
                  <div className="text-[11px] text-stone-500">Simulados de Geografia e Clima</div>
                </div>
                <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/60">
                  <div className="text-xs text-stone-400">Ponto Fraco Identificado</div>
                  <div className="text-sm font-bold text-rose-400 mt-2 leading-snug">
                    Domínios Morfoclimáticos do Sul & Pampa
                  </div>
                  <div className="text-[11px] text-stone-500">Recomendado reforço em RS e SC</div>
                </div>
              </div>

              {/* Desempenho por Macrorregião */}
              <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-700/60 space-y-3">
                <div className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                  Média de Desempenho por Região Geográfica
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Norte (Amazônia & Rios Voadores)</span>
                      <span className="font-bold text-emerald-400">89%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '89%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Nordeste (Caatinga & Transposição São Francisco)</span>
                      <span className="font-bold text-amber-400">84%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Centro-Oeste (Cerrado & Matopiba)</span>
                      <span className="font-bold text-sky-400">81%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '81%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Sudeste (Mata Atlântica & Urbanização)</span>
                      <span className="font-bold text-indigo-400">86%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '86%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Sul (Pampa, Arenização & Clima Subtropical)</span>
                      <span className="font-bold text-rose-400">68%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: EXPORTAÇÃO CSV */}
          {activeTab === 'exportar' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-700/60 space-y-2">
                <h4 className="font-bold text-sm text-stone-100">Exportação de Dados para a Gestão Escolar</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Baixe planilhas prontas em formato CSV para integração com sistemas de boletins escolares ou
                  planejamento de conselho pedagógico.
                </p>
              </div>

              <div className="space-y-2">
                {classrooms.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-200">{cls.name}</div>
                      <div className="text-[11px] text-stone-400">
                        {cls.schoolName} • {cls.studentCount} Alunos • Média: {cls.averageScorePercent}%
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleExportCSV(cls)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar CSV</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
