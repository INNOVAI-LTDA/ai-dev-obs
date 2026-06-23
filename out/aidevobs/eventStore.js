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
exports.AiDevObsEventStore = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class AiDevObsEventStore {
    workspaceRoot() {
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (!folder) {
            throw new Error('AIDevObs requires an open workspace folder.');
        }
        return folder.uri.fsPath;
    }
    obsRoot() {
        return vscode.Uri.file(path.join(this.workspaceRoot(), '.aidevobs'));
    }
    sessionDir(sessionId) {
        return vscode.Uri.file(path.join(this.workspaceRoot(), '.aidevobs', 'sessions', sessionId));
    }
    reportsDir() {
        return vscode.Uri.file(path.join(this.workspaceRoot(), '.aidevobs', 'reports'));
    }
    async initRepository() {
        const root = this.obsRoot();
        await vscode.workspace.fs.createDirectory(root);
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(root.fsPath, 'sessions')));
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(root.fsPath, 'reports')));
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(root.fsPath, 'policies')));
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.join(root.fsPath, 'templates')));
        const configUri = vscode.Uri.file(path.join(root.fsPath, 'obs.yaml'));
        try {
            await vscode.workspace.fs.stat(configUri);
        }
        catch {
            const content = [
                'project:',
                '  name: ""',
                '  domain: ""',
                '',
                'aidevobs:',
                '  concept: "observability for AI-assisted software development"',
                '  chat_participant: "@obs"',
                '',
                'capture:',
                '  chat: true',
                '  code_changes: false',
                '  terminal: false',
                '  course_module: true',
                '  experiment_tags: true',
                '',
                'privacy:',
                '  store_raw_prompts: true',
                '  redact_secrets: true',
                '  store_locally_only: true',
                '',
                'observability:',
                '  token_counting_method: "totalchars/4"',
                '  billing_available: false',
                '',
                'governance:',
                '  sensitive_terms:',
                '    - paciente',
                '    - cpf',
                '    - prontuario',
                '    - prontuário',
                '    - senha',
                '    - token',
                '    - secret',
                ''
            ].join('\n');
            await vscode.workspace.fs.writeFile(configUri, Buffer.from(content, 'utf8'));
        }
    }
    async writeSession(session) {
        const dir = this.sessionDir(session.sessionId);
        await vscode.workspace.fs.createDirectory(dir);
        const uri = vscode.Uri.file(path.join(dir.fsPath, 'session.json'));
        await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(session, null, 2), 'utf8'));
    }
    async appendEvent(event) {
        const dir = this.sessionDir(event.sessionId);
        await vscode.workspace.fs.createDirectory(dir);
        const uri = vscode.Uri.file(path.join(dir.fsPath, 'chat-events.jsonl'));
        const line = JSON.stringify(event) + '\n';
        let previous = '';
        try {
            const data = await vscode.workspace.fs.readFile(uri);
            previous = Buffer.from(data).toString('utf8');
        }
        catch {
            previous = '';
        }
        await vscode.workspace.fs.writeFile(uri, Buffer.from(previous + line, 'utf8'));
    }
    async readEvents(sessionId) {
        const uri = vscode.Uri.file(path.join(this.sessionDir(sessionId).fsPath, 'chat-events.jsonl'));
        try {
            const data = await vscode.workspace.fs.readFile(uri);
            const text = Buffer.from(data).toString('utf8');
            return text
                .split('\n')
                .filter(Boolean)
                .map((line) => JSON.parse(line));
        }
        catch {
            return [];
        }
    }
    async writeSummary(sessionId, content) {
        const dir = this.sessionDir(sessionId);
        await vscode.workspace.fs.createDirectory(dir);
        const uri = vscode.Uri.file(path.join(dir.fsPath, 'summary.md'));
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
        return uri;
    }
    async writeReport(filename, content) {
        const dir = this.reportsDir();
        await vscode.workspace.fs.createDirectory(dir);
        const uri = vscode.Uri.file(path.join(dir.fsPath, filename));
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
        return uri;
    }
}
exports.AiDevObsEventStore = AiDevObsEventStore;
//# sourceMappingURL=eventStore.js.map