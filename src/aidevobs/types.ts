export type AiDevObsSessionStatus = 'active' | 'stopped';

export interface AiDevObsCostMetrics {
  interactionCount: number;
  inputChars: number;
  outputChars: number;
  totalChars: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedTotalTokens: number;
  tokenCountingMethod: 'totalchars/4' | string;
  humanActiveTimeMs: number;
  aiResponseTimeMs: number;
  totalSessionTimeMs: number;
  tokensPerInteraction: number;
  aiTimePerInteractionMs: number;
  humanAiRatio: number;
}

export interface AiDevObsSession {
  schemaVersion?: '0.1' | '0.2' | string;
  sessionId: string;
  goal?: string;
  workspaceName?: string;
  startedAt: string;
  stoppedAt?: string;
  status: AiDevObsSessionStatus;
  courseModule?: string;
  experiment?: string;
  strategy?: string;
  complexity?: 'trivial' | 'low' | 'medium' | 'high' | string;
  taskType?: 'feature' | 'bug' | 'refactor' | 'docs' | 'research' | 'test' | 'architecture' | string;
  metrics?: AiDevObsCostMetrics;
  tags?: Record<string, string>;
}

export type AiDevObsEventType =
  | 'obs.session.started'
  | 'obs.session.stopped'
  | 'obs.session.annotated'
  | 'obs.course.module.selected'
  | 'obs.task.type.selected'
  | 'obs.experiment.tagged'
  | 'obs.report.generated'
  | 'obs.chat.user_message'
  | 'obs.chat.assistant_response'
  | 'obs.model.request.started'
  | 'obs.model.request.completed'
  | 'obs.model.request.failed'
  | 'obs.model.available_models.listed'
  | 'obs.model.selected'
  | 'obs.model.selection.cleared';

export interface AiDevObsTextObservability {
  totalchars: number;
  estimatedTokens: number;
  tokenCountingMethod: 'totalchars/4';
}

export interface AiDevObsModelInfo {
  id?: string;
  name?: string;
  vendor?: string;
  family?: string;
  version?: string;
}

export interface AiDevObsModelObservability extends AiDevObsTextObservability {
  latencyMs?: number;
  streamed?: boolean;
  billingAvailable: boolean;
}

export interface AiDevObsChatEvent {
  id: string;
  type: AiDevObsEventType;
  sessionId: string;
  timestamp: string;
  parentEventId?: string;
  payload: Record<string, unknown>;
}

export interface AiDevObsUserMessagePayload {
  rawText: string;
  command?: string;
  inferredIntent?: string;
  entities?: string[];
  riskFlags?: string[];
  observability?: AiDevObsTextObservability;
}

export interface AiDevObsModelResponsePayload {
  summary: string;
  rawResponse: string;
  model?: AiDevObsModelInfo;
  observability: AiDevObsModelObservability;
}
