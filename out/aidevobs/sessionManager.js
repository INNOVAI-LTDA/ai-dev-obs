"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiDevObsSessionManager = void 0;
const vscode = __importStar(require("vscode"));
const textMetrics_1 = require("./textMetrics");
class AiDevObsSessionManager {
    store;
    currentSession;
    constructor(store) {
        this.store = store;
    }
    get activeSession() {
        return this.currentSession;
    }
    async init() {
        await this.store.initRepository();
    }
    async start(goal) {
        await this.store.initRepository();
        const workspaceName = vscode.workspace.workspaceFolders?.[0]?.name;
        const sessionId = this.createSessionId(goal);
        const session = {
            schemaVersion: '0.2',
            sessionId,
            goal,
            workspaceName,
            startedAt: new Date().toISOString(),
            status: 'active'
        };
        this.currentSession = session;
        await this.store.writeSession(session);
        await this.store.appendEvent({
            id: this.createEventId(),
            type: 'obs.session.started',
            sessionId,
            timestamp: new Date().toISOString(),
            payload: {
                goal,
                workspaceName
            }
        });
        return session;
    }
    async stop() {
        if (!this.currentSession) {
            return undefined;
        }
        this.currentSession.status = 'stopped';
        this.currentSession.stoppedAt = new Date().toISOString();
        await this.store.writeSession(this.currentSession);
        await this.store.appendEvent({
            id: this.createEventId(),
            type: 'obs.session.stopped',
            sessionId: this.currentSession.sessionId,
            timestamp: new Date().toISOString(),
            payload: {}
        });
        const stopped = this.currentSession;
        this.currentSession = undefined;
        return stopped;
    }
    async annotateSession(payload) {
        if (!this.currentSession) {
            await this.start();
        }
        const session = this.currentSession;
        session.courseModule = payload.courseModule ?? session.courseModule;
        session.experiment = payload.experiment ?? session.experiment;
        session.strategy = payload.strategy ?? session.strategy;
        session.complexity = payload.complexity ?? session.complexity;
        session.tags = { ...(session.tags ?? {}), ...(payload.tags ?? {}) };
        await this.store.writeSession(session);
        await this.store.appendEvent({
            id: this.createEventId(),
            type: 'obs.session.annotated',
            sessionId: session.sessionId,
            timestamp: new Date().toISOString(),
            payload: {
                courseModule: session.courseModule,
                experiment: session.experiment,
                strategy: session.strategy,
                complexity: session.complexity,
                tags: session.tags
            }
        });
        return session;
    }
    async setCourseModule(courseModule) {
        const session = await this.annotateSession({ courseModule });
        await this.store.appendEvent({
            id: this.createEventId(),
            type: 'obs.course.module.selected',
            sessionId: session.sessionId,
            timestamp: new Date().toISOString(),
            payload: { courseModule }
        });
        return session;
    }
    async tagExperiment(tags) {
        const session = await this.annotateSession({ tags });
        await this.store.appendEvent({
            id: this.createEventId(),
            type: 'obs.experiment.tagged',
            sessionId: session.sessionId,
            timestamp: new Date().toISOString(),
            payload: { tags }
        });
        return session;
    }
    async logUserMessage(rawText) {
        if (!this.currentSession) {
            await this.start();
        }
        const session = this.currentSession;
        const event = {
            id: this.createEventId(),
            type: 'obs.chat.user_message',
            sessionId: session.sessionId,
            timestamp: new Date().toISOString(),
            payload: {
                rawText,
                command: this.detectCommand(rawText),
                inferredIntent: this.inferIntent(rawText),
                entities: this.extractEntities(rawText),
                riskFlags: this.detectRiskFlags(rawText),
                observability: (0, textMetrics_1.calculateTextObservability)(rawText)
            }
        };
        await this.store.appendEvent(event);
        return event.id;
    }
    async logAssistantResponse(summary, rawResponse, parentEventId, extraPayload) {
        if (!this.currentSession) {
            return undefined;
        }
        const event = {
            id: this.createEventId(),
            type: 'obs.chat.assistant_response',
            sessionId: this.currentSession.sessionId,
            timestamp: new Date().toISOString(),
            parentEventId,
            payload: {
                summary,
                rawResponse,
                observability: (0, textMetrics_1.calculateTextObservability)(rawResponse ?? summary),
                ...extraPayload
            }
        };
        await this.store.appendEvent(event);
        return event.id;
    }
    async logModelRequestStarted(parentEventId) {
        if (!this.currentSession) {
            return undefined;
        }
        const event = {
            id: this.createEventId(),
            type: 'obs.model.request.started',
            sessionId: this.currentSession.sessionId,
            timestamp: new Date().toISOString(),
            parentEventId,
            payload: {}
        };
        await this.store.appendEvent(event);
        return event.id;
    }
    async logModelRequestCompleted(payload, parentEventId) {
        if (!this.currentSession) {
            return undefined;
        }
        const event = {
            id: this.createEventId(),
            type: 'obs.model.request.completed',
            sessionId: this.currentSession.sessionId,
            timestamp: new Date().toISOString(),
            parentEventId,
            payload
        };
        await this.store.appendEvent(event);
        return event.id;
    }
    async logModelRequestFailed(message, parentEventId, details) {
        if (!this.currentSession) {
            return undefined;
        }
        const event = {
            id: this.createEventId(),
            type: 'obs.model.request.failed',
            sessionId: this.currentSession.sessionId,
            timestamp: new Date().toISOString(),
            parentEventId,
            payload: {
                message,
                ...details
            }
        };
        await this.store.appendEvent(event);
        return event.id;
    }
    async logObservation(type, payload, parentEventId) {
        if (!this.currentSession) {
            return undefined;
        }
        const event = {
            id: this.createEventId(),
            type,
            sessionId: this.currentSession.sessionId,
            timestamp: new Date().toISOString(),
            parentEventId,
            payload
        };
        await this.store.appendEvent(event);
        return event.id;
    }
    createSessionId(goal) {
        const safeGoal = goal
            ? goal.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            : 'session';
        return `${new Date().toISOString().replace(/[:.]/g, '-')}-${safeGoal}`;
    }
    createEventId() {
        return `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    }
    detectCommand(text) {
        const trimmed = text.trim();
        if (!trimmed.startsWith('/')) {
            return undefined;
        }
        return trimmed.split(/\s+/)[0];
    }
    inferIntent(text) {
        const lower = text.toLowerCase();
        if (lower.includes('crie') || lower.includes('gerar') || lower.includes('gere') || lower.includes('implemente') || lower.includes('faça')) {
            return 'create_or_generate_code';
        }
        if (lower.includes('explique') || lower.includes('entenda') || lower.includes('analise')) {
            return 'explain_or_analyze';
        }
        if (lower.includes('erro') || lower.includes('bug') || lower.includes('falha') || lower.includes('stack trace')) {
            return 'debug';
        }
        if (lower.includes('teste') || lower.includes('unitário') || lower.includes('pytest') || lower.includes('jest')) {
            return 'test';
        }
        if (lower.includes('refatore') || lower.includes('refatorar')) {
            return 'refactor';
        }
        return 'unknown';
    }
    extractEntities(text) {
        const lower = text.toLowerCase();
        const entities = [];
        const candidates = [
            ['patient', ['paciente', 'patient']],
            ['cpf', ['cpf']],
            ['medical_record', ['prontuário', 'prontuario']],
            ['appointment', ['consulta', 'agenda', 'appointment']],
            ['fastapi', ['fastapi']],
            ['react', ['react']],
            ['vscode', ['vscode', 'vs code']]
        ];
        for (const [entity, terms] of candidates) {
            if (terms.some((term) => lower.includes(term))) {
                entities.push(entity);
            }
        }
        return entities;
    }
    detectRiskFlags(text) {
        const lower = text.toLowerCase();
        const flags = [];
        if (lower.includes('paciente') || lower.includes('cpf') || lower.includes('prontuário') || lower.includes('prontuario')) {
            flags.push('personal_or_health_data');
        }
        if (lower.includes('senha') || lower.includes('token') || lower.includes('secret') || lower.includes('api key')) {
            flags.push('secret_or_credential');
        }
        if (lower.includes('pagamento') || lower.includes('cartão') || lower.includes('cartao')) {
            flags.push('financial_data');
        }
        return flags;
    }
}
exports.AiDevObsSessionManager = AiDevObsSessionManager;
//# sourceMappingURL=sessionManager.js.map