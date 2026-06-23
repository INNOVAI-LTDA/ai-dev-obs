"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = generateSummary;
exports.generateModuleReport = generateModuleReport;
function getObservability(event) {
    const observability = event.payload.observability;
    return observability && typeof observability === 'object' ? observability : undefined;
}
function getObservabilityNumber(event, field) {
    const observability = getObservability(event);
    if (!observability)
        return 0;
    const value = observability[field];
    return typeof value === 'number' ? value : 0;
}
function getTokenCountingMethods(events) {
    const methods = new Set();
    for (const event of events) {
        const method = getObservability(event)?.tokenCountingMethod;
        if (typeof method === 'string')
            methods.add(method);
    }
    return Array.from(methods);
}
function getModelLabels(events) {
    const labels = new Set();
    for (const event of events) {
        const model = event.payload.model;
        if (!model || typeof model !== 'object')
            continue;
        const modelRecord = model;
        const vendor = typeof modelRecord.vendor === 'string' ? modelRecord.vendor : 'unknown_vendor';
        const family = typeof modelRecord.family === 'string' ? modelRecord.family : undefined;
        const name = typeof modelRecord.name === 'string' ? modelRecord.name : undefined;
        const id = typeof modelRecord.id === 'string' ? modelRecord.id : undefined;
        labels.add([vendor, family ?? name ?? id ?? 'unknown_model'].join('/'));
    }
    return Array.from(labels);
}
function collectTags(events) {
    const tags = {};
    for (const event of events) {
        const payloadTags = event.payload.tags;
        if (!payloadTags || typeof payloadTags !== 'object')
            continue;
        for (const [key, value] of Object.entries(payloadTags)) {
            tags[key] = String(value);
        }
    }
    return tags;
}
function aggregate(events) {
    const userMessages = events.filter((event) => event.type === 'obs.chat.user_message');
    const assistantResponses = events.filter((event) => event.type === 'obs.chat.assistant_response');
    const modelStarted = events.filter((event) => event.type === 'obs.model.request.started');
    const modelCompleted = events.filter((event) => event.type === 'obs.model.request.completed');
    const modelFailed = events.filter((event) => event.type === 'obs.model.request.failed');
    const modelSelected = events.filter((event) => event.type === 'obs.model.selected');
    const conversationalEvents = [...userMessages, ...assistantResponses];
    const userTotalChars = userMessages.reduce((sum, event) => sum + getObservabilityNumber(event, 'totalchars'), 0);
    const assistantTotalChars = assistantResponses.reduce((sum, event) => sum + getObservabilityNumber(event, 'totalchars'), 0);
    const userEstimatedTokens = userMessages.reduce((sum, event) => sum + getObservabilityNumber(event, 'estimatedTokens'), 0);
    const assistantEstimatedTokens = assistantResponses.reduce((sum, event) => sum + getObservabilityNumber(event, 'estimatedTokens'), 0);
    const latencyValues = assistantResponses.map((event) => getObservabilityNumber(event, 'latencyMs')).filter((value) => value > 0);
    const averageLatencyMs = latencyValues.length ? Math.round(latencyValues.reduce((sum, value) => sum + value, 0) / latencyValues.length) : 0;
    return {
        userMessages,
        assistantResponses,
        modelStarted,
        modelCompleted,
        modelFailed,
        modelSelected,
        userTotalChars,
        assistantTotalChars,
        userEstimatedTokens,
        assistantEstimatedTokens,
        totalChars: userTotalChars + assistantTotalChars,
        totalEstimatedTokens: userEstimatedTokens + assistantEstimatedTokens,
        tokenCountingMethods: getTokenCountingMethods(conversationalEvents),
        modelLabels: getModelLabels([...assistantResponses, ...modelCompleted]),
        averageLatencyMs,
        tags: collectTags(events)
    };
}
function generateSummary(events) {
    const started = events.find((event) => event.type === 'obs.session.started');
    const stopped = events.find((event) => event.type === 'obs.session.stopped');
    const annotated = [...events].reverse().find((event) => event.type === 'obs.session.annotated');
    const metrics = aggregate(events);
    const intents = new Set();
    const riskFlags = new Set();
    const entities = new Set();
    for (const event of metrics.userMessages) {
        const intent = event.payload.inferredIntent;
        if (typeof intent === 'string')
            intents.add(intent);
        const flags = event.payload.riskFlags;
        if (Array.isArray(flags))
            flags.forEach((flag) => riskFlags.add(String(flag)));
        const extractedEntities = event.payload.entities;
        if (Array.isArray(extractedEntities))
            extractedEntities.forEach((entity) => entities.add(String(entity)));
    }
    const lines = [];
    lines.push('# AIDevObs Session Summary');
    lines.push('');
    lines.push(`Generated at: ${new Date().toISOString()}`);
    lines.push('');
    if (started) {
        lines.push('## Session');
        lines.push('');
        lines.push(`- Goal: ${String(started.payload.goal ?? 'Not informed')}`);
        lines.push(`- Workspace: ${String(started.payload.workspaceName ?? 'Unknown')}`);
        lines.push(`- Started at: ${started.timestamp}`);
        if (stopped)
            lines.push(`- Stopped at: ${stopped.timestamp}`);
        if (annotated) {
            lines.push(`- Course module: ${String(annotated.payload.courseModule ?? 'not tagged')}`);
            lines.push(`- Experiment: ${String(annotated.payload.experiment ?? 'not tagged')}`);
            lines.push(`- Strategy: ${String(annotated.payload.strategy ?? 'not tagged')}`);
            lines.push(`- Complexity: ${String(annotated.payload.complexity ?? 'not tagged')}`);
        }
        lines.push('');
    }
    lines.push('## Conversation Metrics');
    lines.push('');
    lines.push(`- User messages: ${metrics.userMessages.length}`);
    lines.push(`- Assistant responses: ${metrics.assistantResponses.length}`);
    lines.push(`- User totalchars: ${metrics.userTotalChars}`);
    lines.push(`- Assistant totalchars: ${metrics.assistantTotalChars}`);
    lines.push(`- Total chars: ${metrics.totalChars}`);
    lines.push(`- User estimatedTokens: ${metrics.userEstimatedTokens}`);
    lines.push(`- Assistant estimatedTokens: ${metrics.assistantEstimatedTokens}`);
    lines.push(`- Total estimatedTokens: ${metrics.totalEstimatedTokens}`);
    lines.push(`- tokenCountingMethod: ${metrics.tokenCountingMethods.length ? metrics.tokenCountingMethods.join(', ') : 'not available'}`);
    lines.push('');
    lines.push('## AI Proxy Observability');
    lines.push('');
    lines.push(`- Model requests started: ${metrics.modelStarted.length}`);
    lines.push(`- Model requests completed: ${metrics.modelCompleted.length}`);
    lines.push(`- Model request failures: ${metrics.modelFailed.length}`);
    lines.push(`- Explicit model selections: ${metrics.modelSelected.length}`);
    lines.push(`- Models observed: ${metrics.modelLabels.length ? metrics.modelLabels.join(', ') : 'not available'}`);
    lines.push(`- Average response latencyMs: ${metrics.averageLatencyMs || 'not available'}`);
    lines.push(`- Billing available: false`);
    lines.push('');
    lines.push('## Experiment Tags');
    lines.push('');
    const tags = Object.entries(metrics.tags);
    if (!tags.length)
        lines.push('- None');
    else
        tags.forEach(([key, value]) => lines.push(`- ${key}: ${value}`));
    lines.push('');
    lines.push('## Detected Intents');
    lines.push('');
    if (intents.size === 0)
        lines.push('- None detected');
    else
        for (const intent of intents)
            lines.push(`- ${intent}`);
    lines.push('');
    lines.push('## Detected Entities');
    lines.push('');
    if (entities.size === 0)
        lines.push('- None detected');
    else
        for (const entity of entities)
            lines.push(`- ${entity}`);
    lines.push('');
    lines.push('## Risk Flags');
    lines.push('');
    if (riskFlags.size === 0)
        lines.push('- None detected');
    else
        for (const flag of riskFlags)
            lines.push(`- ${flag}`);
    lines.push('');
    lines.push('## Timeline');
    lines.push('');
    for (const event of events) {
        if (event.type === 'obs.session.started')
            lines.push(`- ${event.timestamp} - Session started.`);
        if (event.type === 'obs.session.annotated')
            lines.push(`- ${event.timestamp} - Session annotated.`);
        if (event.type === 'obs.course.module.selected')
            lines.push(`- ${event.timestamp} - Course module selected: ${String(event.payload.courseModule ?? '')}.`);
        if (event.type === 'obs.experiment.tagged')
            lines.push(`- ${event.timestamp} - Experiment tagged.`);
        if (event.type === 'obs.chat.user_message')
            lines.push(`- ${event.timestamp} - User: ${String(event.payload.rawText ?? '')}`);
        if (event.type === 'obs.model.selected') {
            const label = [event.payload.vendor, event.payload.family, event.payload.id].filter(Boolean).join('/');
            lines.push(`- ${event.timestamp} - Model selected: ${label || 'unknown model'}.`);
        }
        if (event.type === 'obs.model.request.started')
            lines.push(`- ${event.timestamp} - Model request started.`);
        if (event.type === 'obs.model.request.completed')
            lines.push(`- ${event.timestamp} - Model request completed.`);
        if (event.type === 'obs.model.request.failed')
            lines.push(`- ${event.timestamp} - Model request failed: ${String(event.payload.message ?? 'unknown error')}`);
        if (event.type === 'obs.chat.assistant_response')
            lines.push(`- ${event.timestamp} - AIDevObs: ${String(event.payload.summary ?? '')}`);
        if (event.type === 'obs.session.stopped')
            lines.push(`- ${event.timestamp} - Session stopped.`);
    }
    lines.push('');
    lines.push('## Notes');
    lines.push('');
    lines.push('- This MVP logs only conversations routed through `@obs`.');
    lines.push('- AI responses are called through the VS Code Language Model API when a provider is available.');
    lines.push('- Token metrics are estimates based on `totalchars/4`, not provider billing.');
    lines.push('- Course/module reports are designed for classroom experiments and AIDevObs research workflows.');
    lines.push('');
    return lines.join('\n');
}
function generateModuleReport(events, moduleId) {
    const filtered = moduleId
        ? events.filter((event) => event.payload.courseModule === moduleId || event.payload.module === moduleId || event.payload.course_module === moduleId || true)
        : events;
    const metrics = aggregate(filtered);
    const lines = [];
    lines.push('# AIDevObs Module Report');
    lines.push('');
    lines.push(`Generated at: ${new Date().toISOString()}`);
    lines.push(`Module: ${moduleId ?? 'current session'}`);
    lines.push('');
    lines.push('## Learning Experiment Metrics');
    lines.push('');
    lines.push(`- User messages: ${metrics.userMessages.length}`);
    lines.push(`- Assistant responses: ${metrics.assistantResponses.length}`);
    lines.push(`- Total estimatedTokens: ${metrics.totalEstimatedTokens}`);
    lines.push(`- Total chars: ${metrics.totalChars}`);
    lines.push(`- Average response latencyMs: ${metrics.averageLatencyMs || 'not available'}`);
    lines.push(`- Models observed: ${metrics.modelLabels.length ? metrics.modelLabels.join(', ') : 'not available'}`);
    lines.push('');
    lines.push('## Suggested Classroom Discussion');
    lines.push('');
    lines.push('- Did more context improve the result or only increase cost?');
    lines.push('- Which prompts produced the highest token concentration?');
    lines.push('- Was the model acting on parametric knowledge, contextual information, or external retrieval?');
    lines.push('- Did specialist prompting reduce ambiguity compared with a monolithic prompt?');
    lines.push('');
    lines.push('## Experiment Tags');
    lines.push('');
    const tags = Object.entries(metrics.tags);
    if (!tags.length)
        lines.push('- None');
    else
        tags.forEach(([key, value]) => lines.push(`- ${key}: ${value}`));
    lines.push('');
    lines.push('## Interpretation');
    lines.push('');
    lines.push('Use this report as a lightweight observation artifact for comparing AI-assisted development strategies during the course.');
    lines.push('');
    return lines.join('\n');
}
//# sourceMappingURL=summaryGenerator.js.map