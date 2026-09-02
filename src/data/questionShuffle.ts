/**
 * Utilitário de Embaralhamento Seguro para Alternativas de Quests e Quizzes
 * Garante que a resposta correta nunca fique estática (ex: sempre letra A).
 * Aplica o algoritmo de Fisher-Yates em runtime preservando o vínculo com a resposta verdadeira.
 */

export function shuffleQuestionOptions<
  T extends {
    optionsPt: string[];
    optionsEn?: string[];
    correctIndex: number;
  }
>(question: T): T {
  if (!question || !question.optionsPt || question.optionsPt.length <= 1) {
    return question;
  }

  const originalCorrectPt = question.optionsPt[question.correctIndex];
  const originalCorrectEn =
    question.optionsEn && question.correctIndex < question.optionsEn.length
      ? question.optionsEn[question.correctIndex]
      : undefined;

  // Monta lista indexada
  const items = question.optionsPt.map((pt, idx) => ({
    pt,
    en: question.optionsEn && idx < question.optionsEn.length ? question.optionsEn[idx] : undefined,
    wasCorrect: idx === question.correctIndex,
  }));

  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }

  const newCorrectIndex = items.findIndex((item) => item.wasCorrect);

  return {
    ...question,
    optionsPt: items.map((item) => item.pt),
    optionsEn: question.optionsEn ? items.map((item) => item.en || '') : undefined,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}
