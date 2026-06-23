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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const eventStore_1 = require("./aidevobs/eventStore");
const sessionManager_1 = require("./aidevobs/sessionManager");
const summaryGenerator_1 = require("./aidevobs/summaryGenerator");
const chatParticipant_1 = require("./aidevobs/chatParticipant");
function activate(context) {
    const store = new eventStore_1.AiDevObsEventStore();
    const sessionManager = new sessionManager_1.AiDevObsSessionManager(store);
    context.subscriptions.push(vscode.commands.registerCommand('obs.init', async () => {
        try {
            await sessionManager.init();
            vscode.window.showInformationMessage('AIDevObs initialized. Created .aidevobs/ repository layer.');
        }
        catch (error) {
            vscode.window.showErrorMessage(`AIDevObs init failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('obs.start', async () => {
        try {
            const goal = await vscode.window.showInputBox({
                title: 'AIDevObs Session Goal',
                prompt: 'What are you working on?',
                placeHolder: 'Example: prompt-size experiment for FastAPI CRUD'
            });
            const session = await sessionManager.start(goal);
            vscode.window.showInformationMessage(`AIDevObs session started: ${session.sessionId}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`AIDevObs start failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('obs.status', async () => {
        const session = sessionManager.activeSession;
        if (!session) {
            vscode.window.showInformationMessage('No active AIDevObs session.');
            return;
        }
        vscode.window.showInformationMessage(`Active AIDevObs session: ${session.sessionId}`);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('obs.summary', async () => {
        try {
            const session = sessionManager.activeSession;
            if (!session) {
                vscode.window.showWarningMessage('No active AIDevObs session.');
                return;
            }
            const events = await store.readEvents(session.sessionId);
            const summary = (0, summaryGenerator_1.generateSummary)(events);
            const uri = await store.writeSummary(session.sessionId, summary);
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc);
        }
        catch (error) {
            vscode.window.showErrorMessage(`AIDevObs summary failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('obs.report', async () => {
        try {
            const session = sessionManager.activeSession;
            if (!session) {
                vscode.window.showWarningMessage('No active AIDevObs session.');
                return;
            }
            const events = await store.readEvents(session.sessionId);
            const report = (0, summaryGenerator_1.generateModuleReport)(events, session.courseModule);
            const uri = await store.writeReport(`${session.sessionId}-module-report.md`, report);
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc);
        }
        catch (error) {
            vscode.window.showErrorMessage(`AIDevObs report failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('obs.stop', async () => {
        try {
            const session = await sessionManager.stop();
            if (!session) {
                vscode.window.showWarningMessage('No active AIDevObs session.');
                return;
            }
            vscode.window.showInformationMessage(`AIDevObs session stopped: ${session.sessionId}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`AIDevObs stop failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }));
    context.subscriptions.push((0, chatParticipant_1.registerAiDevObsChatParticipant)(context, sessionManager, store));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map