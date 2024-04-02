// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
*/
// Inside extension.js
function activate(context) {
	const config = vscode.workspace.getConfiguration('hustler');
	let intervalId = setInterval(() => {
		vscode.commands.executeCommand('hustler.growthPrompt');
	}, config.get('intervalDuration') * 1000);

	let disposable = vscode.commands.registerCommand('hustler.growthPrompt', async function () {
		const config = vscode.workspace.getConfiguration('hustler');
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
				}, config.get('intervalDuration') * 1000);
			}, new Date().setHours(24, 0, 0, 0) - new Date()); // restart setInterval at midnight

		} else if (selection === notYetItem) {
			// do nothing

		} else if (selection === notNeededItem) {
			clearInterval(intervalId);
			intervalId = null;
		}

	});

	context.subscriptions.push(disposable);

	vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('hustler.intervalDuration')) {
			const config = vscode.workspace.getConfiguration('hustler');
			console.debug(`intervalDuration changed to ${config.get('intervalDuration')} seconds`);
			clearInterval(intervalId);
			intervalId = setInterval(() => {
				vscode.commands.executeCommand('hustler.growthPrompt');
			}, config.get('intervalDuration') * 1000);
		}
	})
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
