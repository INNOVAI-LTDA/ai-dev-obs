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
exports.registerAiDevObsChatParticipant = registerAiDevObsChatParticipant;
const vscode = __importStar(require("vscode"));
const summaryGenerator_1 = require("./summaryGenerator");
const modelService_1 = require("./modelService");
const COURSE_MODULES = [
    ['m0', 'O que estamos observando?'],
    ['m1', 'O problema do contexto'],
    ['m2', 'O que a IA realmente aprende?'],
    ['m3', 'O modelo lembra ou consulta?'],
    ['m4', 'O custo invisível da IA'],
    ['m5', 'Agente generalista vs especialista'],
    ['m6', 'A arquitetura importa?'],
    ['m7', 'Inteligência está na unidade ou na rede?'],
    ['m8', 'Beyond Context']
];
const SCENARIOS = [
    ['trivial-cli-calculator', 'Trivial', 'CLI calculator with tests'],
    ['low-fastapi-crud', 'Low', 'FastAPI CRUD for patients'],
    ['medium-scheduler-api', 'Medium', 'Appointment reminder scheduler'],
    ['high-import-compliance', 'High', 'Document compliance analysis inspired by SWE-style multi-file tasks']
];
function parseTags(raw) {
    const tags = {};
    const pairs = raw.split(/\s+/).filter(Boolean);
    for (const pair of pairs) {
        const [key, ...valueParts] = pair.split('=');
        const value = valueParts.join('=');
        if (key && value)
            tags[key] = value;
    }
    return tags;
}
function registerAiDevObsChatParticipant(context, sessionManager, store) {
    const modelService = new modelService_1.AiDevObsModelService(context);
    const handler = async (request, _chatContext, stream, token) => {
        const prompt = request.prompt.trim();
        try {
            if (prompt.startsWith('/init')) {
                await sessionManager.init();
                stream.markdown('AIDevObs initialized. Created `.aidevobs/` repository layer in the current workspace.');
                return;
            }
            if (prompt.startsWith('/start')) {
                const goal = prompt.replace('/start', '').trim() || undefined;
                const session = await sessionManager.start(goal);
                stream.markdown(`AIDevObs session started: \`${session.sessionId}\``);
                return;
            }
            if (prompt.startsWith('/course')) {
                stream.markdown([
                    '# AIDevObs Course Modules',
                    '',
                    ...COURSE_MODULES.map(([id, title]) => `- \`${id}\` - ${title}`),
                    '',
                    'Use `@obs /module <id>` to tag the current session.'
                ].join('\n'));
                return;
            }
            if (prompt.startsWith('/module')) {
                const moduleId = prompt.replace('/module', '').trim();
                if (!moduleId) {
                    stream.markdown('Missing module id. Use `@obs /course` to list modules, then `@obs /module m1`.');
                    return;
                }
                const session = await sessionManager.setCourseModule(moduleId);
                stream.markdown(`AIDevObs course module set to \`${moduleId}\` for session \`${session.sessionId}\`.`);
                return;
            }
            if (prompt.startsWith('/tag')) {
                const rawTags = prompt.replace('/tag', '').trim();
                const tags = parseTags(rawTags);
                if (!Object.keys(tags).length) {
                    stream.markdown('Missing tags. Example: `@obs /tag experiment=prompt-size strategy=large-context complexity=medium`.');
                    return;
                }
                await sessionManager.tagExperiment(tags);
                stream.markdown([
                    'AIDevObs experiment tags added:',
                    '',
                    ...Object.entries(tags).map(([key, value]) => `- ${key}: ${value}`)
                ].join('\n'));
                return;
            }
            if (prompt.startsWith('/scenarios')) {
                stream.markdown([
                    '# AIDevObs Test Scenarios',
                    '',
                    ...SCENARIOS.map(([id, level, title]) => `- \`${id}\` (${level}) - ${title}`),
                    '',
                    'Scenario prompt files are included in `test-cases/project-prompts/` in this bundle.'
                ].join('\n'));
                return;
            }
            if (prompt.startsWith('/models')) {
                const models = await modelService.listModels();
                const markdown = modelService.formatModelsAsMarkdown(models);
                const session = sessionManager.activeSession;
                if (session) {
                    await sessionManager.logObservation('obs.model.available_models.listed', {
                        count: models.length,
                        models: models.map((model) => ({
                            index: model.index,
                            id: model.id,
                            name: model.name,
                            vendor: model.vendor,
                            family: model.family,
                            version: model.version,
                            maxInputTokens: model.maxInputTokens
                        }))
                    });
                }
                stream.markdown(markdown);
                return;
            }
            if (prompt.startsWith('/model')) {
                stream.markdown(modelService.formatSelectedModelAsMarkdown());
                return;
            }
            if (prompt.startsWith('/use-model')) {
                const identifier = prompt.replace('/use-model', '').trim();
                if (!identifier) {
                    stream.markdown([
                        'Missing model identifier.',
                        '',
                        'Use one of these formats:',
                        '',
                        '- `@obs /use-model <index>`',
                        '- `@obs /use-model <id>`',
                        '',
                        'Run `@obs /models` to list available models.'
                    ].join('\n'));
                    return;
                }
                const selectedModel = await modelService.selectModel(identifier);
                const session = sessionManager.activeSession;
                if (session) {
                    await sessionManager.logObservation('obs.model.selected', {
                        id: selectedModel.id,
                        name: selectedModel.name,
                        vendor: selectedModel.vendor,
                        family: selectedModel.family,
                        version: selectedModel.version,
                        maxInputTokens: selectedModel.maxInputTokens
                    });
                }
                stream.markdown(modelService.formatSelectionResultAsMarkdown(selectedModel));
                return;
            }
            if (prompt.startsWith('/clear-model')) {
                await modelService.clearSelectedModel();
                const session = sessionManager.activeSession;
                if (session) {
                    await sessionManager.logObservation('obs.model.selection.cleared', {});
                }
                stream.markdown('AIDevObs explicit model selection cleared. Future prompts will use the first model returned by the VS Code Language Model API.');
                return;
            }
            if (prompt.startsWith('/status')) {
                const session = sessionManager.activeSession;
                if (!session) {
                    stream.markdown('No active AIDevObs session. Use `@obs /start your goal` to begin.');
                    return;
                }
                stream.markdown([
                    'Active AIDevObs session:',
                    '',
                    `- Session: \`${session.sessionId}\``,
                    `- Goal: ${session.goal ?? 'Not informed'}`,
                    `- Started at: ${session.startedAt}`,
                    `- Module: ${session.courseModule ?? 'not tagged'}`,
                    `- Experiment: ${session.experiment ?? 'not tagged'}`,
                    `- Strategy: ${session.strategy ?? 'not tagged'}`,
                    `- Complexity: ${session.complexity ?? 'not tagged'}`,
                    `- Tags: ${session.tags ? JSON.stringify(session.tags) : 'none'}`
                ].join('\n'));
                return;
            }
            if (prompt.startsWith('/stop')) {
                const session = await sessionManager.stop();
                if (!session) {
                    stream.markdown('No active AIDevObs session.');
                    return;
                }
                stream.markdown(`AIDevObs session stopped: \`${session.sessionId}\``);
                return;
            }
            if (prompt.startsWith('/summary')) {
                const session = sessionManager.activeSession;
                if (!session) {
                    stream.markdown('No active AIDevObs session to summarize.');
                    return;
                }
                const events = await store.readEvents(session.sessionId);
                const summary = (0, summaryGenerator_1.generateSummary)(events);
                const uri = await store.writeSummary(session.sessionId, summary);
                stream.markdown(`AIDevObs summary generated: \`${uri.fsPath}\``);
                return;
            }
            if (prompt.startsWith('/report')) {
                const session = sessionManager.activeSession;
                if (!session) {
                    stream.markdown('No active AIDevObs session to report.');
                    return;
                }
                const moduleId = prompt.replace('/report', '').trim() || session.courseModule;
                const events = await store.readEvents(session.sessionId);
                const report = (0, summaryGenerator_1.generateModuleReport)(events, moduleId);
                const filename = `${session.sessionId}${moduleId ? '-' + moduleId : ''}-module-report.md`;
                const uri = await store.writeReport(filename, report);
                await sessionManager.logObservation('obs.report.generated', { moduleId, path: uri.fsPath });
                stream.markdown(`AIDevObs module report generated: \`${uri.fsPath}\``);
                return;
            }
            const userEventId = await sessionManager.logUserMessage(prompt);
            const modelRequestEventId = await sessionManager.logModelRequestStarted(userEventId);
            try {
                const result = await modelService.ask(prompt, stream, token);
                await sessionManager.logModelRequestCompleted({
                    model: result.model,
                    observability: result.observability
                }, modelRequestEventId ?? userEventId);
                await sessionManager.logAssistantResponse('AI model response captured by AIDevObs.', result.text, userEventId, {
                    model: result.model,
                    observability: result.observability
                });
            }
            catch (modelError) {
                const message = modelError instanceof Error ? modelError.message : String(modelError);
                await sessionManager.logModelRequestFailed(message, modelRequestEventId ?? userEventId, {
                    fallback: 'logger_only'
                });
                const fallbackResponse = [
                    'AIDevObs logged your message, but could not call a VS Code language model.',
                    '',
                    `Reason: ${message}`,
                    '',
                    'The session log is still valid. After configuring a language model provider in VS Code, send the prompt again through `@obs`.'
                ].join('\n');
                await sessionManager.logAssistantResponse('Model call failed; AIDevObs returned logger-only fallback.', fallbackResponse, userEventId, {
                    modelError: message,
                    mode: 'logger_only_fallback'
                });
                stream.markdown(fallbackResponse);
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            await sessionManager.logModelRequestFailed(message, undefined, { operation: 'chat_participant_handler' });
            stream.markdown(`AIDevObs error: ${message}`);
        }
    };
    const participant = vscode.chat.createChatParticipant('obs', handler);
    // Future: add an icon at resources/obs.png and uncomment this line.
    // participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'obs.png');
    return participant;
}
//# sourceMappingURL=chatParticipant.js.map