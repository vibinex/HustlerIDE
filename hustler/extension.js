// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let intervalId;

/**
 * @param {vscode.ExtensionContext} context
*/
// Inside extension.js
function activate(context) {
	const INTERVAL_DURATION = 60 * 60 * 1000;

	intervalId = setInterval(() => {
		vscode.commands.executeCommand('hustler.growthPrompt');
	}, INTERVAL_DURATION);

	let disposable = vscode.commands.registerCommand('hustler.growthPrompt', async function () {

		const yesItem = { title: 'Yes' };
		const notYetItem = { title: 'Not yet' };
		const notNeededItem = { title: 'Not needed for this project' };

		const selection = await vscode.window.showInformationMessage(
			'Hey, have you spent any time talking to customers or marketing this product today?',
			yesItem, notYetItem, notNeededItem
		);

		if (selection === yesItem) {
			clearInterval(intervalId);
			setTimeout(() => {
				intervalId = setInterval(() => {
					vscode.commands.executeCommand('hustler.growthPrompt');
				}, INTERVAL_DURATION);
			}, new Date().setHours(24, 0, 0, 0) - new Date());

		} else if (selection === notYetItem) {
			// do nothing

		} else if (selection === notNeededItem) {
			clearInterval(intervalId);
			intervalId = null;
		}

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
