import {
	App,
	Plugin,
	PluginSettingTab,
	Setting
} from 'obsidian';

import {
	PluginSettings,
	DEFAULT_SETTINGS,
} from "./settings";

import {
	SIMPLE_RECALL_ICON,
	SIMPLE_RECALL_TITLE,
	SIMPLE_RECALL_VIEW_TYPE,
	SimpleRecallView
} from "./view";

import { isPositiveInteger } from "./utils/isInteger";

export default class SimpleRecallPlugin extends Plugin {
	settings: PluginSettings;
	
	async onload() {
		await this.loadSettings();
		
		const ribbonIconEl = this.addRibbonIcon(
			SIMPLE_RECALL_ICON,
			SIMPLE_RECALL_TITLE,
			(evt: MouseEvent) => { this.activateView() }
		);
		ribbonIconEl.addClass('my-plugin-ribbon-class');
		
		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
					
		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });
		
		this.addSettingTab(new SimpleRecallSettingTab(this.app, this));

		this.registerView(
			SIMPLE_RECALL_VIEW_TYPE,
			(leaf) => new SimpleRecallView(leaf, this.settings)
		);
		
		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });
		
		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	// handleVaultChange(file: any) {
	// }

	// registerVaultWatchers() {
	// 	if (this.settings.doWatchVaultChange) {
	// 		this.registerEvent(this.app.vault.on("modify", this.handleVaultChange));
	// 		this.registerEvent(this.app.vault.on("delete", this.handleVaultChange));
	// 	} else {
	// 		this.app.vault.off("modify", this.handleVaultChange);
	// 		this.app.vault.off("delete", this.handleVaultChange);
	// 	}
	// }

	async activateView() {
		this.app.workspace.detachLeavesOfType(SIMPLE_RECALL_VIEW_TYPE);
	
		await this.app.workspace.getRightLeaf(false).setViewState({
			type: SIMPLE_RECALL_VIEW_TYPE,
			active: true,
		});
	
		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(SIMPLE_RECALL_VIEW_TYPE)[0]
		);
	}
	
	onunload() {
		this.app.workspace.detachLeavesOfType(SIMPLE_RECALL_VIEW_TYPE);
	}
	
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	
	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class ExcludedPathsSettingModal extends Modal {
// 	plugin: MyPlugin;
// 	pathText: string;
// 	excludedPaths: string[];
	
// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app);
// 		this.plugin = plugin;
// 		this.excludedPaths = plugin.settings.excludedPaths;
// 	}

// 	async onSubmit(newPaths: string[]) {
// 		this.plugin.settings.excludedPaths = newPaths
// 		await this.plugin.saveSettings();
// 	}
	
// 	onOpen(): void {
// 		const { contentEl } = this;
// 		contentEl.createEl("h1", { text: "Paths excluded from recall" });
		
// 		new Setting(contentEl)
// 			.setName("Path")
// 			.addSearch(searchComponent => searchComponent
// 				.setPlaceholder('Enter path or "/regex"..')
// 				.onChange((value) => {
// 					this.pathText = value;
// 				})
// 			)
// 			.addButton(ButtonComponent => ButtonComponent
// 				.setButtonText("Add")
// 				.onClick(() => {
// 					this.excludedPaths.push(this.pathText)
// 				})
// 			);
			
// 		new Setting(contentEl)
// 			.addButton((btn) => btn
// 				.setButtonText("Done")
// 				.setCta()
// 				.onClick(() => {
// 					this.close();
// 					this.onSubmit(this.excludedPaths);
// 				})
// 			);
// 	}
		
// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }
	
class SimpleRecallSettingTab extends PluginSettingTab {
	plugin: SimpleRecallPlugin;
	maxFilesSetting: Setting;
	
	constructor(app: App, plugin: SimpleRecallPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}
	
	display(): void {
		const { containerEl } = this;
		
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Simple Recall Settings.' });

		// new Setting(containerEl)
		// 	.setName('Watch for file changes?')
		
		new Setting(containerEl)
			.setName('Tracking (days)')
			.setDesc('Number of days to track')
			.addText(numberComponent => numberComponent
				.setValue(String(this.plugin.settings.daysToTrack))
				.onChange(async (value) => {
					if (!isPositiveInteger(value)) return;
					this.plugin.settings.daysToTrack = Number(value);
					await this.plugin.saveSettings();
				})
			);
			
		// new Setting(containerEl)
		// 	.setName('Excluded Paths')
		// 	.addButton(buttonComponent => buttonComponent
		// 		.onClick(() => new ExcludedPathsSettingModal(this.app, this.plugin).open())
		// 	);

		new Setting(containerEl)
			.setName('Limit Number of Files?')
			.setDesc('Should the number of files be limited?')
			.addToggle(toggleComponent => toggleComponent
				.setValue(this.plugin.settings.doLimitNumberOfFiles)
				.onChange(async (value) => {
					this.plugin.settings.doLimitNumberOfFiles = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);
		
		this.maxFilesSetting = new Setting(containerEl)
			.setName('Maximum Number of Files')
			.setDesc('Total number of files to limit per recall')
			.setDisabled(!this.plugin.settings.doLimitNumberOfFiles)
			.setClass(this.plugin.settings.doLimitNumberOfFiles ? 'sub-text-1' : 'sub-text-1--disabled')
			.addText(textComponent => textComponent
				.setPlaceholder('Number of files')
				.setValue(String(this.plugin.settings.maximumNumberOfFiles))
				.onChange(async (value) => {
					if (!isPositiveInteger(value)) return;
					this.plugin.settings.maximumNumberOfFiles = Number(value);
					await this.plugin.saveSettings();
				})
			);
	}
}
