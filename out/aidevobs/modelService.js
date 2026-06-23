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
exports.AiDevObsModelService = void 0;
const vscode = __importStar(require("vscode"));
const textMetrics_1 = require("./textMetrics");
const SELECTED_MODEL_KEY = 'obs.selectedLanguageModel';
class AiDevObsModelService {
    context;
    constructor(context) {
        this.context = context;
    }
    async listModels() {
        const models = await vscode.lm.selectChatModels({});
        return models.map((model, index) => this.toAvailableModelInfo(model, index));
    }
    getSelectedModel() {
        return this.context.workspaceState.get(SELECTED_MODEL_KEY);
    }
    async clearSelectedModel() {
        await this.context.workspaceState.update(SELECTED_MODEL_KEY, undefined);
    }
    async selectModel(identifier) {
        const models = await this.listModels();
        const selected = this.findModelByIdentifier(models, identifier);
        if (!selected) {
            throw new Error(`Could not find a VS Code language model matching "${identifier}". Run \`@obs /models\` and try an index or id from the list.`);
        }
        const selectedModel = {
            id: selected.id,
            name: selected.name,
            vendor: selected.vendor,
            family: selected.family,
            version: selected.version,
            index: selected.index,
            maxInputTokens: selected.maxInputTokens,
            selectedAt: new Date().toISOString()
        };
        await this.context.workspaceState.update(SELECTED_MODEL_KEY, selectedModel);
        return selectedModel;
    }
    formatModelsAsMarkdown(models) {
        const selected = this.getSelectedModel();
        if (!models.length) {
            return [
                'AIDevObs did not find any VS Code language model available to this extension.',
                '',
                'This means `vscode.lm.selectChatModels({})` returned an empty list.',
                '',
                'Check whether your model provider is installed, authenticated, and exposed to the VS Code Language Model API.'
            ].join('\n');
        }
        const lines = [];
        lines.push('AIDevObs available VS Code language models:');
        lines.push('');
        for (const model of models) {
            const selectedMark = this.isSameModel(model, selected) ? ' **[selected]**' : '';
            lines.push(`${model.index}. ${model.name ?? model.id ?? 'Unnamed model'}${selectedMark}`);
            lines.push(`   - vendor: ${model.vendor ?? 'unknown'}`);
            lines.push(`   - family: ${model.family ?? 'unknown'}`);
            lines.push(`   - id: ${model.id ?? 'unknown'}`);
            if (model.version) {
                lines.push(`   - version: ${model.version}`);
            }
            if (typeof model.maxInputTokens === 'number') {
                lines.push(`   - maxInputTokens: ${model.maxInputTokens}`);
            }
            lines.push('');
        }
        lines.push('To select a model explicitly, use:');
        lines.push('');
        lines.push('- `@obs /use-model <index>`');
        lines.push('- `@obs /use-model <id>`');
        lines.push('');
        lines.push('Example for your MiniMax result:');
        lines.push('');
        lines.push('- `@obs /use-model MiniMax-M3-intl`');
        return lines.join('\n');
    }
    formatSelectedModelAsMarkdown() {
        const selected = this.getSelectedModel();
        if (!selected) {
            return [
                'AIDevObs has no explicit model selected.',
                '',
                'Run `@obs /models` to list available models, then use `@obs /use-model <index>` or `@obs /use-model <id>`.',
                '',
                'Without an explicit selection, AIDevObs uses the first model returned by the VS Code Language Model API. That may fall back to Copilot/premium quota.'
            ].join('\n');
        }
        return [
            'AIDevObs selected language model:',
            '',
            `- name: ${selected.name ?? 'unknown'}`,
            `- vendor: ${selected.vendor ?? 'unknown'}`,
            `- family: ${selected.family ?? 'unknown'}`,
            `- id: ${selected.id ?? 'unknown'}`,
            `- version: ${selected.version ?? 'unknown'}`,
            typeof selected.maxInputTokens === 'number' ? `- maxInputTokens: ${selected.maxInputTokens}` : undefined,
            `- selectedAt: ${selected.selectedAt}`
        ].filter(Boolean).join('\n');
    }
    formatSelectionResultAsMarkdown(model) {
        return [
            'AIDevObs model selected:',
            '',
            `- name: ${model.name ?? 'unknown'}`,
            `- vendor: ${model.vendor ?? 'unknown'}`,
            `- family: ${model.family ?? 'unknown'}`,
            `- id: ${model.id ?? 'unknown'}`,
            `- version: ${model.version ?? 'unknown'}`,
            typeof model.maxInputTokens === 'number' ? `- maxInputTokens: ${model.maxInputTokens}` : undefined,
            '',
            'Future `@obs` prompts will use this model when possible.'
        ].filter(Boolean).join('\n');
    }
    async ask(prompt, stream, token) {
        const startedAt = Date.now();
        const model = await this.resolveModel();
        if (!model) {
            throw new Error('No VS Code language model is available. Configure GitHub Copilot or another VS Code Language Model provider, then try again.');
        }
        const messages = [
            vscode.LanguageModelChatMessage.User(this.buildSystemInstruction()),
            vscode.LanguageModelChatMessage.User(prompt)
        ];
        const response = await model.sendRequest(messages, {}, token);
        const chunks = [];
        for await (const chunk of response.text) {
            chunks.push(chunk);
            stream.markdown(chunk);
        }
        const text = chunks.join('');
        const textObservability = (0, textMetrics_1.calculateTextObservability)(text);
        const modelRecord = model;
        return {
            text,
            model: {
                id: model.id,
                name: model.name,
                vendor: model.vendor,
                family: model.family,
                version: typeof modelRecord.version === 'string' ? modelRecord.version : undefined
            },
            observability: {
                ...textObservability,
                latencyMs: Date.now() - startedAt,
                streamed: true,
                billingAvailable: false
            }
        };
    }
    async resolveModel() {
        const selected = this.getSelectedModel();
        if (!selected) {
            const models = await vscode.lm.selectChatModels({});
            return models[0];
        }
        const selector = {};
        if (selected.vendor) {
            selector.vendor = selected.vendor;
        }
        if (selected.family) {
            selector.family = selected.family;
        }
        if (selected.version) {
            selector.version = selected.version;
        }
        let models = await vscode.lm.selectChatModels(selector);
        if (!models.length) {
            models = await vscode.lm.selectChatModels({});
        }
        return models.find((model) => this.isSameModel(this.toAvailableModelInfo(model, 0), selected))
            ?? models.find((model) => selected.id && model.id === selected.id)
            ?? models.find((model) => selected.name && model.name === selected.name)
            ?? models[0];
    }
    toAvailableModelInfo(model, index) {
        const modelRecord = model;
        return {
            index: index + 1,
            id: model.id,
            name: model.name,
            vendor: model.vendor,
            family: model.family,
            version: typeof modelRecord.version === 'string' ? modelRecord.version : undefined,
            maxInputTokens: typeof modelRecord.maxInputTokens === 'number' ? modelRecord.maxInputTokens : undefined,
            raw: {
                id: model.id,
                name: model.name,
                vendor: model.vendor,
                family: model.family,
                version: modelRecord.version,
                maxInputTokens: modelRecord.maxInputTokens
            }
        };
    }
    findModelByIdentifier(models, identifier) {
        const trimmed = identifier.trim();
        const index = Number(trimmed);
        if (Number.isInteger(index) && index > 0) {
            return models.find((model) => model.index === index);
        }
        const lower = trimmed.toLowerCase();
        return models.find((model) => model.id?.toLowerCase() === lower)
            ?? models.find((model) => model.name?.toLowerCase() === lower)
            ?? models.find((model) => model.id?.toLowerCase().includes(lower))
            ?? models.find((model) => model.name?.toLowerCase().includes(lower));
    }
    isSameModel(model, selected) {
        if (!model || !selected) {
            return false;
        }
        if (model.id && selected.id && model.id === selected.id) {
            return true;
        }
        return Boolean(model.vendor && selected.vendor && model.vendor === selected.vendor &&
            model.family && selected.family && model.family === selected.family &&
            model.name && selected.name && model.name === selected.name);
    }
    buildSystemInstruction() {
        return [
            'You are AIDevObs, an AI assistant inside VS Code.',
            'Help the developer with practical software engineering guidance.',
            'When producing code, prefer concise explanations and explicit trade-offs.',
            'If healthcare, CPF, patient, medical record, credential, token, or secret data appears, point out privacy and governance risks.',
            'Do not claim that code was changed unless the user explicitly applied it or you have tool evidence.'
        ].join('\n');
    }
}
exports.AiDevObsModelService = AiDevObsModelService;
//# sourceMappingURL=modelService.js.map