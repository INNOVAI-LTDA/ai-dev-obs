import * as vscode from 'vscode';
import { AiDevObsEventStore } from './aidevobs/eventStore';
import { AiDevObsSessionManager } from './aidevobs/sessionManager';
import { generateModuleReport, generateSummary } from './aidevobs/summaryGenerator';
import { registerAiDevObsChatParticipant } from './aidevobs/chatParticipant';

export function activate(context: vscode.ExtensionContext) {
  const store = new AiDevObsEventStore();
  const sessionManager = new AiDevObsSessionManager(store);

  context.subscriptions.push(
    vscode.commands.registerCommand('obs.init', async () => {
      try {
        await sessionManager.init();
        vscode.window.showInformationMessage('AIDevObs initialized. Created .aidevobs/ repository layer.');
      } catch (error) {
        vscode.window.showErrorMessage(`AIDevObs init failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('obs.start', async () => {
      try {
        const goal = await vscode.window.showInputBox({
          title: 'AIDevObs Session Goal',
          prompt: 'What are you working on?',
          placeHolder: 'Example: prompt-size experiment for FastAPI CRUD'
        });

        const session = await sessionManager.start(goal);
        vscode.window.showInformationMessage(`AIDevObs session started: ${session.sessionId}`);
      } catch (error) {
        vscode.window.showErrorMessage(`AIDevObs start failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('obs.status', async () => {
      const session = sessionManager.activeSession;

      if (!session) {
        vscode.window.showInformationMessage('No active AIDevObs session.');
        return;
      }

      vscode.window.showInformationMessage(`Active AIDevObs session: ${session.sessionId}`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('obs.summary', async () => {
      try {
        const session = sessionManager.activeSession;

        if (!session) {
          vscode.window.showWarningMessage('No active AIDevObs session.');
          return;
        }

        const events = await store.readEvents(session.sessionId);
        const summary = generateSummary(events);
        const uri = await store.writeSummary(session.sessionId, summary);

        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      } catch (error) {
        vscode.window.showErrorMessage(`AIDevObs summary failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('obs.report', async () => {
      try {
        const session = sessionManager.activeSession;

        if (!session) {
          vscode.window.showWarningMessage('No active AIDevObs session.');
          return;
        }

        const events = await store.readEvents(session.sessionId);
        const report = generateModuleReport(events, session.courseModule);
        const uri = await store.writeReport(`${session.sessionId}-module-report.md`, report);

        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      } catch (error) {
        vscode.window.showErrorMessage(`AIDevObs report failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('obs.stop', async () => {
      try {
        const session = await sessionManager.stop();

        if (!session) {
          vscode.window.showWarningMessage('No active AIDevObs session.');
          return;
        }

        vscode.window.showInformationMessage(`AIDevObs session stopped: ${session.sessionId}`);
      } catch (error) {
        vscode.window.showErrorMessage(`AIDevObs stop failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    })
  );

  context.subscriptions.push(registerAiDevObsChatParticipant(context, sessionManager, store));
}

export function deactivate() {}
