import { AiDevObsChatEvent, AiDevObsSession } from './types';

export interface AiDevObsSessionMetrics {
  interactionCount: number;
  userMessageCount: number;
  assistantResponseCount: number;
  inputChars: number;
  outputChars: number;
  totalChars: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedTotalTokens: number;
  tokenCountingMethod: string;
  tokenCountingMethods: string[];
  humanActiveTimeMs: number;
  aiResponseTimeMs: number;
  totalSessionTimeMs: number;
  tokensPerInteraction: number;
  aiTimePerInteractionMs: number;
  humanAiRatio: number;
  tokensPerMinute?: number;
  averageResponseLatencyMs: number;
}

type ObservabilityField = 'totalchars' | 'estimatedTokens' | 'latencyMs';

function getObservability(event: AiDevObsChatEvent): Record<string, unknown> | undefined {
  const observability = event.payload.observability;
  return observability && typeof observability === 'object' ? observability as Record<string, unknown> : undefined;
}

function getObservabilityNumber(event: AiDevObsChatEvent, field: ObservabilityField): number {
  const observability = getObservability(event);
  if (!observability) return 0;
  const value = observability[field];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function getTokenCountingMethods(events: AiDevObsChatEvent[]): string[] {
  const methods = new Set<string>();
  for (const event of events) {
    const method = getObservability(event)?.tokenCountingMethod;
    if (typeof method === 'string') methods.add(method);
  }
  return Array.from(methods);
}

function parseTimestamp(value?: string): number | undefined {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function getSessionEndMs(session: AiDevObsSession, events: AiDevObsChatEvent[]): number | undefined {
  const stoppedAt = parseTimestamp(session.stoppedAt);
  if (stoppedAt !== undefined) return stoppedAt;

  const lastEventTimestamp = [...events]
    .map((event) => parseTimestamp(event.timestamp))
    .filter((timestamp): timestamp is number => timestamp !== undefined)
    .sort((left, right) => right - left)[0];

  return lastEventTimestamp;
}

function safeDivide(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

function roundMetric(value: number): number {
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;
}

export function calculateSessionMetrics(session: AiDevObsSession, events: AiDevObsChatEvent[]): AiDevObsSessionMetrics {
  const userMessages = events.filter((event) => event.type === 'obs.chat.user_message');
  const assistantResponses = events.filter((event) => event.type === 'obs.chat.assistant_response');
  const conversationalEvents = [...userMessages, ...assistantResponses];

  const inputChars = userMessages.reduce((sum, event) => sum + getObservabilityNumber(event, 'totalchars'), 0);
  const outputChars = assistantResponses.reduce((sum, event) => sum + getObservabilityNumber(event, 'totalchars'), 0);
  const estimatedInputTokens = userMessages.reduce((sum, event) => sum + getObservabilityNumber(event, 'estimatedTokens'), 0);
  const estimatedOutputTokens = assistantResponses.reduce((sum, event) => sum + getObservabilityNumber(event, 'estimatedTokens'), 0);
  const latencyValues = assistantResponses.map((event) => getObservabilityNumber(event, 'latencyMs')).filter((value) => value > 0);
  const aiResponseTimeMs = latencyValues.reduce((sum, value) => sum + value, 0);
  const averageResponseLatencyMs = latencyValues.length ? Math.round(aiResponseTimeMs / latencyValues.length) : 0;

  const totalChars = inputChars + outputChars;
  const estimatedTotalTokens = estimatedInputTokens + estimatedOutputTokens;
  const interactionCount = userMessages.length;
  const tokenCountingMethods = getTokenCountingMethods(conversationalEvents);
  const sessionStartMs = parseTimestamp(session.startedAt);
  const sessionEndMs = getSessionEndMs(session, events);
  const totalSessionTimeMs = sessionStartMs !== undefined && sessionEndMs !== undefined
    ? Math.max(0, sessionEndMs - sessionStartMs)
    : 0;
  const humanActiveTimeMs = Math.max(0, totalSessionTimeMs - aiResponseTimeMs);
  const tokensPerMinute = totalSessionTimeMs > 0 ? roundMetric(estimatedTotalTokens / (totalSessionTimeMs / 60000)) : undefined;

  return {
    interactionCount,
    userMessageCount: userMessages.length,
    assistantResponseCount: assistantResponses.length,
    inputChars,
    outputChars,
    totalChars,
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedTotalTokens,
    tokenCountingMethod: tokenCountingMethods.length ? tokenCountingMethods.join(', ') : 'not available',
    tokenCountingMethods,
    humanActiveTimeMs,
    aiResponseTimeMs,
    totalSessionTimeMs,
    tokensPerInteraction: roundMetric(safeDivide(estimatedTotalTokens, interactionCount)),
    aiTimePerInteractionMs: roundMetric(safeDivide(aiResponseTimeMs, interactionCount)),
    humanAiRatio: roundMetric(safeDivide(humanActiveTimeMs, aiResponseTimeMs)),
    tokensPerMinute,
    averageResponseLatencyMs
  };
}
