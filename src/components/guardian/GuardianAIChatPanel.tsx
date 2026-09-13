import React, { useState, useRef, useEffect } from 'react';
import { GuardianData } from '../../types';
import { Send, Sparkles, Bot, User, RefreshCw, HelpCircle, ShieldCheck } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

interface ChatMessage {
  id: string;
  sender: 'user' | 'guardian';
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
}

interface Props {
  guardian: GuardianData;
  onGuardianSpeech?: (text: string) => void;
}

export const GuardianAIChatPanel: React.FC<Props> = ({ guardian, onGuardianSpeech }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'guardian',
      text: `Saudações, viajante! Eu sou ${guardian.guardianName}, ${guardian.guardianTitlePt}. Pergunte-me qualquer mistério sobre a geografia, fauna, lendas, culinária ou história de ${guardian.stateNamePt}!`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isAiGenerated: true,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelBadge, setModelBadge] = useState<string>('gemini-3.8-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    `Qual o grande segredo da história de ${guardian.stateNamePt}?`,
    `Me conte sobre o prato típico ${guardian.typicalDishPt.split(' e ')[0]}!`,
    `Como você protege ${guardian.faunaPt.split(' e ')[0]} na natureza?`,
    `Quais heróis e lendas ergueram esta terra?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputValue).trim();
    if (!message || isLoading) return;

    audioEngine.playSfx('click');
    const userMsgId = 'u_' + Date.now();
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const updatedMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: message,
        timestamp: timeNow,
      },
    ];

    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Formata os últimos turnos para o backend
      const historyTurns = updatedMessages.slice(-6).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

      const res = await fetch('/api/guardian-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guardianId: guardian.id,
          message,
          history: historyTurns,
          context: {
            selectedTopic: 'chat_livre',
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || `A sabedoria de ${guardian.stateNamePt} ecoa em seus passos. Prossiga em sua jornada!`;

      setModelBadge(data.modelUsed || (data.isAiGenerated ? 'gemini-3.8-flash' : 'codex-lore'));

      setMessages((prev) => [
        ...prev,
        {
          id: 'g_' + Date.now(),
          sender: 'guardian',
          text: reply,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isAiGenerated: data.isAiGenerated,
        },
      ]);

      if (onGuardianSpeech) {
        onGuardianSpeech(reply);
      }
      audioEngine.playSfx('badge');
    } catch (err) {
      console.error('Erro no chat com Guardião:', err);
      const fallbackText = `Por honra de ${guardian.stateNamePt}, ouço seu chamado. Nosso espírito permanece inabalável diante dos ventos e das marés. Explore o Baú de Relíquias ou o Quiz sagrado!`;
      setMessages((prev) => [
        ...prev,
        {
          id: 'g_err_' + Date.now(),
          sender: 'guardian',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isAiGenerated: false,
        },
      ]);
      if (onGuardianSpeech) {
        onGuardianSpeech(fallbackText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container-chat-guardiao-ia flex flex-col h-full max-h-[380px] bg-slate-950/80 rounded-2xl border border-amber-500/30 overflow-hidden shadow-inner">
      {/* Barra de Status do Modelo IA */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-amber-500/20 text-[11px] font-mono">
        <span className="flex items-center gap-1.5 text-amber-300 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          Oráculo Vivo • {guardian.guardianName}
        </span>
        <span className="flex items-center gap-1 text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          {modelBadge}
        </span>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar-gold">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'guardian' && (
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 mt-0.5 shadow">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
            )}

            <div
              className={`max-w-[82%] sm:max-w-[75%] rounded-xl px-3 py-2 text-xs sm:text-sm font-serif leading-relaxed ${
                m.sender === 'user'
                  ? 'msg-usuario-ia bg-amber-500 text-slate-950 font-medium font-sans rounded-tr-none shadow-md'
                  : 'msg-guardiao-ia bg-slate-900/90 text-amber-100 border border-amber-500/30 rounded-tl-none shadow-inner'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.text}</p>
              <div
                className={`text-[9px] mt-1 text-right font-mono ${
                  m.sender === 'user' ? 'text-slate-900/80 font-bold' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-amber-400" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-amber-300/80 text-xs font-serif italic py-1">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center animate-spin">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span>{guardian.guardianName} está consultando as memórias ancestrais...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões Rápidas de Pergunta */}
      <div className="px-2.5 py-1.5 bg-slate-900/70 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar-gold">
        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
          <HelpCircle className="w-3 h-3 text-amber-400" /> Sugestões:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] font-serif text-slate-300 hover:text-amber-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 rounded-lg px-2 py-0.5 whitespace-nowrap transition cursor-pointer shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input de Mensagem */}
      <div className="p-2.5 bg-slate-900 border-t border-amber-500/20 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Pergunte algo a ${guardian.guardianName}...`}
          disabled={isLoading}
          className="input-chat-guardiao flex-1 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="btn-enviar-chat-guardiao bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 p-2 sm:px-3.5 sm:py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
          title="Enviar pergunta ao Guardião"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-serif">Perguntar</span>
        </button>
      </div>
    </div>
  );
};
