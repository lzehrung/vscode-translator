import * as vscode from 'vscode';
import axios from 'axios';

const model = 'gpt-4o-mini';
const defaultLanguage = Intl.DateTimeFormat().resolvedOptions().locale;

function detectCase(text: string): string {
  if (/^[a-z]+(_[a-z]+)*$/.test(text)) {
    return 'snake_case';
  } else if (/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/.test(text)) {
    return 'PascalCase';
  } else if (/^[a-z]+(?:[A-Z][a-z]+)*$/.test(text)) {
    return 'camelCase';
  }
  return 'words';
}

function splitCasedText(text: string, caseType: string): string {
  switch (caseType) {
    case 'snake_case':
      return text.split('_').join(' ');
    case 'PascalCase':
    case 'camelCase':
      return text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    default:
      return text;
  }
}

async function translateText(text: string, apiKey: string, targetLanguage: string): Promise<string> {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      messages: [
        {
          role: 'system',
          content: `You are a helpful translator. Translate the following text to ${targetLanguage}:`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 4000,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const translation = response.data.choices[0].message.content.trim();
  return translation;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.translateText', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    const caseType = detectCase(text);
    const splitText = splitCasedText(text, caseType);

    const config = vscode.workspace.getConfiguration('translateText');
    const apiKey = config.get<string>('apiKey', '');
    const targetLanguage = config.get<string>('outputLanguage', defaultLanguage);

    if (!apiKey) {
      vscode.window.showErrorMessage('OpenAI API key is not set. Please configure it in the extension settings.');
      return;
    }

    try {
      const translatedText = await translateText(splitText, apiKey, targetLanguage);

      vscode.window.showInformationMessage(`
				${splitText}: ${translatedText}
			`);
    } catch (error) {
      vscode.window.showErrorMessage(`Translation failed: ${(error as any).message || 'Unknown error'}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
