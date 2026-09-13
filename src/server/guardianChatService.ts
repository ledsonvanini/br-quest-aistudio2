import { GoogleGenAI } from '@google/genai';
import { GUARDIANS_DATA } from '../data/guardiansData';
import { GuardianData } from '../types';

let geminiClient: GoogleGenAI | null = null;
const chatCache = new Map<string, { reply: GuardianChatResponse; timestamp: number }>();
const inFlightChat = new Map<string, Promise<GuardianChatResponse>>();
const CHAT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de buffer inteligente para perguntas repetidas

/**
 * Lazy initialization do cliente oficial do Gemini API server-side
 */
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export interface ChatMessageTurn {
  role: 'user' | 'model';
  text: string;
}

export interface GuardianChatRequest {
  guardianId: string;
  message: string;
  history?: ChatMessageTurn[];
  context?: {
    currentStateWeather?: string;
    selectedTopic?: string;
    userLevel?: number;
  };
}

export interface GuardianChatResponse {
  reply: string;
  guardianName: string;
  guardianTitle: string;
  stateName: string;
  isAiGenerated: boolean;
  modelUsed: string;
}

/**
 * Constrói o System Prompt socrático e imersivo com os dados canônicos do Guardião
 */
function buildGuardianSystemInstruction(guardian: GuardianData, context?: GuardianChatRequest['context']): string {
  const weatherSnippet = context?.currentStateWeather
    ? `\n- Telemetria de Clima Atual na Região: ${context.currentStateWeather}`
    : '';

  return `Você é ${guardian.guardianName}, ${guardian.guardianTitlePt} do Estado de ${guardian.stateNamePt} (${guardian.id}), capital ${guardian.capitalPt}, na plataforma BR Quest.

PERFIL E IDENTIDADE DO GUARDIÃO:
- Estado: ${guardian.stateNamePt} (${guardian.id}) - Região: ${guardian.regionId.toUpperCase()}
- Capital: ${guardian.capitalPt}
- Lore Sagrada: ${guardian.loreStoryPt}
- Traje e Símbolos: ${guardian.garbDescriptionPt}
- Fauna Sagrada: ${guardian.faunaPt}
- Flora e Botânica: ${guardian.floraPt}
- Culinária Tradicional: ${guardian.typicalDishPt}
- Festas e Expressões Culturais: ${guardian.musicAndCulturePt}
- Ícones e Heróis Históricos: ${guardian.famousIcons.join(', ')}
- Monumento Literário: "${guardian.literaryPergament.title}" por ${guardian.literaryPergament.author} (Trecho: "${guardian.literaryPergament.excerpt}")
- Hino Estadual: "${guardian.anthemTitle}"${weatherSnippet}

DIRETRIZES DE DIÁLOGO:
1. Personificação Absoluta: Fale em 1ª pessoa ("Eu, ${guardian.guardianName}..."), com tom acolhedor, nobre, repleto de amor pela terra, história e geografia brasileira.
2. Sabedoria e Exatidão: Utilize fatos geográficos, históricos, ecológicos e etnográficos verídicos do Brasil (fontes IBGE, IPHAN, INPE).
3. Concisão Nobre: Seja claro, inspirador e evite respostas excessivamente longas (mantenha entre 2 a 4 parágrafos fluídos).
4. Tom Educativo e Gamificado: Desperte a curiosidade do viajante. Lembre-o periodicamente de desvendar as missões do estado e conquistar a Sagrada Insígnia.
5. Idioma: Responda no idioma do interlocutor (primariamente Português do Brasil).`;
}

/**
 * Fallback contextual caso a GEMINI_API_KEY não esteja configurada no ambiente.
 */
function generateFallbackGuardianReply(guardian: GuardianData, message: string): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('culinária') || lowerMsg.includes('comida') || lowerMsg.includes('prato') || lowerMsg.includes('comer')) {
    return `Saudações, nobre viajante! Nos lares de ${guardian.stateNamePt}, a alma do povo reside nos sabores que atravessaram gerações. Aqui, celebramos com orgulho o tradicional prato: ${guardian.typicalDishPt}. Cada ingrediente guarda as bênçãos dos nossos rios, solo e tradições seculares!`;
  }

  if (lowerMsg.includes('natureza') || lowerMsg.includes('fauna') || lowerMsg.includes('animal') || lowerMsg.includes('bicho')) {
    return `Pelos caminhos sagrados de ${guardian.stateNamePt}, a vida selvagem pulsa com vigor. Nossos santuários abrigam com reverência a presença de ${guardian.faunaPt}, símbolos da nossa rica biodiversidade que devemos proteger incansavelmente.`;
  }

  if (lowerMsg.includes('planta') || lowerMsg.includes('flora') || lowerMsg.includes('árvore') || lowerMsg.includes('floresta')) {
    return `Olhe ao redor com respeito! A terra de ${guardian.stateNamePt} floresce sob o manto verde da nossa flora, com destaque para ${guardian.floraPt}. Suas raízes sustentam o equilíbrio deste rincão brasileiro.`;
  }

  if (lowerMsg.includes('hino') || lowerMsg.includes('música') || lowerMsg.includes('festa') || lowerMsg.includes('cultura')) {
    return `Nossa cultura ressoa nos tambores e poesias! Celebramos com entusiasmo o ${guardian.musicAndCulturePt}, e entoamos com o coração erguido o "${guardian.anthemTitle}". A arte do nosso povo é nosso escudo eterno!`;
  }

  if (lowerMsg.includes('história') || lowerMsg.includes('origem') || lowerMsg.includes('fundação') || lowerMsg.includes('passado')) {
    return `“${guardian.loreStoryPt}” Nossa história não é feita de palavras frias, mas da bravura de heróis como ${guardian.famousIcons.join(' e ')}. O que mais desejas desvendar sobre ${guardian.stateNamePt}?`;
  }

  return `Saudações, destemido explorador de ${guardian.stateNamePt}! Eu sou ${guardian.guardianName}, ${guardian.guardianTitlePt}. Ouço sua indagação: "${message}". Como guardião deste território, afirmo que a sabedoria de nossa terra é profunda como nossos rios e alta como nossas serras. Continue explorando nossas relíquias para revelar todos os mistérios da nossa gente!`;
}

/**
 * Processa a conversa inteligente com o Guardião usando Gemini API
 */
export async function processGuardianChat(req: GuardianChatRequest): Promise<GuardianChatResponse> {
  const guardian = GUARDIANS_DATA.find((g) => g.id.toUpperCase() === req.guardianId.toUpperCase()) || GUARDIANS_DATA[0];
  const client = getGeminiClient();

  if (!client) {
    const fallbackReply = generateFallbackGuardianReply(guardian, req.message);
    return {
      reply: fallbackReply,
      guardianName: guardian.guardianName,
      guardianTitle: guardian.guardianTitlePt,
      stateName: guardian.stateNamePt,
      isAiGenerated: false,
      modelUsed: 'codex-lore-engine-fallback',
    };
  }

  // Chave de cache baseada no ID do guardião e mensagem normalizada
  const cacheKey = `${guardian.id}_${req.message.trim().toLowerCase()}`;
  const cached = chatCache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.timestamp < CHAT_CACHE_TTL_MS) {
    return cached.reply;
  }

  // Deduplicação in-flight para evitar requisições duplicadas simultâneas
  if (inFlightChat.has(cacheKey)) {
    return inFlightChat.get(cacheKey)!;
  }

  const promise = (async () => {
    try {
      const systemInstruction = buildGuardianSystemInstruction(guardian, req.context);

      // Formata o histórico prévio caso fornecido
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (req.history && Array.isArray(req.history)) {
        req.history.slice(-6).forEach((turn) => {
          if (turn.text && turn.text.trim()) {
            contents.push({
              role: turn.role === 'model' ? 'model' : 'user',
              parts: [{ text: turn.text.trim() }],
            });
          }
        });
      }

      // Adiciona a pergunta atual do usuário
      contents.push({
        role: 'user',
        parts: [{ text: req.message.trim() }],
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.75,
          topP: 0.95,
        },
      });

      const replyText = response.text || generateFallbackGuardianReply(guardian, req.message);

      const result: GuardianChatResponse = {
        reply: replyText,
        guardianName: guardian.guardianName,
        guardianTitle: guardian.guardianTitlePt,
        stateName: guardian.stateNamePt,
        isAiGenerated: true,
        modelUsed: 'gemini-3.8-flash',
      };

      chatCache.set(cacheKey, { reply: result, timestamp: now });
      return result;
    } catch (error: any) {
      console.error('[GUARDIAN CHAT API ERROR]', error?.message || error);
      // Graceful fallback on API error
      const fallbackReply = generateFallbackGuardianReply(guardian, req.message);
      return {
        reply: fallbackReply,
        guardianName: guardian.guardianName,
        guardianTitle: guardian.guardianTitlePt,
        stateName: guardian.stateNamePt,
        isAiGenerated: false,
        modelUsed: 'codex-lore-engine-fallback',
      };
    } finally {
      inFlightChat.delete(cacheKey);
    }
  })();

  inFlightChat.set(cacheKey, promise);
  return promise;
}
